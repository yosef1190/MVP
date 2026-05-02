import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SerpAPI Proxy for Job Search
  app.get("/api/jobs", async (req, res) => {
    const { query, location, engine = "google_jobs" } = req.query;
    
    // Aggressive Sanitization: extract just the hex key if the user included the label or quotes
    let apiKey = process.env.SERPAPI_KEY?.trim() || "";
    const hexMatch = apiKey.match(/[a-f0-9]{64}/i);
    if (hexMatch) {
      apiKey = hexMatch[0];
    } else {
      // Fallback: standard trim/quote stripping if it's not a standard 64-char hex
      if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.substring(1, apiKey.length - 1);
      if (apiKey.startsWith("'") && apiKey.endsWith("'")) apiKey = apiKey.substring(1, apiKey.length - 1);
    }

    if (!apiKey) {
      console.error("SERPAPI_KEY missing");
      return res.status(500).json({ error: "Job Search service not configured. Please add SERPAPI_KEY to your secrets." });
    }

    try {
      // Small debug log to verify key presence without leaking it
      console.log(`Using SerpAPI Key (Last 4 chars): ...${apiKey.slice(-4)}`);

      const performSearch = async (q: string, loc: string) => {
        const locParam = loc ? `&location=${encodeURIComponent(loc)}` : "";
        const searchUrl = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(q)}${locParam}&api_key=${apiKey}`;
        console.log(`Search attempt: ${q} | Loc: ${loc || 'None'}`);
        const response = await fetch(searchUrl);
        return await response.json();
      };

      let data = await performSearch(query as string, location as string);

      // Handle common SerpAPI errors by falling back
      if (data.error) {
        const isUnsupportedLoc = data.error.includes("location parameter");
        const isNoResults = data.error.includes("hasn't returned any results");

        if (isUnsupportedLoc && location) {
          console.warn("Retrying search without location parameter (embedded in query)");
          data = await performSearch(`${query} in ${location}`, "");
        } else if (isNoResults) {
          // If no results, try a broader query (just the first word of the query)
          const broaderQuery = (query as string).split(' ')[0];
          console.warn(`No results, retrying with broader query: ${broaderQuery}`);
          data = await performSearch(broaderQuery, location as string);
        }
      }

      if (data.error) {
        console.error("Final SerpAPI Error Log:", data.error);
        const userFriendlyError = data.error.includes("Invalid API key") 
          ? "The Job Search API key is invalid or has expired. Please update it in the settings." 
          : data.error;
        return res.status(400).json({ error: userFriendlyError });
      }

      if (data.jobs_results && Array.isArray(data.jobs_results)) {
        data.jobs_results = data.jobs_results.map((job: any) => ({
          ...job,
          // Normalize link: use direct link if available, fallback to first related link
          link: job.link || (job.related_links && job.related_links[0]?.link) || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company_name + " jobs")}`
        }));
      }

      res.json(data);
    } catch (error) {
      console.error("Job search exception:", error);
      res.status(500).json({ error: "Service temporarily unavailable" });
    }
  });

  // OpenAI Proxy for Career Copilot
  app.post("/api/copilot", async (req, res) => {
    const { messages } = req.body;
    let apiKey = process.env.OPENAI_API_KEY;
    
    // Detect if this is an OpenRouter key
    const isOpenRouter = apiKey?.startsWith('sk-or-');
    const baseURL = isOpenRouter ? "https://openrouter.ai/api/v1" : undefined;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "OPENAI_API_KEY not configured. Please add it to your secrets." 
      });
    }

    const openai = new OpenAI({ 
      apiKey,
      baseURL,
      defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": "https://ai.studio/build",
        "X-Title": "ThemeCV AI"
      } : undefined
    });

    try {
      const response = await openai.chat.completions.create({
        model: isOpenRouter ? "openai/gpt-3.5-turbo" : "gpt-4-turbo-preview",
        messages: [
          { 
            role: "system", 
            content: "You are the Career Copilot AI for ThemeCV AI. You are a world-class career coach. You help students and job seekers transform their potential into real opportunities. You are professional, encouraging, and provide very specific actionable advice. You can help improve CV details, suggest skills, or write cover letters." 
          },
          ...messages
        ]
      });

      res.json({ content: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI error:", error);
      res.status(500).json({ 
        error: "Failed to reach Career Copilot. If you are using OpenRouter, ensure your key and model selection are correct.",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicitly handle index.html in dev mode to ensure it's served correctly
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs");
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
