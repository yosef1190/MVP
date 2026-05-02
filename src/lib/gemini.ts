import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiModel = "gemini-3-flash-preview";

export async function generateCVContent(userInput: any) {
  const prompt = `Based on the following user input, generate a comprehensive, professional, structured CV content in JSON format. 
  Ensure the summary is high-impact. Extract key achievements and quantifiable results where possible.
  Input: ${JSON.stringify(userInput)}
  
  Please provide the output strictly in the following JSON format:
  {
    "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "summary": "",
    "experience": [{ "id": "", "company": "", "role": "", "period": "", "location": "", "description": "", "achievements": [""] }],
    "education": [{ "id": "", "school": "", "degree": "", "field": "", "year": "", "location": "" }],
    "skills": [""],
    "projects": [{ "id": "", "name": "", "description": "", "techStack": [""], "link": "" }],
    "certifications": [""],
    "languages": [""],
    "awards": [""],
    "hobbies": [""]
  }`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}

// ... other analytic functions ...

export async function analyzeJobMatch(cv: any, job: any) {
  const prompt = `Analyze how well this candidate matches the job description.
  Candidate CV: ${JSON.stringify(cv)}
  Job Title: ${job.title}
  Position: ${job.description}
  
  Return a JSON object with:
  - matchScore (0-100)
  - explanation (why they fit)
  - improvementPoints (list of gaps/suggestions)
  - strategy (how to tailor the application)`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}

export async function careerCopilotResponse(history: any[]) {
  // Use OpenAI via server proxy as requested
  const response = await fetch('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details || data.error || "OpenAI proxy request failed");
  }
  
  return data.content;
}

export async function generatePortfolioVisual(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: `Professional portfolio visual asset for: ${prompt}. Clean, modern tech aesthetic.`,
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
