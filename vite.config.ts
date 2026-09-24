import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

function geminiServerPlugin(): Plugin {
  return {
    name: 'gemini-server-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini/call', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({error: 'Method not allowed'}));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const parsed = JSON.parse(body || '{}');
            const {prompt, systemInstruction, responseSchema} = parsed;
            const apiKey = process.env.GEMINI_API_KEY || '';

            if (!apiKey) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  fallback: true,
                  message: 'No GEMINI_API_KEY found, fallback enabled',
                }),
              );
              return;
            }

            const ai = new GoogleGenAI({apiKey});
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

            res.statusCode = 200;
            res.end(JSON.stringify({text: response.text || ''}));
          } catch (error: unknown) {
            const err = error as Error;
            console.error('Gemini API Error:', err.message);
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                fallback: true,
                error: err.message,
              }),
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

