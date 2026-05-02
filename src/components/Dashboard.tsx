import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MessageSquare, Laptop, Download, Send, 
  Sparkles, ChevronRight, FileText, Layout as LayoutIcon, 
  TrendingUp, Star, MapPin, X, Github, ExternalLink, Loader2,
  FileDown, User, Zap
} from 'lucide-react';
import { UserProfile, Job, ChatMessage } from '../lib/types';
import { analyzeJobMatch, careerCopilotResponse } from '../lib/gemini';
import { ModernCorporate, CreativeDark, ExecutiveSerif, TechMinimal } from './Themes';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DashboardProps {
  user: UserProfile;
  onEdit: () => void;
}

type ThemeID = 'corporate' | 'creative' | 'executive' | 'tech';

export default function Dashboard({ user, onEdit }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'cv' | 'jobs' | 'ai'>('cv');
  const [selectedTheme, setSelectedTheme] = useState<ThemeID>('corporate');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobQuery, setJobQuery] = useState('');
  const [jobLocation, setJobLocation] = useState(user.location || '');
  const [jobEngine, setJobEngine] = useState<'google_jobs' | 'linkedin'>('google_jobs');
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastExp = user.experience[0]?.role || "";
    const skillsQuery = user.skills.slice(0, 2).join(" ");
    const initialQuery = `${lastExp} ${skillsQuery}`.trim() || "software engineer";
    setJobQuery(initialQuery);
    fetchJobs(initialQuery, user.location);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const fetchJobs = async (queryOverride?: string, locOverride?: string, engineOverride?: string) => {
    setIsLoadingJobs(true);
    setJobError(null);
    const q = queryOverride !== undefined ? queryOverride : jobQuery;
    const l = locOverride !== undefined ? locOverride : jobLocation;
    const e = engineOverride !== undefined ? engineOverride : jobEngine;

    try {
      const response = await fetch(`/api/jobs?query=${encodeURIComponent(q)}&location=${encodeURIComponent(l)}&engine=${e}`);
      const data = await response.json();
      
      if (data.error) {
        console.error("SerpAPI Error:", data.error);
        setJobError(data.error);
        setJobs([]);
      } else {
        setJobs(data.jobs_results || []);
      }
    } catch (error) {
      console.error("Job fetch failed", error);
      setJobError("Failed to connect to job search service.");
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleJobSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const downloadCV = async () => {
    setIsExporting(true);
    
    // Confetti for UX
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#E5E4E0']
    });

    try {
      const element = document.getElementById(getThemeID(selectedTheme));
      if (!element) throw new Error("CV element not found");

      const canvas = await html2canvas(element, {
        scale: 2, // High-res
        useCORS: true,
        logging: false,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          // Replace oklch/oklab with a fallback color to prevent parser errors in html2canvas
          const styleElements = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleElements.length; i++) {
            let css = styleElements[i].innerHTML;
            // regex to catch oklch/oklab and replace with white/neutral fallback
            css = css.replace(/oklch\([^)]+\)/g, '#f5f5f5');
            css = css.replace(/oklab\([^)]+\)/g, '#f5f5f5');
            styleElements[i].innerHTML = css;
          }
          // Also check inline styles on the element itself
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const bg = el.style.backgroundColor;
              if (bg && (bg.includes('oklch') || bg.includes('oklab'))) {
                el.style.backgroundColor = '#f5f5f5';
              }
              const border = el.style.borderColor;
              if (border && (border.includes('oklch') || border.includes('oklab'))) {
                el.style.borderColor = '#e5e5e5';
              }
              const color = el.style.color;
              if (color && (color.includes('oklch') || color.includes('oklab'))) {
                el.style.color = '#333333';
              }
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ThemeCV_${user.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Export failed, falling back to print", error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const getThemeID = (id: ThemeID) => {
    switch (id) {
      case 'corporate': return 'cv-modern';
      case 'creative': return 'cv-creative';
      case 'executive': return 'cv-executive';
      case 'tech': return 'cv-tech';
    }
  };

  const renderTheme = () => {
    switch (selectedTheme) {
      case 'corporate': return <ModernCorporate data={user} />;
      case 'creative': return <CreativeDark data={user} />;
      case 'executive': return <ExecutiveSerif data={user} />;
      case 'tech': return <TechMinimal data={user} />;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: inputMessage, timestamp: Date.now() };
    setChatHistory(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await careerCopilotResponse([...chatHistory, newMessage]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (error) {
      console.error("Copilot failed", error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : "Service unavailable"}`, timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-editorial-bg text-editorial-ink flex overflow-hidden font-sans transition-colors duration-500">
      {/* Side Rail Navigation */}
      <nav className="w-20 hover:w-64 border-r border-editorial-border bg-white dark:bg-[#080808] transition-all duration-500 group/rail flex flex-col z-50 shrink-0 select-none">
        <div className="p-6 mb-10 h-20 flex items-center shrink-0">
          <div className="w-8 h-8 bg-editorial-accent rounded-lg rotate-45 shrink-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white -rotate-45" />
          </div>
          <span className="font-display font-black text-sm uppercase tracking-tighter opacity-0 group-hover/rail:opacity-100 transition-opacity ml-4">Foundry<span className="font-light text-neutral-400 italic">OS</span></span>
        </div>
        
        <div className="flex-1 px-4 space-y-4">
          <RailItem active={activeTab === 'cv'} onClick={() => setActiveTab('cv')} icon={<LayoutIcon size={20} />} label="Drafting Cabinet" />
          <RailItem active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={20} />} label="Market Search" />
          <RailItem active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<Sparkles size={20} />} label="Neural Copilot" />
        </div>

        <div className="p-6 border-t border-editorial-border mt-auto">
          <button onClick={onEdit} className="w-full h-10 flex items-center gap-4 text-neutral-400 hover:text-black dark:hover:text-white transition-colors overflow-hidden">
            <User size={20} className="shrink-0" />
            <span className="text-[10px] font-display font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/rail:opacity-100 transition-opacity">Profile Registry</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Floating Header */}
        <header className="h-20 glass flex items-center px-12 justify-between shrink-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-600">Active Sector</h2>
            <span className="text-sm font-display font-black uppercase tracking-widest">
              {activeTab === 'cv' ? 'Professional Drafting' : activeTab === 'jobs' ? 'Lead Extraction' : 'Neural Induction'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-10 border-r border-editorial-border pr-10">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-neutral-400">SYNC_STATUS</span>
                  <span className="text-[10px] font-display font-bold uppercase text-emerald-500">Encrypted</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-neutral-400">Uptime</span>
                  <span className="text-[10px] font-display font-bold uppercase">99.98%</span>
               </div>
            </div>
            <button 
              onClick={downloadCV} 
              disabled={isExporting}
              className="bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-2xl text-[10px] font-display font-bold uppercase tracking-widest hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl"
            >
              {isExporting ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={14} />}
              {isExporting ? "Processing..." : "Export Artifact"}
            </button>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-editorial-surface dark:bg-[#050505] transition-colors">
          {activeTab === 'cv' && (
            <div className="max-w-7xl mx-auto space-y-12">
               {/* Bento Dash Section */}
               <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8">
                     <div className="editorial-card p-1 items-center flex flex-col">
                        <div className="w-full p-6 flex justify-between items-center border-b border-editorial-border mb-8">
                           <span className="text-[10px] font-display font-black uppercase tracking-widest text-neutral-400">Live Preview Layer</span>
                           <div className="flex bg-neutral-50 dark:bg-neutral-900 rounded-full p-1 border border-editorial-border no-print shadow-inner">
                              <ThemePill active={selectedTheme === 'corporate'} onClick={() => setSelectedTheme('corporate')} color="#000000" label="Editorial" />
                              <ThemePill active={selectedTheme === 'creative'} onClick={() => setSelectedTheme('creative')} color="#FF5A1F" label="Creative" />
                              <ThemePill active={selectedTheme === 'executive'} onClick={() => setSelectedTheme('executive')} color="#717171" label="Executive" />
                              <ThemePill active={selectedTheme === 'tech'} onClick={() => setSelectedTheme('tech')} color="#171717" label="Brutalist" />
                           </div>
                        </div>
                        <motion.div 
                          key={selectedTheme}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full max-w-[210mm] shadow-3xl rounded-sm overflow-hidden bg-white print:shadow-none print:rounded-none mb-12"
                        >
                           <div className="transform origin-top transition-transform">
                              {selectedTheme === 'corporate' && <ModernEditor user={user} />}
                              {selectedTheme === 'creative' && <CreativeTemplate user={user} />}
                              {selectedTheme === 'executive' && <ExecutiveTemplate user={user} />}
                              {selectedTheme === 'tech' && <BrutalistTemplate user={user} />}
                           </div>
                        </motion.div>
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                     <div className="editorial-card p-10 bg-editorial-accent text-white border-none shadow-2xl shadow-editorial-accent/20">
                        <h3 className="text-3xl font-display font-black tracking-tightest leading-none mb-6 uppercase">Induction <br />complete.</h3>
                        <p className="text-sm font-serif italic mb-10 opacity-80 leading-relaxed">
                           "Your career architecture has been synthesized based on Tier 1 industry standards. Market resonance is high."
                        </p>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                              <Zap size={18} />
                           </div>
                           <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Ready for Deployment</span>
                        </div>
                     </div>

                     <div className="editorial-card p-10">
                        <span className="text-[10px] font-display font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600 block mb-8">Performance Metrics</span>
                        <div className="space-y-8">
                           <StatBar label="Market Resonance" value={92} />
                           <StatBar label="Clarity Score" value={88} />
                           <StatBar label="AI Parsing Index" value={95} />
                        </div>
                        <div className="mt-12 pt-8 border-t border-editorial-border">
                           <p className="text-[9px] font-mono text-neutral-400">RECOMENDATION: Enhance project outcomes with quantitative metrics for +12% resonance.</p>
                        </div>
                     </div>

                     <div className="editorial-card p-10 bg-black dark:bg-white dark:text-black text-white">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-[9px] font-display font-bold uppercase tracking-widest opacity-60">Neural Watcher</span>
                        </div>
                        <p className="text-lg font-serif italic leading-relaxed">
                           Found 4 new leads matching your <span className="text-editorial-accent">tactical stack</span> in the last 2 hours.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-editorial-border pb-10 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-editorial-accent">Marketplace Discovery</span>
                  <h2 className="text-7xl font-display font-black tracking-tighter leading-none">JOB <span className="font-light italic">HUB</span></h2>
                  <p className="text-sm font-serif italic text-neutral-400">Finding the perfect match for {user.fullName}</p>
                </div>
                
                <form onSubmit={handleJobSearch} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="flex gap-2 p-1 bg-white dark:bg-neutral-900 border border-editorial-border dark:border-neutral-800 rounded-2xl shadow-sm">
                    <select 
                      value={jobEngine}
                      disabled={isLoadingJobs}
                      onChange={(e) => setJobEngine(e.target.value as any)}
                      className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl ml-1 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-50 appearance-none cursor-pointer dark:text-white"
                    >
                      <option value="google_jobs">Google</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    <input 
                      type="text" 
                      value={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      placeholder="Role"
                      className="flex-1 min-w-[200px] bg-transparent border-none px-4 py-3 text-sm focus:ring-0 outline-none font-display font-medium dark:text-white"
                    />
                    <input 
                      type="text" 
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="Location"
                      className="w-32 bg-transparent border-l border-editorial-border dark:border-neutral-800 px-4 py-3 text-sm focus:ring-0 outline-none font-display font-medium dark:text-white"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoadingJobs}
                    className="bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.2em] hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-editorial-accent/20"
                  >
                    {isLoadingJobs ? <Loader2 size={16} className="animate-spin" /> : <Briefcase size={16} />}
                    Scan Leads
                  </button>
                </form>
              </div>

              {jobError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm italic font-serif flex items-center justify-between">
                  <p>⚠️ {jobError}</p>
                  <button 
                    onClick={() => fetchJobs()}
                    className="text-xs uppercase font-sans font-black tracking-widest hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {isLoadingJobs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-editorial-surface rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {jobs.length > 0 ? jobs.map((job) => (
                    <JobCard key={job.job_id} job={job} user={user} />
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-6">
                      <div className="text-4xl opacity-10">📭</div>
                      <p className="text-xl font-serif italic text-neutral-400">No matches found for "{jobQuery}" in {jobLocation || 'Anywhere'}.</p>
                      <button 
                        onClick={() => {
                          setJobQuery("Software Engineer");
                          fetchJobs("Software Engineer", jobLocation);
                        }}
                        className="editorial-button-secondary"
                      >
                        Try a broader search
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-neutral-900 border border-editorial-border dark:border-neutral-800 rounded-tl-3xl rounded-tr-3xl shadow-2xl overflow-hidden mt-12">
              <div className="p-8 border-b border-editorial-border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black dark:bg-white dark:text-black rounded-2xl flex items-center justify-center text-white">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black tracking-tighter uppercase leading-none">CAREER <span className="font-light italic">COPILOT</span></h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-emerald-600">Cognitive Layer Active</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[9px] font-display font-bold uppercase tracking-widest text-neutral-300">Neural Sync</span>
                  <span className="font-mono text-[10px] text-neutral-400">v4.0.2-editorial</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar bg-white dark:bg-neutral-950 px-10 relative">
                {chatHistory.length === 0 && (
                  <div className="text-center py-32 space-y-6">
                    <div className="inline-block p-4 bg-neutral-50 dark:bg-neutral-900 rounded-full mb-4">
                      <MessageSquare className="text-neutral-200" size={48} />
                    </div>
                    <p className="text-4xl font-display font-black tracking-tighter text-neutral-200 leading-tight">How shall we evolve your <br /><span className="font-serif italic font-light">narrative</span> today?</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-8 rounded-3xl font-serif text-lg leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-black text-white italic rounded-tr-none dark:bg-white dark:text-black shadow-xl" 
                        : "bg-neutral-50 text-neutral-700 border border-editorial-border dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 rounded-tl-none font-sans text-base antialiased"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl rounded-tl-none">
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-8 border-t border-editorial-border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex gap-4 p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-editorial-border dark:border-neutral-800 shadow-inner focus-within:border-editorial-accent transition-all">
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your career objective..."
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:ring-0 outline-none font-display font-medium dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-black dark:bg-white dark:text-black text-white p-4 rounded-xl hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all disabled:opacity-50 shadow-lg"
                    disabled={!inputMessage.trim() || isTyping}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function RailItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full px-3 py-4 rounded-2xl flex items-center gap-6 transition-all duration-300 group/item relative",
        active 
          ? "bg-black dark:bg-white text-white dark:text-black shadow-xl scale-105 z-10" 
          : "text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
      )}
    >
      <div className={cn("shrink-0 transition-transform duration-500", active && "scale-110")}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-display font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500",
        "opacity-0 group-hover/rail:opacity-100",
        active ? "opacity-100" : ""
      )}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="rail-active"
          className="absolute left-[-1.5rem] w-1.5 h-8 bg-editorial-accent rounded-r-full"
        />
      )}
    </button>
  );
}

function StatBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-display font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{label}</span>
        <span className="font-mono text-[11px] font-medium dark:text-white/80">{value}%</span>
      </div>
      <div className="w-full h-[3px] bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-editorial-accent"
        />
      </div>
    </div>
  );
}

function ThemePill({ active, onClick, color, label }: { active: boolean, onClick: () => void, color: string, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-2 rounded-full transition-all text-neutral-400 dark:text-neutral-600 hover:text-black dark:hover:text-white font-display font-extrabold uppercase tracking-widest text-[10px]",
        active ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "bg-transparent"
      )}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </button>
  );
}

function JobCard({ job, user }: { job: Job, user: UserProfile }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeJobMatch(user, job);
      setAnalysis(res);
    } catch (e) { console.error(e); }
    finally { setIsAnalyzing(false); }
  };

  return (
    <div className="editorial-card p-10 group hover:border-black dark:hover:border-editorial-accent cursor-pointer bg-white dark:bg-neutral-900/40 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-neutral-50 dark:bg-neutral-800 rounded-full group-hover:bg-editorial-accent transition-all duration-500 opacity-20 -rotate-45" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-display font-black uppercase tracking-tighter rounded">98% Match</span>
            <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700">#{job.job_id.slice(-6)}</span>
          </div>
          <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 italic">{job.via || 'Direct Link'}</span>
        </div>
        {job.thumbnail && <img src={job.thumbnail} className="w-12 h-12 rounded-xl grayscale group-hover:grayscale-0 transition-all border border-editorial-border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-1" alt="" />}
      </div>
      
      <div className="mb-8 relative z-10">
        <h4 className="text-2xl font-display font-black mb-2 tracking-tight group-hover:text-editorial-accent transition-colors leading-tight dark:text-white uppercase">{job.title}</h4>
        <p className="text-sm font-serif italic text-neutral-500 dark:text-neutral-400">{job.company_name} <span className="mx-2 not-italic text-neutral-200 dark:text-neutral-800">/</span> {job.location || 'Remote'}</p>
      </div>

      <div className="relative z-10">
        {analysis ? (
          <div className="space-y-6 pt-6 border-t border-editorial-border dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">AI Analysis Reached</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif italic leading-relaxed border-l-4 border-editorial-accent pl-6 py-1">
              "{analysis.explanation}"
            </p>
            {analysis.improvementPoints && (
              <div className="pt-2">
                <span className="text-[9px] font-display font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4 block">Optimizations</span>
                <ul className="grid grid-cols-1 gap-3">
                  {analysis.improvementPoints.slice(0, 2).map((p: string, i: number) => (
                    <li key={i} className="flex gap-4 text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      <span className="text-editorial-accent tracking-widest text-[8px] mt-0.5 opacity-60">0{i+1}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-6">
              <a 
                href={job.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl text-[10px] font-display font-bold uppercase tracking-[0.3em] hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all flex items-center justify-center gap-3 group/btn hover:scale-[1.02]"
              >
                Launch Application
                <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-6 border-t border-editorial-border dark:border-neutral-800">
            <button 
              onClick={(e) => { e.stopPropagation(); getAnalysis(); }}
              disabled={isAnalyzing}
              className="w-full py-4 bg-white dark:bg-neutral-800 border border-editorial-border dark:border-neutral-700 rounded-xl text-[10px] font-display font-black uppercase tracking-[0.4em] hover:border-black dark:hover:border-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 dark:text-white"
            >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-editorial-accent" />}
              {isAnalyzing ? "Processing Matrix..." : "Analyze Potential"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TEMPLATES ---

function ModernEditor({ user }: { user: UserProfile }) {
  return (
    <div id="cv-modern" className="p-[30mm] bg-white text-black min-h-[297mm]">
      <header className="border-b-[4px] border-black pb-12 mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-7xl font-display font-black uppercase tracking-tightest leading-[0.8] mb-4">
            {user.fullName.split(' ')[0]} <br />
            <span className="text-editorial-accent">{user.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl font-serif italic text-neutral-500">{user.experience[0]?.role}</p>
        </div>
        <div className="text-right text-[10px] font-display font-bold uppercase tracking-widest space-y-1">
          <p>{user.email}</p>
          <p>{user.location}</p>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-20 mb-20">
        <aside className="col-span-4">
          <h2 className="text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8 text-neutral-400 dark:text-neutral-500">Identity</h2>
          <p className="font-serif italic text-sm leading-relaxed mb-12">{user.summary}</p>
          
          <h2 className="text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8 text-neutral-400 dark:text-neutral-500">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="text-[10px] font-display font-bold uppercase border border-neutral-100 px-3 py-1">{skill}</span>
            ))}
          </div>
        </aside>
        
        <main className="col-span-8 space-y-16">
          <div>
            <h2 className="text-[10px] font-display font-black uppercase tracking-[0.4em] mb-10 text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-4">Chronology</h2>
            <div className="space-y-12">
              {user.experience.map((exp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight">{exp.role}</h3>
                    <span className="text-[10px] font-mono text-neutral-400">{exp.period}</span>
                  </div>
                  <p className="text-sm font-display font-bold uppercase text-editorial-accent mb-4">{exp.company}</p>
                  <p className="text-sm font-serif italic leading-relaxed text-neutral-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

function CreativeTemplate({ user }: { user: UserProfile }) {
  return (
    <div id="cv-creative" className="p-[30mm] bg-[#FAFAFA] text-[#1A1A1A] min-h-[297mm] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-editorial-accent/5 rounded-full -mr-64 -mt-64 blur-3xl" />
      
      <header className="relative z-10 mb-24">
        <span className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-editorial-accent block mb-8">Professional Portfolio Artifact</span>
        <h1 className="text-9xl font-display font-black uppercase tracking-tightest leading-[0.7] mb-6">
          {user.fullName.split(' ').map((n, i) => (
            <span key={i} className={cn("block", i === 1 && "pl-20 text-neutral-300")}>{n}</span>
          )) || user.fullName}
        </h1>
        <p className="text-2xl font-serif italic max-w-2xl leading-relaxed text-neutral-600">{user.summary}</p>
      </header>

      <div className="grid grid-cols-12 gap-16 relative z-10">
        <div className="col-span-7">
          <h2 className="text-4xl font-display font-black uppercase mb-12 tracking-tight">Timeline <span className="text-editorial-accent">.</span></h2>
          <div className="space-y-12 border-l border-neutral-200 pl-10">
            {user.experience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[45px] top-2 w-2 h-2 bg-black rounded-full" />
                <span className="text-[10px] font-mono mb-2 block text-neutral-400">{exp.period}</span>
                <h3 className="text-lg font-display font-black uppercase mb-1">{exp.role}</h3>
                <p className="text-sm font-serif italic mb-4">{exp.company}</p>
                <p className="text-xs leading-relaxed text-neutral-500">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 pt-20">
          <div className="bg-black text-white p-12 rounded-3xl mb-12">
            <h3 className="text-[10px] font-display font-bold uppercase tracking-[0.4em] mb-10 opacity-40">Core Tactical Stack</h3>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, i) => (
                <span key={i} className="text-[10px] font-display font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/5">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="px-6 space-y-8">
             <div className="space-y-1">
                <span className="text-[9px] font-display font-bold uppercase text-neutral-400">Communication</span>
                <p className="text-sm font-display font-bold">{user.email}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] font-display font-bold uppercase text-neutral-400">Registry</span>
                <p className="text-sm font-display font-bold">{user.location}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutiveTemplate({ user }: { user: UserProfile }) {
  return (
    <div id="cv-executive" className="p-[40mm] bg-[#FCFAF7] text-[#1a1a1a] min-h-[297mm] font-serif">
      <header className="text-center mb-24">
        <h1 className="text-5xl font-serif italic mb-6 tracking-tight text-black">{user.fullName}</h1>
        <div className="flex justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-sans font-bold">
           <span>{user.location}</span>
           <span>•</span>
           <span>{user.email}</span>
        </div>
      </header>

      <section className="space-y-20 max-w-2xl mx-auto">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-neutral-300 font-sans font-bold mb-8 text-center">Executive Summary</h2>
          <p className="text-lg leading-relaxed text-center italic text-neutral-700">{user.summary}</p>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-neutral-300 font-sans font-bold mb-10 border-b pb-4">Professional Trajectory</h2>
          <div className="space-y-12">
            {user.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <span className="text-xs italic text-neutral-400">{exp.period}</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest font-sans font-bold text-neutral-400 mb-4">{exp.company}</p>
                <p className="text-sm leading-relaxed text-neutral-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
           <h2 className="text-xs uppercase tracking-[0.4em] text-neutral-300 font-sans font-bold mb-8">Strategic Domains</h2>
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {user.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-neutral-100 py-2">
                   <div className="w-1 h-1 bg-black rounded-full" />
                   <span className="text-sm italic">{skill}</span>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}

function BrutalistTemplate({ user }: { user: UserProfile }) {
  return (
    <div id="cv-tech" className="bg-white text-black min-h-[297mm] font-mono p-0 overflow-hidden">
      <div className="grid grid-cols-12 min-h-[297mm] border-4 border-black">
        <header className="col-span-12 border-b-4 border-black p-12 bg-black text-white">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-4 break-all">{user.fullName}</h1>
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold uppercase">{user.experience[0]?.role}</span>
            <span className="text-sm">{user.location} // {user.email}</span>
          </div>
        </header>

        <aside className="col-span-4 border-r-4 border-black p-10 space-y-12 h-full">
           <div>
              <h2 className="bg-black text-white px-2 py-1 inline-block text-xs uppercase mb-6">/PROFILE</h2>
              <p className="text-sm uppercase leading-tight font-bold">{user.summary}</p>
           </div>
           
           <div>
              <h2 className="bg-black text-white px-2 py-1 inline-block text-xs uppercase mb-6">/STACK</h2>
              <div className="space-y-1 uppercase text-sm font-bold">
                 {user.skills.map((skill, i) => (
                   <div key={i} className="hover:bg-black hover:text-white px-1 transition-colors">&gt;&gt; {skill}</div>
                 ))}
              </div>
           </div>
        </aside>

        <main className="col-span-8 p-12 space-y-16">
           <div>
              <h2 className="text-2xl font-black uppercase mb-10 border-b-4 border-black inline-block">LOG_EXPERIENCE</h2>
              <div className="space-y-12">
                 {user.experience.map((exp, i) => (
                   <div key={i} className="border-2 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex justify-between mb-2">
                        <span className="font-black text-lg">{exp.role}</span>
                        <span className="bg-neutral-100 px-2">{exp.period}</span>
                      </div>
                      <p className="text-xs uppercase font-bold mb-4 opacity-40">{exp.company}</p>
                      <p className="text-sm uppercase leading-snug">{exp.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}

