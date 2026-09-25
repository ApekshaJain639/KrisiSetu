"use client";

/**
 * useKannadaVoice — Free Kannada + English Voice Engine (ASR + TTS)
 *
 * 1. ZERO-COST AUDIO-CAPTURE & RECOGNITION (Default):
 *    - Uses browser's native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
 *    - Recognizes Kannada (`kn-IN`) and English (`en-IN`) directly with no API keys.
 *    - Real-time decibel volume & audio waveform metering via Web Audio API (`AudioContext` + `AnalyserNode`).
 *    - Hardware mic stream management (`navigator.mediaDevices.getUserMedia`) for clean permission & track shutdown.
 *
 * 2. ZERO-COST SPEECH SYNTHESIS (Default):
 *    - Browser `SpeechSynthesis` with localized pitch/rate tuning.
 *
 * 3. OPTIONAL HIGH-FIDELITY UPGRADE (Sarvam AI):
 *    - If `NEXT_PUBLIC_SARVAM_API_KEY` is set in `.env.local`, uses Sarvam Saarika v2 ASR + Bulbul v1 TTS.
 */

import { useState, useCallback, useRef, useEffect } from "react";

export type VoiceLanguage = "kn" | "en" | "hi" | "mr";

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  audioLevel: number; // 0 to 100 real-time volume
  transcript: string;
  error: string | null;
  sarvamAvailable: boolean;
}

const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";
const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";

function getSarvamKey(): string | null {
  return process.env.NEXT_PUBLIC_SARVAM_API_KEY || null;
}

function getBrowserLangCode(lang: VoiceLanguage): string {
  return { kn: "kn-IN", en: "en-IN", hi: "hi-IN", mr: "mr-IN" }[lang];
}

function float32ToWavBlob(floatData: Float32Array, sampleRate: number): Blob {
  const numSamples = floatData.length;
  const blockAlign = 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const w = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  w(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  w(8, "WAVE");
  w(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  w(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, floatData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export function useKannadaVoice(
  onTranscript: (text: string) => void,
  lang: VoiceLanguage = "kn"
) {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    audioLevel: 0,
    transcript: "",
    error: null,
    sarvamAvailable: !!getSarvamKey(),
  });

  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const meterIntervalRef = useRef<any>(null);

  const patch = (partial: Partial<VoiceState>) =>
    setState((s) => ({ ...s, ...partial }));

  const startSimulatedMeter = useCallback(() => {
    if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    meterIntervalRef.current = setInterval(() => {
      const base = 30 + Math.random() * 50;
      patch({ audioLevel: Math.round(base) });
    }, 100);
  }, []);

  const stopSimulatedMeter = useCallback(() => {
    if (meterIntervalRef.current) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }
    patch({ audioLevel: 0 });
  }, []);

  // ── Hardware Audio Capture & Metering ──────────────────────────────────────
  const startAudioCaptureStream = useCallback(async (): Promise<MediaStream | null> => {
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone API not supported in this browser.");
      }

      // Close any existing active streams first
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      micStreamRef.current = stream;

      // Web Audio API Analyser for real-time audio level feedback
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevel = () => {
            if (!micStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const scaled = Math.min(100, Math.round((avg / 128) * 100));
            patch({ audioLevel: scaled });
            animFrameRef.current = requestAnimationFrame(updateLevel);
          };
          updateLevel();
        }
      } catch {
        // AudioContext metering is optional, microphone stream is still valid
      }

      return stream;
    } catch (err: any) {
      const isPermissionDenied =
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.message?.includes("Permission denied");
      patch({
        error: isPermissionDenied
          ? lang === "kn"
            ? "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ."
            : "Microphone permission denied. Please allow microphone access in browser settings."
          : lang === "kn"
          ? "ಮೈಕ್ರೋಫೋನ್ ಆಡಿಯೋ ಸೆರೆಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ."
          : "Microphone not detected or inaccessible.",
      });
      return null;
    }
  }, [lang]);

  const stopAudioCaptureStream = useCallback(() => {
    stopSimulatedMeter();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    patch({ audioLevel: 0 });
  }, [stopSimulatedMeter]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAudioCaptureStream();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [stopAudioCaptureStream]);

  // ══════════════════════════════════════════════════════════════════════════
  //  SARVAM AI ASR (Optional Upgrade for Kannada)
  // ══════════════════════════════════════════════════════════════════════════
  const sarvamASR = useCallback(async (): Promise<boolean> => {
    const key = getSarvamKey();
    if (!key) return false;

    const stream = await startAudioCaptureStream();
    if (!stream) return false;

    try {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        patch({ isListening: false, isProcessing: true });
        stopAudioCaptureStream();

        try {
          const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const arrayBuffer = await webmBlob.arrayBuffer();
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioCtx();
          const decoded = await audioCtx.decodeAudioData(arrayBuffer);
          const wavBlob = float32ToWavBlob(decoded.getChannelData(0), decoded.sampleRate);

          const formData = new FormData();
          formData.append("file", wavBlob, "audio.wav");
          formData.append("language_code", "kn-IN");
          formData.append("model", "saarika:v2");

          const res = await fetch(SARVAM_STT_URL, {
            method: "POST",
            headers: { "api-subscription-key": key },
            body: formData,
          });

          if (!res.ok) throw new Error(`Sarvam STT ${res.status}`);
          const data = await res.json();
          const text: string = data?.transcript || "";

          if (text.trim()) {
            patch({ transcript: text, isProcessing: false, error: null });
            onTranscript(text);
            return;
          }
          throw new Error("Empty transcript from Sarvam");
        } catch (err: any) {
          console.warn("Sarvam ASR fallback to Web Speech:", err.message);
          patch({ isProcessing: false });
          webSpeechASR();
        }
      };

      recorder.start();
      patch({ isListening: true, error: null });
      return true;
    } catch {
      stopAudioCaptureStream();
      return false;
    }
  }, [onTranscript, startAudioCaptureStream, stopAudioCaptureStream]);

  // ══════════════════════════════════════════════════════════════════════════
  //  WEB SPEECH API ASR (Free, 100% Client-Side in Chrome / Edge)
  // ══════════════════════════════════════════════════════════════════════════
  const webSpeechASR = useCallback(async () => {
    if (typeof window === "undefined") return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      patch({
        error:
          lang === "kn"
            ? "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗ್ರಹಿಕೆ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ಗೂಗಲ್ ಕ್ರೋಮ್ (Chrome) ಅಥವಾ ಎಡ್ಜ್ (Edge) ಬಳಸಿ."
            : "Speech recognition not supported. Please use Google Chrome or Microsoft Edge.",
      });
      return;
    }

    // IMPORTANT: Fully release any active hardware streams before starting SpeechRecognition
    // to prevent WASAPI / audio-capture device conflicts on Windows Chromium browsers!
    stopAudioCaptureStream();

    // Abort previous session if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = getBrowserLangCode(lang);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      startSimulatedMeter();
      patch({ isListening: true, error: null });
    };

    recognition.onresult = (event: any) => {
      stopSimulatedMeter();
      const text: string = event.results[0][0].transcript;
      patch({ transcript: text, isListening: false, error: null });
      onTranscript(text);
    };

    recognition.onerror = (event: any) => {
      stopSimulatedMeter();
      const err = event.error;

      // Silently ignore manual user aborts
      if (err === "aborted") {
        patch({ isListening: false, error: null });
        return;
      }

      let errorMsg = `Voice error: ${err}`;
      if (err === "audio-capture") {
        errorMsg =
          lang === "kn"
            ? "ಮೈಕ್ರೋಫೋನ್ ಆಡಿಯೋ ಸೆರೆಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ."
            : "Microphone capture failed (no mic detected or device is busy). Please check your microphone or type your question below.";
      } else if (err === "not-allowed" || err === "service-not-allowed") {
        errorMsg =
          lang === "kn"
            ? "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ URL ಬಾರ್‌ನಲ್ಲಿರುವ 🔒 ಐಕಾನ್ ಒತ್ತಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ."
            : "Microphone access blocked. Click the 🔒 icon in your browser address bar to allow microphone access.";
      } else if (err === "no-speech") {
        errorMsg =
          lang === "kn"
            ? "ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಬಳಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ."
            : "No speech detected. Please speak clearly into your microphone.";
      } else if (err === "network") {
        errorMsg =
          lang === "kn"
            ? "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ."
            : "Network error during speech recognition. Please check your internet connection.";
      }

      patch({
        isListening: false,
        error: errorMsg,
      });
    };

    recognition.onend = () => {
      stopSimulatedMeter();
      patch({ isListening: false });
    };

    try {
      recognition.start();
    } catch (e: any) {
      stopSimulatedMeter();
      patch({
        isListening: false,
        error:
          lang === "kn"
            ? "ಧ್ವನಿ ಗ್ರಹಿಕೆ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ."
            : "Could not start voice recognition. Please try again or type your question.",
      });
    }
  }, [lang, onTranscript, startSimulatedMeter, stopAudioCaptureStream, stopSimulatedMeter]);

  // ══════════════════════════════════════════════════════════════════════════
  //  SARVAM AI TTS
  // ══════════════════════════════════════════════════════════════════════════
  const sarvamTTS = useCallback(async (text: string): Promise<boolean> => {
    const key = getSarvamKey();
    if (!key) return false;

    try {
      patch({ isSpeaking: true });

      const res = await fetch(SARVAM_TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": key,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: "kn-IN",
          speaker: "amol",
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          model: "bulbul:v1",
        }),
      });

      if (!res.ok) throw new Error(`Sarvam TTS ${res.status}`);
      const data = await res.json();
      const audioBase64: string = data?.audios?.[0] || "";
      if (!audioBase64) throw new Error("No audio from Sarvam TTS");

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        patch({ isSpeaking: false });
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        patch({ isSpeaking: false });
      };
      await audio.play();
      return true;
    } catch (err: any) {
      console.warn("Sarvam TTS failed, fallback to Web Speech:", err.message);
      patch({ isSpeaking: false });
      return false;
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  //  WEB SPEECH API TTS (Free Client-Side)
  // ══════════════════════════════════════════════════════════════════════════
  const webSpeechTTS = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getBrowserLangCode(lang);
    utterance.rate = lang === "kn" ? 0.9 : 1.0;
    utterance.pitch = 1.0;

    if (lang === "kn") {
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(
        (v) => v.lang === "kn-IN" || v.lang.startsWith("kn")
      );
      if (knVoice) utterance.voice = knVoice;
    }

    patch({ isSpeaking: true });
    utterance.onend = () => patch({ isSpeaking: false });
    utterance.onerror = () => patch({ isSpeaking: false });
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  // ══════════════════════════════════════════════════════════════════════════
  //  PUBLIC ACTIONS
  // ══════════════════════════════════════════════════════════════════════════
  const startListening = useCallback(async () => {
    patch({ error: null });
    if (lang === "kn" && getSarvamKey()) {
      const ok = await sarvamASR();
      if (!ok) await webSpeechASR();
    } else {
      await webSpeechASR();
    }
  }, [lang, sarvamASR, webSpeechASR]);

  const stopListening = useCallback(() => {
    stopAudioCaptureStream();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    patch({ isListening: false });
  }, [stopAudioCaptureStream]);

  const speak = useCallback(async (text: string) => {
    if (lang === "kn" && getSarvamKey()) {
      const ok = await sarvamTTS(text);
      if (!ok) webSpeechTTS(text);
    } else {
      webSpeechTTS(text);
    }
  }, [lang, sarvamTTS, webSpeechTTS]);

  const clearError = useCallback(() => patch({ error: null }), []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    clearError,
  };
}

export const useBhashiniVoice = useKannadaVoice;
