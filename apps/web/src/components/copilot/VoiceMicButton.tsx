"use client";

import React, { useState } from "react";
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";

interface VoiceMicButtonProps {
  onTranscript: (text: string) => void;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const { language } = useFarmStore();

  const handleToggleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === "kn" ? "kn-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleToggleMic}
        className={`relative p-5 rounded-full shadow-lg transition-all duration-300 ${
          isListening
            ? "bg-red-500 text-white animate-pulse scale-110 shadow-red-300"
            : "bg-krishi-600 hover:bg-krishi-700 text-white shadow-krishi-200"
        }`}
        title="Speak with Kisan Mitra"
      >
        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
      <span className="mt-2 text-xs font-semibold text-krishi-900 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-krishi-gold" />
        {isListening ? (language === "kn" ? "ಆಲಿಸುತ್ತಿದೆ..." : "Listening...") : (language === "kn" ? "ಧ್ವನಿ ಸಹಾಯಕ" : "Voice Assistant")}
      </span>
    </div>
  );
};
