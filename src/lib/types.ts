export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];
  awards?: string[];
  hobbies?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  year: string;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface CVTheme {
  id: string;
  name: string;
  preview: string;
  component: React.FC<{ data: UserProfile }>;
}

export interface Job {
  title: string;
  company_name: string;
  location: string;
  description: string;
  via: string;
  job_id: string;
  thumbnail?: string;
  link?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
