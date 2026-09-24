import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
// Parse port: prioritize command line argument (--port 3000), then environment variable PORT, default to 3000
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const portFromArgs = portIndex !== -1 && args[portIndex + 1] ? Number(args[portIndex + 1]) : undefined;
const port = portFromArgs || (process.env.PORT ? Number(process.env.PORT) : 3000);

// Basic health check for Cloud Run and monitoring
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// JSON body parser for API routes
app.use(express.json());

// Proxy endpoint for Gemini API calls
app.post('/api/gemini/call', async (req, res) => {
  try {
    const { prompt, systemInstruction, responseSchema } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY found, fallback enabled',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const config: Record<string, unknown> = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseSchema) {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    return res.status(200).json({ text: response.text || '' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Gemini API Error:', err.message);
    return res.status(200).json({
      fallback: true,
      error: err.message,
    });
  }
});

async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    // Production mode: Serve pre-built static assets from dist
    app.use(express.static(distPath));

    // Fallback to index.html for SPA routing
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode (or fallback if dist not present): Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PeerLoop server listening on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
