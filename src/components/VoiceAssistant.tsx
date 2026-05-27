import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, AlertCircle, Play } from "lucide-react";
import { CarKey, Variant } from "../types";
import { parseVoice } from "../data/cars";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  accent: string;
  onAutoFill: (logs: string[]) => void;
  setCustomerName: (name: string) => void;
  setCarKey: (key: CarKey) => void;
  setFuelType: (fuel: string) => void;
  setVariant: (v: Variant) => void;
  setDiscount: (discount: string) => void;
  setDiscountLabel: (label: string) => void;
  setSelectedColor: (color: { name: string; hex: string } | null) => void;
  setRtoType: (type: "standard" | "bh") => void;
}

export default function VoiceAssistant({
  accent,
  onAutoFill,
  setCustomerName,
  setCarKey,
  setFuelType,
  setVariant,
  setDiscount,
  setDiscountLabel,
  setSelectedColor,
  setRtoType,
}: VoiceAssistantProps) {
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [typedCommand, setTypedCommand] = useState("");
  const [showManualCmd, setShowManualCmd] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition capability
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsSupported(false);
      setShowManualCmd(true); // Auto expand manual commands if voice is not supported
    }
  }, []);

  const startVoice = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceStatus("Speech Recognition is not supported on this browser. Try Chrome/Safari.");
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-IN"; // standard Indian English
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setListening(true);
        setVoiceText("");
        setVoiceStatus("Listening for your command...");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setVoiceText(transcript);

        const matchedDetails = parseVoice(
          transcript,
          setCustomerName,
          setCarKey,
          setFuelType,
          setVariant,
          setDiscount,
          setDiscountLabel,
          setSelectedColor,
          setRtoType
        );
        if (matchedDetails.length > 0) {
          setVoiceStatus(`Successfully filled: ${matchedDetails.join(" • ")}`);
          if (event.results[event.results.length - 1].isFinal) {
            onAutoFill(matchedDetails);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setVoiceStatus("Microphone access blocked. Enable permissions or try manual typing below.");
        } else {
          setVoiceStatus(`Recognition issue: ${event.error}`);
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition startup error", err);
      setVoiceStatus("Could not activate voice audio device.");
      setListening(false);
    }
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const executeTypedCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;

    const matchedDetails = parseVoice(
      typedCommand,
      setCustomerName,
      setCarKey,
      setFuelType,
      setVariant,
      setDiscount,
      setDiscountLabel,
      setSelectedColor,
      setRtoType
    );

    if (matchedDetails.length > 0) {
      setVoiceStatus(`Processed text command: Resolved ${matchedDetails.join(" • ")}`);
      onAutoFill(matchedDetails);
      setTypedCommand("");
    } else {
      setVoiceStatus("No matching details identified from typed search. Adjust phrasing.");
    }
  };

  const runPreset = (text: string) => {
    setTypedCommand(text);
    const matchedDetails = parseVoice(
      text,
      setCustomerName,
      setCarKey,
      setFuelType,
      setVariant,
      setDiscount,
      setDiscountLabel,
      setSelectedColor,
      setRtoType
    );
    if (matchedDetails.length > 0) {
      setVoiceStatus(`Auto-filled preset: ${matchedDetails.join(" • ")}`);
      onAutoFill(matchedDetails);
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 mb-6 overflow-hidden shadow-xl shadow-black/10 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className="font-display font-bold text-sm tracking-wide uppercase text-zinc-300">
              Voice Configuration Engine
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Fill the quotation instantly with a single natural command.
          </p>
        </div>

        <button
          onClick={listening ? stopVoice : startVoice}
          disabled={!isSupported}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            !isSupported ? "opacity-35 cursor-not-allowed grayscale" : "cursor-pointer"
          }`}
          style={{
            background: listening ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.03)",
            border: listening ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
          }}
          title={!isSupported ? "Speech recognition is blocked or unsupported in this preview view" : (listening ? "Stop Listening" : "Start Voice Assistant")}
        >
          {listening ? (
            <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
          ) : null}
          {listening ? (
            <MicOff className="w-5 h-5 text-red-400" />
          ) : (
            <Mic className="w-5 h-5 text-zinc-300 hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {!isSupported && (
        <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/35 rounded-2xl text-xs space-y-2 leading-relaxed text-zinc-300">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Speech Recognition Blocked/Unsupported (Iframe View)</span>
          </div>
          <p>
            Your browser blocks microphone permissions inside secure iframe previews. To use live speech-to-text commands:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-zinc-400 font-normal">
            <li>
              Click the <span className="text-zinc-200 font-semibold font-mono bg-zinc-950/80 border border-zinc-900 px-1.5 py-0.5 rounded text-[10px]">Open in a new tab ↗</span> button at the top-right of the screen to launch full-screen.
            </li>
            <li>
              Or, use Google Chrome, Apple Safari, or Microsoft Edge.
            </li>
          </ul>
          <p className="text-amber-500 font-medium">
            ✨ You can type your commands and click the preset buttons directly below—they work 100% of the time!
          </p>
        </div>
      )}

      {listening && (
        <div className="flex flex-col items-center justify-center py-4 bg-zinc-950/40 rounded-xl mb-3 border border-zinc-800/50">
          <div className="flex items-center gap-1.5 h-6 mb-2">
            {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
              <motion.span
                key={idx}
                className="w-1 bg-amber-500 rounded-full"
                animate={{
                  height: ["10%", "90%", "10%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + idx * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <span className="text-xs text-amber-500 font-mono">Listening Live...</span>
        </div>
      )}

      {/* Live Text Caption / Status Banner */}
      {voiceText && (
        <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-850/50 mb-3">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Transcript Preview</p>
          <p className="text-sm font-medium text-zinc-300 italic">"{voiceText}"</p>
        </div>
      )}

      {voiceStatus && (
        <div
          className={`text-xs p-3 rounded-lg flex items-start gap-2 border ${
            voiceStatus.includes("Successfully") || voiceStatus.includes("Processed") || voiceStatus.includes("Auto-filled")
              ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
              : voiceStatus.includes("blocked") || voiceStatus.includes("issue")
              ? "bg-red-950/30 border-red-900/50 text-red-400"
              : "bg-zinc-950/30 border-zinc-800 text-zinc-400"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{voiceStatus}</span>
        </div>
      )}

      {/* Manual fallback option */}
      <div className="mt-4 pt-4 border-t border-zinc-800/55 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-400">Can't speak or microphone disabled?</span>
          <button
            onClick={() => setShowManualCmd(!showManualCmd)}
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
          >
            {showManualCmd ? "Hide Search Bar" : "Type Command Instead"}
          </button>
        </div>

        <AnimatePresence>
          {showManualCmd && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 space-y-3 overflow-hidden"
              onSubmit={executeTypedCommand}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedCommand}
                  onChange={(e) => setTypedCommand(e.target.value)}
                  placeholder="e.g. quote for Rahul, Harrier Fearless UL Petrol MT, discount of 50000"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30"
                />
                <button
                  type="submit"
                  className="bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-black py-2 px-4 rounded-xl text-xs font-bold text-amber-400 transition-all duration-200 cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* presets to help user test immediately */}
              <div>
                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-1.5">Preset Examples (Click to Autofill)</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => runPreset("Quote and configure Harrier Fearless UL Petrol MT for Rahul Sharma")}
                    className="bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400 rounded-lg text-left truncate max-w-full transition-colors cursor-pointer"
                  >
                    🚀 Harrier Fearless for Rahul
                  </button>
                  <button
                    type="button"
                    onClick={() => runPreset("Safari Accomplished X Plus Diesel AT for Dr. Shrikant with discount of 75000")}
                    className="bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400 rounded-lg text-left truncate max-w-full transition-colors cursor-pointer"
                  >
                    🌟 Safari Accomplished plus Discount
                  </button>
                  <button
                    type="button"
                    onClick={() => runPreset("Curvv Accomplished Plus Petrol MT for Mrs. Kadam")}
                    className="bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400 rounded-lg text-left truncate max-w-full transition-colors cursor-pointer"
                  >
                    ⚡ Curvv for Mrs. Kadam
                  </button>
                  <button
                    type="button"
                    onClick={() => runPreset("Amit with Fearless UL RDK")}
                    className="bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-400 rounded-lg text-left truncate max-w-full transition-colors cursor-pointer bg-amber-500/5! border-amber-500/20!"
                    title="Selects Amit as name, Harrier as car model, and sets Fearless UL RDK dark edition variant automatically!"
                  >
                    ✨ Amit with Fearless UL RDK (Variant only)
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
