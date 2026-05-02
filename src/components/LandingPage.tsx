import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, Target, Zap, Layout as LayoutIcon, MessageSquare, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-ink selection:bg-black selection:text-white transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-editorial-border glass">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-editorial-accent rounded-lg rotate-45 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white -rotate-45" />
            </div>
            <span className="font-display font-black text-xl uppercase tracking-tighter">ThemeCV<span className="text-neutral-400 font-light">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            {['Process', 'Solutions', 'Authority'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 hover:text-editorial-ink transition-colors">
                {item}
              </a>
            ))}
          </div>
          <button 
            onClick={onStart}
            className="bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.2em] hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all shadow-xl"
          >
            Access Foundry
          </button>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Layout */}
      <section className="pt-48 pb-32 px-10 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7 relative">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-editorial-accent opacity-[0.05] rounded-full blur-[150px] animate-pulse" />
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <span className="text-[10px] font-display font-black uppercase tracking-[0.6em] text-editorial-accent mb-12 inline-block">Neural Career Synthesis</span>
              <h1 className="text-[8vw] lg:text-[100px] font-display font-black leading-[0.8] tracking-tightest mb-16 uppercase">
                YOUR <span className="text-editorial-ink/10 dark:text-editorial-ink/5 group-hover:text-editorial-accent transition-colors">IDENTITY</span><br />
                <span className="font-serif italic font-light lowercase pr-6 text-editorial-accent">Architected</span><br />
                AT SCALE.
              </h1>
              <p className="text-2xl text-neutral-500 max-w-xl mb-16 leading-relaxed font-serif italic">
                A high-precision career engine that transforms raw performance into a compelling professional narrative.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={onStart}
                  className="w-full sm:w-auto px-12 py-6 bg-black dark:bg-white dark:text-black text-white rounded-3xl text-[11px] font-display font-bold uppercase tracking-[0.4em] hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all flex items-center justify-center gap-6 shadow-2xl hover:scale-105 active:scale-95 group"
                >
                  Induct Now
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-editorial-bg bg-neutral-100 dark:bg-neutral-800" />
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-editorial-bg bg-editorial-accent flex items-center justify-center text-white text-[10px] font-bold">+2k</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative aspect-[3/4] glass rounded-[60px] p-12 overflow-hidden shadow-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-editorial-accent/10 to-transparent" />
              <div className="relative space-y-12">
                <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                <div className="space-y-4">
                  <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full" />
                  <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full" />
                  <div className="h-1 w-3/4 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-neutral-100 dark:bg-neutral-900 rounded-3xl" />
                  <div className="h-24 bg-editorial-accent/20 rounded-3xl" />
                </div>
                <div className="h-40 bg-neutral-50 dark:bg-neutral-900/50 rounded-[40px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-editorial-border bg-editorial-surface/30">
        <div className="max-w-7xl mx-auto px-10">
          <p className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-neutral-300 text-center mb-16">Global Architectural Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 opacity-20 dark:opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-display font-black">FORBES</span>
            <span className="text-2xl font-display font-black">WIRED</span>
            <span className="text-2xl font-display font-black">THE VERGE</span>
            <span className="text-2xl font-display font-black">FAST COMPANY</span>
          </div>
        </div>
      </section>

      {/* The Process - How it works */}
      <section id="process" className="py-32 px-10 overflow-hidden bg-white dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32">
            <h2 className="text-6xl font-display font-black tracking-tightest leading-none mb-8 uppercase">THE <span className="font-serif italic font-light text-editorial-accent">SYNTHESIS</span><br />PROTOCOL</h2>
            <p className="text-xl text-neutral-400 font-serif italic max-w-xl">A four-stage induction designed to extract your absolute professional value.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Induction', desc: 'Deep-profile analysis of your tactical accomplishments and skill depth.' },
              { step: '02', title: 'Architecture', desc: 'AI-driven narrative synthesis across multiple career dimensions.' },
              { step: '03', title: 'Refinement', desc: 'Editorial balancing for industry-specific resonance and impact.' },
              { step: '04', title: 'Deployment', desc: 'Automated placement discovery via high-bandwidth search layers.' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-12 editorial-card space-y-12 group"
              >
                <span className="text-5xl font-display font-black text-neutral-100 dark:text-neutral-900 transition-colors group-hover:text-editorial-accent/20">/{item.step}</span>
                <div className="space-y-4">
                  <h3 className="text-xl font-display font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="text-sm text-neutral-400 font-serif italic leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authority - Large Feature Section */}
      <section id="authority" className="py-32 px-10 border-t border-editorial-border bg-editorial-surface/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <span className="text-[10px] font-display font-black uppercase tracking-[0.5em] text-editorial-accent">Neural Monitoring</span>
            <h2 className="text-7xl font-display font-black tracking-tightest leading-none uppercase">COMMAND THE <br /><span className="text-editorial-ink/10 dark:text-editorial-ink/5 group-hover:text-editorial-accent transition-colors">MARKET</span></h2>
            <p className="text-xl text-neutral-500 font-serif italic leading-relaxed">
              Our Copilot doesn't just suggest words; it monitors job market trends in real-time, adjusting your persona to meet the evolving needs of top-tier organizations.
            </p>
            <ul className="space-y-6">
              {[
                'Real-time Market Scoring',
                'Semantic Matching Optimization',
                'Deep Portfolio Integration',
                'Automated Lead Generation'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-display font-bold uppercase tracking-widest text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-editorial-accent rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-editorial-accent/5 rounded-[60px] blur-3xl" />
             <div className="relative glass h-[600px] rounded-[60px] overflow-hidden">
                <div className="p-10 border-b border-editorial-border flex items-center justify-between">
                   <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-amber-400 rounded-full" />
                      <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                   </div>
                   <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">ai-analysis-output.log</span>
                </div>
                <div className="p-12 font-mono text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-600">
                   <p className="mb-4 text-emerald-500">[SYSTEM] Neural Sync Complete.</p>
                   <p className="mb-2">Analyzing market landscape for "Principal Architect"</p>
                   <p className="mb-2 text-editorial-accent">MATCH DETECTED: Apple Inc. (94% Resonance)</p>
                   <p className="mb-4">Optimizing narrative blocks for semantic alignment...</p>
                   <div className="flex gap-1 h-32 items-end mb-8">
                     {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                       <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        key={i} 
                        className="flex-1 bg-black dark:bg-white/10 dark:hover:bg-white/20 transition-all rounded-t-sm" 
                       />
                     ))}
                   </div>
                   <p className="text-neutral-800 dark:text-neutral-200 uppercase font-bold tracking-widest mb-1">PROCEED WITH DEPLOYMENT</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-48 px-10 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-editorial-accent opacity-[0.03] rounded-full blur-[180px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-8xl md:text-[140px] font-display font-black leading-none mb-16 tracking-tightest uppercase">Ready for <br /><span className="text-editorial-ink/10 dark:text-editorial-ink/5 group-hover:text-editorial-accent transition-colors">Impact?</span></h2>
          <button 
            onClick={onStart}
            className="px-20 py-8 bg-black dark:bg-white dark:text-black text-white rounded-[40px] text-xs font-display font-bold uppercase tracking-[0.5em] hover:bg-editorial-accent dark:hover:bg-editorial-accent dark:hover:text-white transition-all shadow-3xl hover:scale-105"
          >
            Induct Your Persona
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-10 border-t border-editorial-border bg-editorial-bg text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-editorial-accent rounded-sm rotate-45 shrink-0" />
            <span className="font-display font-black text-sm uppercase tracking-tighter">ThemeCV<span className="text-neutral-400 font-light">AI</span></span>
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-black dark:hover:text-white">Twitter</a>
            <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-black dark:hover:text-white">Github</a>
            <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-black dark:hover:text-white">Privacy</a>
          </div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">ThemeCV AI &copy; MMXXVI / V1.0-EDITION</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="flex items-center gap-4 mb-10">
        <span className="font-mono text-xs text-neutral-200">/ {index}</span>
        <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
        <div className="text-editorial-ink group-hover:text-editorial-accent transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-display font-black mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500 uppercase">{title}</h3>
      <p className="text-neutral-500 leading-relaxed font-serif italic text-base border-neutral-100 group-hover:text-editorial-ink transition-colors">{description}</p>
    </motion.div>
  );
}
