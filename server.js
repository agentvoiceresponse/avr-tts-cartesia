import express from 'express';
import dotenv from 'dotenv';
import { Cartesia } from '@cartesia/cartesia-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6009;

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
if (!CARTESIA_API_KEY) {
  console.error('[avr-tts-cartesia] FATAL: CARTESIA_API_KEY is not set');
  process.exit(1);
}

const cartesia = new Cartesia({ apiKey: CARTESIA_API_KEY });

app.post('/text-to-speech-stream', express.json(), async (req, res) => {
  const uuid = req.headers['x-uuid'] || 'unknown';
  console.log(`[avr-tts-cartesia:${uuid}] Received TTS request`);
  
  try {
    const { text, voiceId } = req.body;
    
    if (!text) {
      console.error(`[avr-tts-cartesia:${uuid}] Error: Text is required`);
      return res.status(400).json({ error: 'Text is required' });
    }
    
    res.set({
      'Content-Type': 'audio/l16',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    const ws = await cartesia.tts.websocket();
    const ctx = ws.context({
      model_id: 'sonic-3',
      voice: {
        mode: 'id',
        id: voiceId || process.env.CARTESIA_VOICE_ID || '694f9389-aac1-45b6-b726-9d9369183238'
      },
      output_format: {
        container: 'raw',
        encoding: 'pcm_f16le',
        sample_rate: 8000
      }
    });
    
    ctx.send({ transcript: text, continue: false });
    
    req.on('close', () => {
      ws.close();
    });
    
    for await (const event of ctx.receive()) {
      if (event.type === 'audio') {
        res.write(Buffer.from(event.data));
      } else if (event.type === 'done') {
        break;
      }
    }
    
    res.end();
    ws.close();
    console.log(`[avr-tts-cartesia:${uuid}] TTS request completed`);
    
  } catch (error) {
    console.error(`[avr-tts-cartesia:${uuid}] Error:`, error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate speech' });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`[avr-tts-cartesia] listening on ${PORT}`);
});
