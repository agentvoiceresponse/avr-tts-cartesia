# Changelog

## [1.1.0] - 2026-05-05

### Added
- Optional `language` field on `POST /text-to-speech-stream` for per-request language override
- `CARTESIA_LANGUAGE` environment variable (default `en`)

### Changed
- README documents `language` and `CARTESIA_LANGUAGE`
- `.env.example` documents `CARTESIA_LANGUAGE`

## [1.0.0] - 2026-04-12

### Added
- Initial Cartesia Sonic TTS connector
- WebSocket-based streaming with Cartesia SDK
- Support for sonic-3 model
- 8kHz mono PCM audio output (LINEAR16)
- Docker support with node:lts-slim base image
- GitHub Actions workflow for Docker Hub auto-build
