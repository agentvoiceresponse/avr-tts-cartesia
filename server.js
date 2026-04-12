import express from 'express';
import dotenv from 'dotenv';
import Cartesia from 'cartesia-node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6009;

// Initialize Cartesia client
const cartesia = new Cartesia({
  apiKey: process.env.CARTESIA_API_KEY,
});

// TTS endpoint
app.post('/text-to-speech-stream', express.json(), async (req, res) => {
  try {
    const { text, modelId = "sonic-english", voiceId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Set response headers for audio streaming
    res.set({
      'Content-Type': 'audio/l16',
      'Transfer-Encoding': 'chunked'
    });
    
    // Generate speech using Cartesia
    const audioStream = await cartesia.tts.stream({
      modelId: modelId,
      transcript: text,
      voice: {
        id: voiceId || process.env.CARTESIA_VOICE_ID || "79a125e8-cd45-4c13-8a67-188112f4dd22" // Default voice
      },
      outputFormat: {
        container: "raw",
        encoding: "pcm_f16le",
        sampleRate: 8000
      }
    });
    
    // Pipe the audio stream to the response
    audioStream.pipe(res);
    
  } catch (error) {
    console.error('Cartesia TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.listen(PORT, () => {
  console.log(`[avr-tts-cartesia] listening on ${PORT}`);
});
