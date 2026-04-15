"""Free alternative speech interfaces for SAHAYAK (Groq + gTTS)."""

from __future__ import annotations

import io
import logging
from typing import Any
import os

from groq import Groq
from gtts import gTTS

from app.config import GROQ_API_KEY

logger = logging.getLogger(__name__)

SUPPORTED_LANGUAGES = {
    "hi-IN": "hi",
    "ta-IN": "ta",
    "te-IN": "te",
    "kn-IN": "kn",
    "ml-IN": "ml",
    "mr-IN": "mr",
    "bn-IN": "bn",
    "gu-IN": "gu",
    "pa-IN": "pa",
    "en-IN": "en"
}

def _get_groq_client() -> Groq:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return Groq(api_key=GROQ_API_KEY)

def _normalize_language(language: str) -> str:
    value = (language or "auto").strip()
    return SUPPORTED_LANGUAGES.get(value, "en") if value != "auto" else "auto"

def speech_to_text(audio_bytes: bytes, language: str = "auto") -> dict[str, Any]:
    """Transcribe short audio clips using Groq Whisper (whisper-large-v3)."""
    if not audio_bytes:
        return {"transcript": "", "language": "unknown", "confidence": 0.0}

    client = _get_groq_client()
    
    # Whisper needs a file-like object with a filename
    file_obj = io.BytesIO(audio_bytes)
    file_obj.name = "audio.wav"  # Dummy name for groq client

    kwargs = {
        "model": "whisper-large-v3",
        "file": file_obj
    }
    
    normalized_language = _normalize_language(language)
    if normalized_language != "auto":
        kwargs["language"] = normalized_language

    try:
        response = client.audio.transcriptions.create(**kwargs)
        return {
            "transcript": response.text.strip(),
            "language": normalized_language if normalized_language != "auto" else "unknown",
            "confidence": 1.0,
        }
    except Exception as e:
        logger.exception("Groq Whisper transcribing failed")
        raise

def text_to_speech(text: str, language: str, voice: str = "") -> bytes:
    """Synthesize speech using gTTS (Google Translate TTS) - Free alternative."""
    if not text.strip():
        return b""

    normalized_language = _normalize_language(language)
    if normalized_language == "auto":
        normalized_language = "en"

    try:
        tts = gTTS(text=text, lang=normalized_language, slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        return fp.getvalue()
    except Exception as e:
        logger.exception("gTTS synthesis failed")
        raise
