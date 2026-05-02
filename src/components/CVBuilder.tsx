import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, User, 
  Briefcase, GraduationCap, Code, Plus, Trash2, 
  Award, Shield, Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../lib/types';
import { generateCVContent } from '../lib/gemini';
import { cn } from '../lib/utils';

interface CVBuilderProps {
  onComplete: (user: UserProfile) => void;
}

type Step = 'intro' | 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'extra' | 'review';

const STEPS: { id: Step, label: string, icon: any }[] = [
  { id: 'intro', label: 'Start', icon: Sparkles },
  { id: 'personal', label: 'Identity', icon: User },
  { id: 'experience', label: 'History', icon: Briefcase },
  { id: 'education', label: 'Origins', icon: GraduationCap },
  { id: 'skills', label: 'Arsenal', icon: Code },
  { id: 'projects', label: 'Impact', icon: Shield },
  { id: 'extra', label: 'Depth', icon: Award },
  { id: 'review', label: 'Review', icon: Check },
];

export default function CVBuilder({ onComplete }: CVBuilderProps) {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<any>({
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', portfolio: '', summary: '',
    experience: [], education: [], skills: [],
    projects: [], certifications: [], languages: [],
    awards: [], hobbies: []
  });

  const next = () => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const back = () => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1].id);
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const cv = await generateCVContent(formData);
      onComplete(cv);
    } catch (e) {
      console.error(e);
      // Fallback if AI fails
      onComplete(formData as UserProfile);
    } finally {
      setIsGenerating(false);
    }
  };

  const addArrayItem = (key: string, defaultVal: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: [...prev[key], { ...defaultVal, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const removeArrayItem = (key: string, id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.id !== id)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl text-center space-y-12 relative">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-editorial-accent opacity-[0.05] rounded-full blur-[80px]" />
            <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto mb-16 shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
              <Sparkles className="text-white fill-current group-hover:scale-125 transition-transform" size={40} />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-editorial-accent">Foundry Induction</span>
              <h1 className="text-8xl font-display font-black tracking-tightest leading-[0.85] uppercase">
                Build your <br /><span className="font-serif italic font-light lowercase text-neutral-300">future</span>.
              </h1>
            </div>
            <p className="text-xl text-neutral-400 font-serif italic leading-relaxed max-w-xl mx-auto">
              Our AI architect will help you construct a narrative that commands attention and defines your professional dominance.
            </p>
            <button 
              onClick={next} 
              className="bg-black text-white px-16 py-6 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.4em] hover:bg-black/90 transition-all shadow-2xl hover:scale-110 active:scale-95 mt-16"
            >
              Begin Induction <ArrowRight className="ml-4 inline" size={18} />
            </button>
          </motion.div>
        );

      case 'personal':
        return (
          <StepContainer title="Identity & Presence" description="The foundation of your professional existence.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Full Name" value={formData.fullName} onChange={v => setFormData({ ...formData, fullName: v })} placeholder="e.g. Julian Vane" />
              <InputGroup label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="e.g. julian@vane.com" />
              <InputGroup label="Phone Number" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="e.g. +1 555 0123" />
              <InputGroup label="Location" value={formData.location} onChange={v => setFormData({ ...formData, location: v })} placeholder="e.g. London, UK" />
              <InputGroup label="LinkedIn URL" value={formData.linkedin} onChange={v => setFormData({ ...formData, linkedin: v })} placeholder="linkedin.com/in/..." />
              <InputGroup label="Portfolio URL" value={formData.portfolio} onChange={v => setFormData({ ...formData, portfolio: v })} placeholder="yourname.com" />
            </div>
            <div className="mt-10">
              <label className="editorial-label mb-3 block">Professional Thesis (Summary)</label>
              <textarea 
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                className="w-full h-32 bg-white border border-editorial-border rounded-xl p-4 outline-none focus:border-black transition-all font-serif"
                placeholder="What is your core mission? Don't worry about wording—our AI will refine this."
              />
            </div>
          </StepContainer>
        );

      case 'experience':
        return (
          <StepContainer title="History of Impact" description="Chronicle your professional trajectory and significant results.">
            <div className="space-y-8">
              {formData.experience.map((exp: any) => (
                <div key={exp.id} className="p-8 border border-editorial-border rounded-2xl bg-white relative group">
                  <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputGroup label="Entity / Company" value={exp.company} onChange={v => {
                      const newExp = [...formData.experience];
                      const i = newExp.findIndex(e => e.id === exp.id);
                      newExp[i].company = v;
                      setFormData({ ...formData, experience: newExp });
                    }} />
                    <InputGroup label="Role / Designation" value={exp.role} onChange={v => {
                      const newExp = [...formData.experience];
                      const i = newExp.findIndex(e => e.id === exp.id);
                      newExp[i].role = v;
                      setFormData({ ...formData, experience: newExp });
                    }} />
                    <InputGroup label="Period (Start - End)" value={exp.period} onChange={v => {
                      const newExp = [...formData.experience];
                      const i = newExp.findIndex(e => e.id === exp.id);
                      newExp[i].period = v;
                      setFormData({ ...formData, experience: newExp });
                    }} />
                    <InputGroup label="Location" value={exp.location} onChange={v => {
                      const newExp = [...formData.experience];
                      const i = newExp.findIndex(e => e.id === exp.id);
                      newExp[i].location = v;
                      setFormData({ ...formData, experience: newExp });
                    }} />
                  </div>
                  <label className="editorial-label mb-2 block">Scope of Influence</label>
                  <textarea 
                    value={exp.description}
                    onChange={e => {
                      const newExp = [...formData.experience];
                      const i = newExp.findIndex(item => item.id === exp.id);
                      newExp[i].description = e.target.value;
                      setFormData({ ...formData, experience: newExp });
                    }}
                    className="w-full h-24 bg-editorial-surface rounded-xl p-4 mb-4 border border-transparent focus:border-black outline-none font-serif text-sm"
                    placeholder="Describe your responsibilities and the scale of your work..."
                  />
                  <div className="space-y-3">
                    <label className="editorial-label text-[10px]">Key Achievements (Comma separated)</label>
                    <input 
                      type="text"
                      className="w-full bg-editorial-surface rounded-lg p-3 outline-none"
                      placeholder="e.g. Increased revenue by 40%, Led a team of 10..."
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        const i = newExp.findIndex(item => item.id === exp.id);
                        newExp[i].achievements = e.target.value.split(',').map(s => s.trim());
                        setFormData({ ...formData, experience: newExp });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('experience', { company: '', role: '', period: '', location: '', description: '', achievements: [] })}
                className="w-full py-6 border-2 border-dashed border-editorial-border rounded-2xl flex items-center justify-center gap-3 text-neutral-400 hover:text-black hover:border-black transition-all bg-white"
              >
                <Plus size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Add Proffesional Experience</span>
              </button>
            </div>
          </StepContainer>
        );

      case 'education':
        return (
          <StepContainer title="Academic Origins" description="Your formal training and research foundations.">
            <div className="space-y-8">
              {formData.education.map((edu: any) => (
                <div key={edu.id} className="p-8 border border-editorial-border rounded-2xl bg-white relative group">
                  <button onClick={() => removeArrayItem('education', edu.id)} className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Institution" value={edu.school} onChange={v => {
                      const newEdu = [...formData.education];
                      const i = newEdu.findIndex(e => e.id === edu.id);
                      newEdu[i].school = v;
                      setFormData({ ...formData, education: newEdu });
                    }} />
                    <InputGroup label="Degree" value={edu.degree} onChange={v => {
                      const newEdu = [...formData.education];
                      const i = newEdu.findIndex(e => e.id === edu.id);
                      newEdu[i].degree = v;
                      setFormData({ ...formData, education: newEdu });
                    }} />
                    <InputGroup label="Field of Study" value={edu.field} onChange={v => {
                      const newEdu = [...formData.education];
                      const i = newEdu.findIndex(e => e.id === edu.id);
                      newEdu[i].field = v;
                      setFormData({ ...formData, education: newEdu });
                    }} />
                    <InputGroup label="Year & Location" value={edu.year} onChange={v => {
                      const newEdu = [...formData.education];
                      const i = newEdu.findIndex(e => e.id === edu.id);
                      newEdu[i].year = v;
                      setFormData({ ...formData, education: newEdu });
                    }} />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('education', { school: '', degree: '', field: '', year: '', location: '' })}
                className="w-full py-6 border-2 border-dashed border-editorial-border rounded-2xl flex items-center justify-center gap-3 text-neutral-400 hover:text-black hover:border-black transition-all bg-white"
              >
                <Plus size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Add Academic Entry</span>
              </button>
            </div>
          </StepContainer>
        );

      case 'skills':
        return (
          <StepContainer title="Technical & Creative Arsenal" description="Select the tools and philosophies you command.">
            <div className="space-y-10">
              <div>
                <label className="editorial-label mb-4 block">Primary Competencies (Technical)</label>
                <textarea 
                  className="w-full h-24 bg-white border border-editorial-border rounded-xl p-4 outline-none focus:border-black font-serif"
                  placeholder="e.g. React, Python, Product Strategy, LLM Alignment..."
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Languages" placeholder="e.g. English (Native), Japanese (JLPT N1)..." value={formData.languages.join(', ')} onChange={v => setFormData({ ...formData, languages: v.split(',').map(s => s.trim()) })} />
                <InputGroup label="Certifications" placeholder="e.g. AWS Certified Solutions Architect..." value={formData.certifications.join(', ')} onChange={v => setFormData({ ...formData, certifications: v.split(',').map(s => s.trim()) })} />
              </div>
            </div>
          </StepContainer>
        );

      case 'projects':
        return (
          <StepContainer title="Evidence of Skill" description="Showcase actual artifacts of your work and ambition.">
            <div className="space-y-8">
              {formData.projects.map((proj: any) => (
                <div key={proj.id} className="p-8 border border-editorial-border rounded-2xl bg-white relative group">
                   <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputGroup label="Project Name" value={proj.name} onChange={v => {
                      const newProj = [...formData.projects];
                      const i = newProj.findIndex(e => e.id === proj.id);
                      newProj[i].name = v;
                      setFormData({ ...formData, projects: newProj });
                    }} />
                    <InputGroup label="Tech Stack" value={proj.techStack?.join(', ')} onChange={v => {
                      const newProj = [...formData.projects];
                      const i = newProj.findIndex(e => e.id === proj.id);
                      newProj[i].techStack = v.split(',').map(s => s.trim());
                      setFormData({ ...formData, projects: newProj });
                    }} />
                  </div>
                  <textarea 
                    value={proj.description}
                    onChange={e => {
                      const newProj = [...formData.projects];
                      const i = newProj.findIndex(item => item.id === proj.id);
                      newProj[i].description = e.target.value;
                      setFormData({ ...formData, projects: newProj });
                    }}
                    className="w-full h-24 bg-editorial-surface rounded-xl p-4 border border-transparent focus:border-black outline-none font-serif text-sm"
                    placeholder="Describe the problem, your solution, and the tech involved..."
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('projects', { name: '', description: '', techStack: [], link: '' })}
                className="w-full py-6 border-2 border-dashed border-editorial-border rounded-2xl flex items-center justify-center gap-3 text-neutral-400 hover:text-black hover:border-black transition-all bg-white"
              >
                <Plus size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Showcase a Project</span>
              </button>
            </div>
          </StepContainer>
        );

      case 'extra':
        return (
          <StepContainer title="Dimensions of Character" description="Awards, honors, and what defines you outside of labor.">
            <div className="space-y-8">
              <InputGroup label="Awards & Accolades" placeholder="e.g. Forbes 30 Under 30, Hackathon Winner..." value={formData.awards.join(', ')} onChange={v => setFormData({ ...formData, awards: v.split(',').map(s => s.trim()) })} />
              <InputGroup label="Hobbies & Interests" placeholder="e.g. Marathon running, Analog photography..." value={formData.hobbies.join(', ')} onChange={v => setFormData({ ...formData, hobbies: v.split(',').map(s => s.trim()) })} />
            </div>
          </StepContainer>
        );

      case 'review':
        return (
          <StepContainer title="Architectural Review" description="Verify your narrative before the AI optimizes the structure.">
            <div className="editorial-card p-10 bg-white space-y-8">
              <div className="flex items-center gap-10">
                <div className="w-24 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center">
                  <User size={40} className="text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{formData.fullName || 'Unnamed Architect'}</h3>
                  <p className="text-neutral-500 font-serif italic">{formData.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ReviewStat label="Experience" count={formData.experience.length} />
                <ReviewStat label="Education" count={formData.education.length} />
                <ReviewStat label="Projects" count={formData.projects.length} />
                <ReviewStat label="Skills" count={formData.skills.length} />
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <button 
                onClick={handleFinish} 
                disabled={isGenerating}
                className="editorial-button-primary px-16 py-6 text-lg"
              >
                {isGenerating ? (
                  <><Loader2 className="animate-spin mr-2 inline" size={20} /> Architecting...</>
                ) : (
                  <><Check className="mr-2 inline" size={20} /> Finalize Professional Persona</>
                )}
              </button>
            </div>
          </StepContainer>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-editorial-bg z-50 flex overflow-hidden">
      {/* Sidebar Progress */}
      <aside className="w-16 hover:w-64 border-r border-editorial-border bg-white transition-all duration-500 group/rail no-scrollbar overflow-hidden flex flex-col z-20">
        <div className="p-5 mb-10 h-16 flex items-center shrink-0 border-b border-editorial-border">
          <div className="w-6 h-6 bg-editorial-accent rounded-sm rotate-45 shrink-0" />
          <span className="font-display font-black text-xs uppercase tracking-tighter opacity-0 group-hover/rail:opacity-100 transition-opacity ml-4">Foundry</span>
        </div>
        <div className="flex-1 px-4 space-y-6">
          {STEPS.map((step, idx) => {
            const active = step.id === currentStep;
            const past = STEPS.findIndex(s => s.id === currentStep) > idx;
            return (
              <div key={step.id} className="flex items-center gap-6 cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                <div className={cn(
                  "w-8 h-8 rounded-xl border flex items-center justify-center transition-all shrink-0 font-mono text-[10px] font-bold",
                  active ? "bg-black border-black text-white shadow-xl shadow-black/10 scale-110" : past ? "border-neutral-200 text-neutral-300" : "border-neutral-100 text-neutral-100"
                )}>
                  {past ? <Check size={12} /> : `0${idx + 1}`}
                </div>
                <span className={cn(
                  "text-[9px] font-display font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/rail:opacity-100 transition-opacity",
                  active ? "text-black" : "text-neutral-300"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="p-8 border-t border-editorial-border shrink-0">
          <div className="[writing-mode:vertical-rl] -rotate-180 text-[8px] font-mono tracking-[0.4em] text-neutral-200 uppercase opacity-100 group-hover/rail:opacity-0 transition-opacity">
            Architectural Mode v1.0
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full bg-editorial-surface relative overflow-y-auto custom-scrollbar">
        {currentStep !== 'intro' && (
          <div className="absolute top-8 left-8 flex gap-4 z-10">
            <button onClick={back} className="w-10 h-10 flex items-center justify-center bg-white border border-editorial-border rounded-xl hover:border-black transition-all shadow-sm">
              <ArrowLeft size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1 flex flex-col items-center justify-center p-12 py-32 min-h-full">
          {renderStep()}
        </div>

        {currentStep !== 'intro' && currentStep !== 'review' && (
          <div className="p-10 bg-white/80 backdrop-blur-md border-t border-editorial-border flex justify-center sticky bottom-0 z-10 shadow-up">
            <button 
              onClick={next} 
              className="bg-black text-white px-24 py-5 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.4em] hover:bg-editorial-accent transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Continue Exploration <ArrowRight className="inline ml-4" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContainer({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-4xl space-y-20"
    >
      <div className="text-center space-y-6">
        <span className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-neutral-300">Phase Sequence</span>
        <h2 className="text-7xl font-display font-black tracking-tightest leading-none uppercase">{title}</h2>
        <p className="text-lg text-neutral-400 font-serif italic max-w-xl mx-auto border-t border-neutral-100 pt-6">{description}</p>
      </div>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}

function InputGroup({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-neutral-400 pl-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-editorial-border rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-black focus:border-black transition-all font-display font-medium text-sm shadow-sm"
      />
    </div>
  );
}

function ReviewStat({ label, count }: { label: string, count: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold mb-1">{count}</div>
      <div className="editorial-label opacity-40 text-[10px]">{label}</div>
    </div>
  );
}
