import {GoogleGenAI} from '@google/genai';
import type {IncomingMessage, ServerResponse} from 'node:http';

type TranslationItem = {
  path: string;
  value: string;
};

type RequestWithBody = IncomingMessage & {
  body?: unknown;
  method?: string;
};

const readJsonBody = async (req: RequestWithBody) => {
  if (typeof req.body === 'string') return JSON.parse(req.body);
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const extractJson = (text: string) => {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
};

const languageName = (lang: string) => {
  if (lang === 'vi') return 'Vietnamese';
  if (lang === 'zh') return 'Simplified Chinese';
  return lang;
};

const isTranslationItem = (item: unknown): item is TranslationItem => {
  if (!item || typeof item !== 'object') return false;
  const value = item as Record<string, unknown>;
  return typeof value.path === 'string' && typeof value.value === 'string';
};

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, {error: 'Method not allowed'});
    return;
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey || geminiApiKey === 'MY_GEMINI_API_KEY') {
    sendJson(res, 500, {
      error: 'Missing GEMINI_API_KEY. Add it to Vercel Environment Variables before exporting with AI translation.',
    });
    return;
  }

  try {
    const {items, sourceLang = 'vi', targetLang = 'zh'} = await readJsonBody(req);

    if (!['vi', 'zh'].includes(sourceLang) || !['vi', 'zh'].includes(targetLang) || sourceLang === targetLang) {
      sendJson(res, 400, {error: 'sourceLang and targetLang must be vi/zh and different.'});
      return;
    }

    if (!Array.isArray(items) || !items.every(isTranslationItem)) {
      sendJson(res, 400, {error: 'items must be an array of {path, value}.'});
      return;
    }

    const ai = new GoogleGenAI({apiKey: geminiApiKey});

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Translate these user-entered business profile values from ${languageName(sourceLang)} to ${languageName(targetLang)}.

Return ONLY valid JSON.
Return this exact shape: {"translations":[{"path":"same path","value":"translated value"}]}.
Keep every input item and preserve its path exactly.
Translate only the value field.
Preserve simple HTML tags such as <br>.
Do not add explanations or markdown.
If a value is only a symbol, number, URL, email, phone number, or ID, keep it unchanged.

Items:
${JSON.stringify(items)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const translated = extractJson(response.text ?? '{}');
    sendJson(res, 200, {
      translations: Array.isArray(translated.translations) ? translated.translations : [],
    });
  } catch (error) {
    console.error('Failed to translate profile:', error);
    sendJson(res, 500, {error: 'Failed to translate profile'});
  }
}
