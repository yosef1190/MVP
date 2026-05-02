import React from 'react';
import { UserProfile } from '../lib/types';
import { Mail, Phone, MapPin, Linkedin, Globe, Shield, Award, Briefcase } from 'lucide-react';

export const ModernCorporate: React.FC<{ data: UserProfile }> = ({ data }) => (
  <div id="cv-modern" className="bg-[#FAF9F6] text-[#1A1A1A] p-16 min-h-[1100px] font-sans relative overflow-hidden">
    {/* Minimal watermark or accent */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5F5F5] -rotate-45 translate-x-32 -translate-y-32 -z-10" />
    
    <header className="border-b border-black pb-12 mb-12">
      <h1 className="text-6xl font-bold tracking-tighter leading-none mb-6">{data.fullName}</h1>
      <div className="flex flex-wrap gap-x-10 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ opacity: 0.6 }}>
        <div className="flex items-center gap-2"><Mail size={12} /> {data.email}</div>
        <div className="flex items-center gap-2"><Phone size={12} /> {data.phone}</div>
        <div className="flex items-center gap-2"><MapPin size={12} /> {data.location}</div>
        {data.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /> LinkedIn</div>}
        {data.portfolio && <div className="flex items-center gap-2"><Globe size={12} /> Portfolio</div>}
      </div>
    </header>

    <div className="grid grid-cols-12 gap-16">
      <div className="col-span-8 space-y-12">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#E5E5E5] pb-2">Profile / Thesis</h2>
          <p className="text-lg font-serif italic leading-relaxed text-[#525252]">{data.summary}</p>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border-b border-[#E5E5E5] pb-2">Professional Impact</h2>
          <div className="space-y-12">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">{exp.role}</h3>
                  <span className="text-[10px] font-mono uppercase" style={{ opacity: 0.4 }}>{exp.period}</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest mb-4" style={{ opacity: 0.6 }}>{exp.company} • {exp.location}</div>
                <p className="text-sm text-[#525252] leading-relaxed mb-6 font-serif italic">{exp.description}</p>
                <ul className="space-y-2">
                  {exp.achievements?.map((ach, i) => (
                    <li key={i} className="flex gap-4 text-xs leading-relaxed text-[#737373]">
                      <span className="text-black font-bold">—</span> {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border-b border-[#E5E5E5] pb-2">Key Artifacts (Projects)</h2>
            <div className="grid grid-cols-1 gap-10">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="text-xl font-bold mb-2">{proj.name}</h3>
                  <div className="flex gap-2 mb-3">
                    {proj.techStack?.map(t => (
                      <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-[#F5F5F5] rounded uppercase tracking-tighter" style={{ opacity: 0.6 }}>{t}</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#737373] font-serif italic leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-12">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#E5E5E5] pb-2">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#E5E5E5] pb-2">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-6">
              <div className="font-bold text-sm mb-1">{edu.degree}</div>
              <div className="text-[10px] text-[#A3A3A3] font-bold uppercase tracking-widest">{edu.field}</div>
              <div className="text-[10px] italic font-serif mt-1">{edu.school} | {edu.year}</div>
            </div>
          ))}
        </section>

        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#E5E5E5] pb-2">Communication</h2>
            <ul className="space-y-2">
              {data.languages.map(lang => (
                <li key={lang} className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ opacity: 0.6 }}>{lang}</li>
              ))}
            </ul>
          </section>
        )}

        {data.awards && data.awards.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#E5E5E5] pb-2">Honors</h2>
            <ul className="space-y-4">
              {data.awards.map(award => (
                <li key={award} className="text-xs text-[#525252] font-serif italic leading-snug">{award}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>

    <footer className="mt-20 pt-10 border-t border-black flex justify-between items-center" style={{ borderTopColor: 'rgba(0,0,0,0.1)', opacity: 0.4 }}>
      <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Drafted by ThemeCV AI</span>
      <span className="text-[9px] font-mono">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
    </footer>
  </div>
);

export const CreativeDark: React.FC<{ data: UserProfile }> = ({ data }) => (
  <div id="cv-creative" className="bg-white text-[#1A1A1A] p-20 min-h-[1100px] font-serif border-[12px] border-[#F5F5F5] relative">
    <div className="flex flex-col items-center text-center mb-24">
      <div className="w-16 h-[1px] bg-black mb-8" />
      <h1 className="text-7xl font-bold tracking-tighter mb-4 uppercase">{data.fullName}</h1>
      <p className="text-[11px] font-sans font-bold uppercase tracking-[0.6em] mb-10" style={{ opacity: 0.4 }}>Professional Portfolio & Narrative</p>
      <div className="flex gap-8 text-[11px] font-sans font-medium tracking-widest border-y border-[#F5F5F5] py-6 w-full justify-center">
        <span>{data.email}</span>
        <span>/</span>
        <span>{data.phone}</span>
        <span>/</span>
        <span>{data.location}</span>
      </div>
    </div>

    <div className="max-w-4xl mx-auto space-y-20">
      <section>
        <p className="text-3xl leading-relaxed text-center font-normal italic text-[#404040]">
          "{data.summary}"
        </p>
      </section>

      <div className="grid grid-cols-12 gap-20">
        <div className="col-span-8 space-y-20">
          <section>
            <h2 className="text-sm font-sans font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-black"></span> Experience
            </h2>
            <div className="space-y-16">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative">
                   <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-bold tracking-tight">{exp.role}</h3>
                    <span className="font-sans text-[10px] font-bold mt-2" style={{ opacity: 0.3 }}>{exp.period}</span>
                  </div>
                  <div className="text-sm font-sans font-bold uppercase tracking-widest mb-6 italic" style={{ opacity: 0.6 }}>{exp.company} / {exp.location}</div>
                  <p className="text-lg leading-relaxed text-[#525252] mb-8">{exp.description}</p>
                  <div className="grid grid-cols-1 gap-4 border-l border-[#F5F5F5] pl-8">
                    {exp.achievements?.map((ach, i) => (
                      <p key={i} className="text-sm italic leading-relaxed" style={{ opacity: 0.7 }}>— {ach}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-sans font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-black"></span> Projects
            </h2>
            <div className="grid grid-cols-1 gap-12">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <h3 className="text-2xl font-bold mb-4 italic">{proj.name}</h3>
                  <p className="text-lg leading-relaxed mb-6" style={{ opacity: 0.6 }}>{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack?.map(t => (
                      <span key={t} className="font-sans text-[9px] font-bold px-3 py-1 bg-black text-white uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="col-span-4 space-y-16 font-sans">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b pb-4">Abilities</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {data.skills.map(skill => (
                <span key={skill} className="text-[11px] font-bold tracking-tighter" style={{ opacity: 0.7 }}>
                  {skill} /
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b pb-4">Knowledge</h2>
            <div className="space-y-8">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="text-xs font-black uppercase mb-1">{edu.degree}</div>
                  <div className="text-[10px] font-bold mb-2" style={{ opacity: 0.4 }}>{edu.field}</div>
                  <div className="text-[11px] italic font-serif">{edu.school} • {edu.year}</div>
                </div>
              ))}
            </div>
          </section>

          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b pb-4">Dialects</h2>
              <ul className="space-y-4">
                {data.languages.map(lang => (
                  <li key={lang} className="text-xs italic" style={{ opacity: 0.6 }}>{lang}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  </div>
);

export const ExecutiveSerif: React.FC<{ data: UserProfile }> = ({ data }) => (
  <div id="cv-executive" className="bg-[#FFFFFF] text-[#2D2D2D] p-20 min-h-[1100px] font-serif">
    <header className="text-center mb-16 space-y-4">
      <h1 className="text-5xl font-normal tracking-wide border-b border-black pb-6 inline-block uppercase">{data.fullName}</h1>
      <div className="flex justify-center gap-6 text-[11px] font-sans text-[#A3A3A3] font-bold uppercase tracking-widest">
        <span>{data.location}</span>
        <span>•</span>
        <span>{data.email}</span>
        <span>•</span>
        <span>{data.phone}</span>
      </div>
    </header>

    <div className="space-y-12 max-w-3xl mx-auto">
      <section>
        <p className="text-lg leading-relaxed text-center font-normal italic mb-12" style={{ opacity: 0.8 }}>
          {data.summary}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-10 text-center border-y border-[#F5F5F5] py-3">Professional Experience</h2>
        <div className="space-y-12">
          {data.experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold italic">{exp.role}</h3>
                <span className="text-[10px] uppercase font-sans font-bold" style={{ opacity: 0.3 }}>{exp.period}</span>
              </div>
              <div className="text-xs uppercase tracking-widest font-sans font-bold mb-4 opacity-100">{exp.company} / {exp.location}</div>
              <p className="text-sm leading-relaxed mb-4 text-[#525252]">{exp.description}</p>
              <ul className="grid grid-cols-1 gap-2 border-l-2 border-[#F5F5F5] pl-6">
                {exp.achievements?.map((ach, i) => (
                  <li key={i} className="text-xs italic" style={{ opacity: 0.8 }}>— {ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-20 pt-10">
        <section>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] mb-8 border-b pb-2">Academic Credentials</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-6">
              <div className="font-bold text-sm mb-1">{edu.degree}</div>
              <div className="text-[10px] italic font-serif text-[#737373]">{edu.school} — {edu.year}</div>
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] mb-8 border-b pb-2">Technical Competencies</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {data.skills.map(skill => (
              <span key={skill} className="text-[11px] font-bold tracking-tight text-[#525252] uppercase">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const TechMinimal: React.FC<{ data: UserProfile }> = ({ data }) => (
  <div id="cv-tech" className="bg-[#0A0A0A] text-[#F0F0F0] p-16 min-h-[1100px] font-mono">
    <div className="flex justify-between items-start mb-24 border-b border-white pb-12" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
      <div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">{data.fullName.toUpperCase()}</h1>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest" style={{ opacity: 0.4 }}>
          <span>{data.email}</span>
          <span className="text-[#10b981]">//</span>
          <span>{data.location}</span>
        </div>
      </div>
      <div className="w-16 h-16 bg-[#10b981] flex items-center justify-center font-black text-black">
        {data.fullName.charAt(0)}
      </div>
    </div>

    <div className="grid grid-cols-4 gap-16">
      <aside className="space-y-12">
        <section>
          <h2 className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] mb-6">Core_Skills</h2>
          <div className="space-y-2">
            {data.skills.map(skill => (
              <div key={skill} className="text-xs flex items-center gap-2 group">
                <span className="w-1 h-1 bg-white group-hover:bg-[#10b981] transition-colors" />
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] mb-6">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-6" style={{ opacity: 0.6 }}>
              <div className="font-bold text-xs">{edu.degree}</div>
              <div className="text-[9px] mt-1">{edu.school}</div>
            </div>
          ))}
        </section>
      </aside>

      <main className="col-span-3 space-y-16">
        <section>
          <h2 className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px]" style={{ backgroundColor: 'rgba(16,185,129,0.2)' }} /> Executive_Summary
          </h2>
          <p className="text-sm leading-relaxed font-serif italic" style={{ opacity: 0.6 }}>{data.summary}</p>
        </section>

        <section>
          <h2 className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px]" style={{ backgroundColor: 'rgba(16,185,129,0.2)' }} /> Professional_History
          </h2>
          <div className="space-y-12">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{exp.role}</h3>
                  <span className="text-[10px]" style={{ opacity: 0.2 }}>{exp.period}</span>
                </div>
                <div className="text-xs text-[#10b981] font-bold mb-6 tracking-widest">{exp.company.toUpperCase()}</div>
                <p className="text-xs mb-6 leading-relaxed line-clamp-4" style={{ opacity: 0.5 }}>{exp.description}</p>
                <div className="flex flex-wrap gap-3">
                  {exp.achievements?.map((ach, i) => (
                    <div key={i} className="text-[9px] px-2 py-1 rounded uppercase" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', opacity: 0.4 }}>
                      {ach}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  </div>
);
