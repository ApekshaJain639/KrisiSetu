"use client";

import { useState, useCallback } from "react";
import { useFarmStore } from "@/stores/useFarmStore";

export function useVoiceCopilot(onTranscriptResult?: (text: string) => void) {
  const { language } = useFarmStore();
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastTranscript, setLastTranscript] = useState("");

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "kn"
        ? "kn-IN"
        : language === "hi"
        ? "hi-IN"
        : language === "mr"
        ? "mr-IN"
        : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setAudioLevel(0.8);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
      if (onTranscriptResult) {
        onTranscriptResult(transcript);
      }
      setIsListening(false);
      setAudioLevel(0);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setAudioLevel(0);
    };

    recognition.onend = () => {
      setIsListening(false);
      setAudioLevel(0);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }, [language, onTranscriptResult]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "kn"
          ? "kn-IN"
          : language === "hi"
          ? "hi-IN"
          : language === "mr"
          ? "mr-IN"
          : "en-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  return {
    isListening,
    audioLevel,
    lastTranscript,
    startListening,
    speak,
  };
}
