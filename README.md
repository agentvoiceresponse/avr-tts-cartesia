# Agent Voice Response - Cartesia TTS Integration

[![Discord](https://img.shields.io/discord/1347239846632226998?label=Discord&logo=discord)](https://discord.gg/DFTU69Hg74)
[![GitHub Repo stars](https://img.shields.io/github/stars/agentvoiceresponse/avr-tts-cartesia?style=social)](https://github.com/agentvoiceresponse/avr-tts-cartesia)
[![Docker Pulls](https://img.shields.io/docker/pulls/agentvoiceresponse/avr-tts-cartesia?label=Docker%20Pulls&logo=docker)](https://hub.docker.com/r/agentvoiceresponse/avr-tts-cartesia)
[![Ko-fi](https://img.shields.io/badge/Support%20us%20on-Ko--fi-ff5e5b.svg)](https://ko-fi.com/agentvoiceresponse)

## Overview

This repository integrates **Agent Voice Response (AVR)** with **Cartesia Text-to-Speech (TTS)**.

It exposes a streaming HTTP endpoint that converts input text into low-latency telephony-ready PCM audio using Cartesia's Sonic model.

## Features

- **Real-time TTS generation**: Synthesizes speech from input text through Cartesia.
- **Streaming response**: Returns audio chunks progressively over HTTP.
- **Telephony-ready output**: Uses `audio/l16` (`pcm_s16le`, 8kHz, mono).
- **Request-level overrides**: Supports per-request `voiceId` and `language`.

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

#### Required

```dotenv
CARTESIA_API_KEY=your_cartesia_api_key_here
```

#### Optional

```dotenv
CARTESIA_VOICE_ID=694f9389-aac1-45b6-b726-9d9369183238
CARTESIA_LANGUAGE=en
PORT=6009
```

## Usage

### Start the Application

```bash
npm install
npm start
```

### API Usage

- **Endpoint:** `/text-to-speech-stream`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `x-uuid` (optional): request correlation id for logs
- **Body:**
  - `text` (required): text to synthesize
  - `voiceId` (optional): overrides `CARTESIA_VOICE_ID`
  - `language` (optional): overrides `CARTESIA_LANGUAGE`

#### Example Request

```bash
curl -X POST http://localhost:6009/text-to-speech-stream \
  -H "Content-Type: application/json" \
  -H "x-uuid: demo-123" \
  -d '{"text":"Hello, this is a real-time voice response!","language":"en"}' \
  --output response.raw
```

## API Response

The endpoint streams raw audio data to the client:

- **Content-Type:** `audio/l16`
- **Encoding:** 16-bit linear PCM (`pcm_s16le`)
- **Sample rate:** 8000 Hz
- **Channels:** Mono (1 channel)

## Configuration Strategies

Parameter resolution priority:

1. **HTTP request body** (`voiceId`, `language`)
2. **Environment variables** (`CARTESIA_VOICE_ID`, `CARTESIA_LANGUAGE`)
3. **Built-in defaults** (`CARTESIA_LANGUAGE=en`, fallback voice id in code)

## Error Handling

Expected error scenarios:

- Missing `CARTESIA_API_KEY` at startup exits the process with a fatal error.
- Missing `text` in request body returns `400 Bad Request`.
- Cartesia/API/network failures return `500 Internal Server Error`.
- If streaming has already started, failures close the response stream.

## Docker Support

```bash
docker run --rm -p 6009:6009 --env-file .env agentvoiceresponse/avr-tts-cartesia
```

## Support & Community

- **GitHub:** [https://github.com/agentvoiceresponse](https://github.com/agentvoiceresponse) - Report issues, contribute code.
- **Discord:** [https://discord.gg/DFTU69Hg74](https://discord.gg/DFTU69Hg74) - Join the community discussion.
- **Docker Hub:** [https://hub.docker.com/u/agentvoiceresponse](https://hub.docker.com/u/agentvoiceresponse) - Find Docker images.
- **Wiki:** [https://wiki.agentvoiceresponse.com/en/home](https://wiki.agentvoiceresponse.com/en/home) - Project documentation and guides.

## Support AVR

AVR is free and open-source.
Any support is entirely voluntary and intended as a personal gesture of appreciation.
Donations do not provide access to features, services, or special benefits, and the project remains fully available regardless of donations.

<a href="https://ko-fi.com/agentvoiceresponse" target="_blank"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Support us on Ko-fi"></a>

## License

MIT License - see the [LICENSE](LICENSE.md) file for details.
