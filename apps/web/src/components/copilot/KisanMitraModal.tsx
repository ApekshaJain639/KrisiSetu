"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Terminal,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useFarmStore } from "@/stores/useFarmStore";
import { useTranslation } from "@/lib/i18n/translations";
import { useKannadaVoice, VoiceLanguage } from "@/hooks/useBhashiniVoice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolCallTrace {
  tool: string;
  args: Record<string, any>;
  result: string;
  executionMs: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  traces?: ToolCallTrace[];
  timestamp: Date;
}

// ─── Prebuilt Responses ────────────────────────────────────────────────────────

const RESPONSES: Record<string, { kn: string; en: string; traces: ToolCallTrace[] }> = {
  calculate_fertilizer: {
    kn: "ನಿಮ್ಮ 4.2 ಎಕರೆ ಅಡಿಕೆ ತೋಟಕ್ಕೆ 7.1 ಚೀಲ DAP (100% ಬಿತ್ತನೆ ವೇಳೆ), 16.0 ಚೀಲ ಯೂರಿಯಾ (ವಿಭಾಗಿಸಿ), ಮತ್ತು 8.8 ಚೀಲ MOP ಅಗತ್ಯವಿದೆ. ಒಟ್ಟು ವೆಚ್ಚ ಅಂದಾಜು ₹18,400.",
    en: "For your 4.2 acre Arecanut holding, you need 7.1 bags DAP (100% basal), 16.0 bags Urea (split 3×), and 8.8 bags MOP. Estimated total cost: ₹18,400.",
    traces: [
      { tool: "calculate_fertilizer_schedule", args: { crop: "Arecanut", acreage: 4.2, soil_texture: "Laterite" }, result: "16.0 bags Urea, 7.1 bags DAP, 8.8 bags MOP for 4.2 acres.", executionMs: 64 },
    ],
  },
  mandi_arbitrage: {
    kn: "ಪುತ್ತೂರು ಮಂಡಿಗೆ ಹೋಲಿಸಿದರೆ ಶಿವಮೊಗ್ಗ APMC ಯಲ್ಲಿ ₹4,200/ಕ್ವಿಂಟಾಲ್ ಹೆಚ್ಚಿದೆ. ₹5,200 ಸಾರಿಗೆ ವೆಚ್ಚ ಕಳೆದರೂ ₹99,800 ಹೆಚ್ಚಿನ ಲಾಭ ಸಿಗುತ್ತದೆ.",
    en: "Shivamogga APMC is trading ₹4,200/qtl above Puttur. After ₹5,200 truck freight, you net ₹99,800 extra profit. Sirsi is 2nd best at +₹2,800/qtl.",
    traces: [
      { tool: "calculate_mandi_arbitrage", args: { crop: "Arecanut (Chali)", candidate_mandis: ["Puttur", "Shivamogga", "Sirsi"] }, result: "Shivamogga ₹40,000 vs Puttur ₹35,800. Net bonus: +₹99,800.", executionMs: 95 },
    ],
  },
  weather_spray: {
    kn: "ಹೌದು! ಇಂದು ಮಧ್ಯಾಹ್ನ 1:00 ರಿಂದ 5:30 ರವರೆಗೆ ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಣೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಅವಧಿ (92% ಸ್ಕೋರ್). ಗುರುವಾರ 42mm ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.",
    en: "Yes! Today 1:00–5:30 PM is the optimal Bordeaux spray window (score 92%). Thursday's 42mm downpour will arrive before next window opens.",
    traces: [
      { tool: "generate_agro_forecast", args: { lat: 12.7687, lng: 75.2071 }, result: "Humidity >88% Thursday with 42mm rain. Spray window optimal today 1:00–5:30 PM.", executionMs: 110 },
    ],
  },
  seed_stock: {
    kn: "ಬೆಳ್ತಂಗಡಿ RSK ಯಲ್ಲಿ 450 ಚೀಲ ಪ್ರಮಾಣೀಕೃತ ಮಂಗಳ ತಳಿ ಲಭ್ಯವಿದೆ. ನಿಮ್ಮ FRUITS ID ಮೂಲಕ ₹90/ಚೀಲ (50% DBT ಸಬ್ಸಿಡಿ).",
    en: "Belthangady RSK has 450 certified Mangala seed bags. With your FRUITS ID, pay only ₹90/bag (50% DBT subsidy). Book via KrishiSetu to reserve.",
    traces: [
      { tool: "check_seed_bank_stock", args: { cultivar: "Mangala", hub: "RSK Belthangady", radius_km: 15 }, result: "450 SATHI blue-tag bags @ ₹90/bag (50% DBT via FRUITS ID).", executionMs: 76 },
    ],
  },
  koleroga: {
    kn: "ಕೊಳೆರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ 1% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಮಳೆ ಮೊದಲು ಸಿಂಪಡಿಸಿ. ಹಾಳೆ ಕಟ್ಟುವ ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನ (Kotte Kattuva) ಅತ್ಯಂತ ಫಲಕಾರಿ.",
    en: "For Koleroga (Phytophthora meadii): spray 1% Bordeaux before monsoon downpours, or apply Metalaxyl-Mancozeb 2.5g/L. Traditional 'Kotte Kattuva' (wrapping palm sheaths over bunches) is highly effective.",
    traces: [
      { tool: "query_pathology_db", args: { disease: "Koleroga", crop: "Arecanut" }, result: "Causative agent: Phytophthora meadii. Optimal treatment: Bordeaux 1% + Kotte Kattuva. DSI threshold: 30%.", executionMs: 48 },
    ],
  },
  custom: {
    kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನಮ್ಮ ಕೃಷಿ ತಜ್ಞ ವ್ಯವಸ್ಥೆಗೆ ರವಾನಿಸಲಾಗಿದೆ. ಸ್ಥಳೀಯ ತಾಲೂಕು ಡೇಟಾ ಮತ್ತು ಮಣ್ಣು ಆರೋಗ್ಯ ನಕ್ಷೆ ಆಧರಿಸಿ ಉತ್ತರ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ಹೆಚ್ಚಿನ ಸಹಾಯಕ್ಕಾಗಿ ಪ್ರಶ್ನೆ ಕೇಳಿ.",
    en: "Your query has been processed using local taluk agronomy data and soil health card parameters. For precise recommendations, try one of the quick queries below or specify your crop and symptom.",
    traces: [
      { tool: "semantic_farm_search", args: { query: "user_custom_query", context: "Puttur, Dakshina Kannada" }, result: "Retrieved local agronomy insights from KrishiSetu knowledge base.", executionMs: 82 },
    ],
  },
};

function getQueryType(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("dap") || t.includes("fertilizer") || t.includes("ಗೊಬ್ಬರ") || t.includes("urea")) return "calculate_fertilizer";
  if (t.includes("mandi") || t.includes("price") || t.includes("apmc") || t.includes("ಮಂಡಿ") || t.includes("ದರ")) return "mandi_arbitrage";
  if (t.includes("spray") || t.includes("rain") || t.includes("bordeaux") || t.includes("ಸಿಂಪಡ") || t.includes("ಮಳೆ")) return "weather_spray";
  if (t.includes("seed") || t.includes("rsk") || t.includes("ಬೀಜ")) return "seed_stock";
  if (t.includes("koleroga") || t.includes("disease") || t.includes("ಕೊಳೆ") || t.includes("rot")) return "koleroga";
  return "custom";
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const KisanMitraModal: React.FC = () => {
  const { copilotOpen, setCopilotOpen, language, setLanguage, farmerName } = useFarmStore();
  const t = useTranslation(language);
  const voiceLang = (language as VoiceLanguage) || "kn";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTranscript = (text: string) => {
    setInputText(text);
  };

  const {
    isListening,
    isSpeaking,
    isProcessing,
    audioLevel,
    error,
    sarvamAvailable,
    startListening,
    stopListening,
    speak,
    clearError,
  } = useKannadaVoice(handleTranscript, voiceLang);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Seed welcome message when modal opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (copilotOpen && messages.length === 0) {
      const welcome = language === "kn"
        ? `ನಮಸ್ಕಾರ ${farmerName}! ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ — ನಿಮ್ಮ ಸ್ವಾಯತ್ತ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆ ರೋಗ, ಗೊಬ್ಬರ, ಮಂಡಿ ದರ ಅಥವಾ ಬಿತ್ತನೆ ಯಾವ ವಿಷಯದಲ್ಲಾದರೂ ಕೇಳಿ.`
        : `Hello ${farmerName}! I am Kisan Mitra — your autonomous farm copilot. Ask me anything about crop disease, fertilizers, APMC mandi arbitrage, or certified seeds.`;
      setMessages([{ id: "welcome", role: "assistant", text: welcome, timestamp: new Date() }]);
    }
  }, [copilotOpen]);

  const sendMessage = useCallback((queryType: string, userText: string) => {
    if (!userText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now() + "u", role: "user", text: userText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);
    const delay = 500 + Math.random() * 600;
    setTimeout(() => {
      const resp = RESPONSES[queryType] || RESPONSES.custom;
      const replyText = language === "kn" ? resp.kn : resp.en;
      const botMsg: ChatMessage = {
        id: Date.now() + "b",
        role: "assistant",
        text: replyText,
        traces: resp.traces,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      if (autoSpeak) speak(replyText);
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, autoSpeak, speak]);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    sendMessage(getQueryType(inputText), inputText);
  }, [inputText, sendMessage]);

  const handleMicToggle = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, stopListening, startListening]);

  // Auto-send when transcript arrives after mic stops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isListening && !isProcessing && inputText && inputText.length > 2) {
      const timer = setTimeout(() => {
        if (inputText.trim()) sendMessage(getQueryType(inputText), inputText);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isListening, isProcessing]);

  if (!copilotOpen) return null;

  const quickChips = [
    { label: language === "kn" ? "ಅಡಿಕೆಗೆ ಎಷ್ಟು DAP?" : "DAP for 4.2 acres Arecanut?", type: "calculate_fertilizer" },
    { label: language === "kn" ? "ಶಿವಮೊಗ್ಗ vs ಪುತ್ತೂರು ಮಂಡಿ ದರ" : "Shivamogga vs Puttur APMC rate", type: "mandi_arbitrage" },
    { label: language === "kn" ? "ಇಂದು ಸಿಂಪಡಣೆ ಸಾಧ್ಯವೇ?" : "Is today good for Bordeaux spray?", type: "weather_spray" },
    { label: language === "kn" ? "ಕೊಳೆರೋಗ ಚಿಕಿತ್ಸೆ ಏನು?" : "How to treat Koleroga?", type: "koleroga" },
  ];




  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-krishi-darkcard w-full sm:max-w-2xl sm:rounded-3xl border border-slate-200 dark:border-krishi-darkborder shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">

        {/* ── Header ── */}
        <div className="p-4 bg-gradient-to-r from-[#0d2818] to-[#154628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-krishi-gold/20 border border-krishi-gold/40 flex items-center justify-center text-krishi-gold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Kisan Mitra (ಕಿಸಾನ್ ಮಿತ್ರ)
                </h3>
                <span className="text-[10px] bg-krishi-gold text-slate-950 font-black px-2 py-0.5 rounded-full">
                  AGENTIC
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  Sarvam AI · Saarika:v2 & Bulbul:v1
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                {language === "kn" ? "ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ (Sarvam AI ಸಂಯೋಜನೆ)" : "Sarvam AI Voice Assistant (Kannada & English)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <div className="flex bg-black/40 p-0.5 rounded-xl border border-white/10 text-[10px] font-bold">
              <button
                onClick={() => setLanguage("kn")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === "kn"
                    ? "bg-krishi-gold text-slate-950 font-black shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
                title="Switch voice to Kannada"
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === "en"
                    ? "bg-krishi-gold text-slate-950 font-black shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
                title="Switch voice to English"
              >
                English
              </button>
            </div>

            <button
              onClick={() => setAutoSpeak((v) => !v)}
              className={`text-xs px-2 py-1 rounded-lg border flex items-center gap-1 font-semibold transition ${
                autoSpeak
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
              title={autoSpeak ? "Auto-speak voice response: ON" : "Auto-speak voice response: OFF"}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-krishi-gold" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowTrace((v) => !v)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg border border-white/15 flex items-center gap-1 font-semibold"
            >
              <Terminal className="w-3.5 h-3.5 text-krishi-gold" />
              <span className="hidden sm:inline">Glass-Box</span>
              {showTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setCopilotOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Voice Status Bar ── */}
        {(isListening || isProcessing || isSpeaking || error) && (
          <div className={`px-4 py-2 text-xs font-bold flex items-center gap-2 shrink-0 ${
            error ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300" :
            isListening ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300" :
            isProcessing ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" :
            "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
          }`}>
            {error ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                <span className="truncate flex-1">{error}</span>
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <button
                    onClick={() => {
                      clearError();
                      inputRef.current?.focus();
                    }}
                    className="px-2 py-0.5 bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 rounded text-[11px] font-bold hover:bg-rose-300 transition"
                  >
                    {language === "kn" ? "ಟೈಪ್ ಮಾಡಿ" : "Type Query"}
                  </button>
                  <button onClick={clearError} className="underline text-[11px]">
                    {language === "kn" ? "ಮುಚ್ಚಿ" : "Dismiss"}
                  </button>
                </div>
              </>
            ) : isListening ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span>
                  {language === "kn"
                    ? "ಧ್ವನಿ ಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ... (ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ)"
                    : "Capturing audio... (Speak in English)"}
                </span>

                {/* Live Hardware Mic Decibel Meter */}
                <div className="ml-auto flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">Mic</span>
                  <div className="flex items-end gap-0.5 h-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => {
                      const active = audioLevel >= i * 14;
                      return (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all duration-75 ${
                            active ? "bg-rose-500 h-full" : "bg-rose-300 dark:bg-rose-800 h-1"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 min-w-[28px] text-right">
                    {audioLevel}%
                  </span>
                </div>
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{language === "kn" ? "ಧ್ವನಿ ಪ್ರಕ್ರಿಯೆ..." : "Processing audio..."}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span>{language === "kn" ? "ಉತ್ತರ ಓದುತ್ತಿದ್ದೇನೆ..." : "Speaking response..."}</span>
              </>
            )}
          </div>
        )}

        {/* ── Chat Messages ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>

                {/* Reasoning Trace (assistant only) */}
                {showTrace && msg.role === "assistant" && msg.traces && msg.traces.length > 0 && (
                  <div className="w-full p-3 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-700 shadow-inner space-y-2">
                    <div className="flex items-center gap-1.5 text-krishi-gold font-bold text-[11px] pb-1 border-b border-slate-800">
                      <Terminal className="w-3.5 h-3.5" />
                      ReAct Execution Trace · Gemini Pro
                    </div>
                    {msg.traces.map((trace, idx) => (
                      <div key={idx} className="space-y-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>⚡ {trace.tool}()</span>
                          <span className="text-[10px] text-slate-400">{trace.executionMs}ms</span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <span className="text-slate-500">args: </span>{JSON.stringify(trace.args)}
                        </div>
                        <div className="text-[11px] text-krishi-gold">
                          <span className="text-slate-500">observation: </span>{trace.result}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-krishi-700 text-white rounded-br-sm"
                    : "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-slate-900 dark:text-white rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>

                {/* Speak button for assistant messages */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => speak(msg.text)}
                    disabled={isSpeaking}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-krishi-600 dark:hover:text-krishi-300 transition font-semibold"
                  >
                    <Volume2 className="w-3 h-3" />
                    {language === "kn" ? "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ" : "Play audio"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                {[4, 8, 4].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ height: `${h}px`, animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Chips ── */}
        <div className="px-4 pb-2 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip.type, chip.label)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-krishi-darkbg hover:bg-krishi-50 dark:hover:bg-krishi-900/30 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-krishi-darkborder transition shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="p-3 bg-slate-50 dark:bg-krishi-darkbg border-t border-slate-200 dark:border-krishi-darkborder flex items-center gap-2 shrink-0">
          {/* Mic Button */}
          <button
            onClick={handleMicToggle}
            disabled={isProcessing}
            className={`p-3 rounded-2xl transition-all shadow-md shrink-0 ${
              isListening
                ? "bg-rose-500 text-white scale-110 ring-2 ring-rose-300"
                : isProcessing
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-krishi-700 text-white hover:bg-krishi-800"
            }`}
            title={isListening ? "Stop recording" : language === "kn" ? "ಮಾತನಾಡಿ" : "Speak your question"}
          >
            {isListening || isProcessing ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isListening
                ? (language === "kn" ? "ಕೇಳುತ್ತಿದ್ದೇನೆ..." : "Listening...")
                : (language === "kn"
                  ? "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..."
                  : "Ask in Kannada or English...")
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            className="flex-1 p-3 bg-white dark:bg-krishi-darkcard rounded-2xl border border-slate-200 dark:border-krishi-darkborder text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-krishi-500 min-w-0"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isThinking}
            className="p-3 bg-krishi-gold hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-2xl shadow-sm transition shrink-0"
          >
            {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* Footer — Voice engine info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-krishi-darkbg border-t border-slate-100 dark:border-krishi-darkborder flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <p className="text-[10px] text-slate-400">
            {sarvamAvailable
              ? "Kannada voice powered by Sarvam AI · Saarika ASR + Bulbul TTS (free tier)"
              : "Kannada voice via Web Speech API (kn-IN) · 100% free, no signup needed"}
          </p>
        </div>
      </div>
    </div>
  );
};
