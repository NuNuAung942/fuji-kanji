/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import KanjiStrokeWriter from "./KanjiStrokeWriter";

interface Compound {
  kanji: string;
  reading: string;
  meaning_mm: string;
}
interface KanjiData {
  kanji: string;
  meaning_en: string;
  meaning_mm: string;
  onyomi: string;
  kunyomi: string;
  example?: string;
  compounds: Compound[];
}

interface KanjiCardProps {
  data: KanjiData;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: (text: string) => void;
  theme: "dark" | "sakura" | "fuji";
}

const KanjiCard: React.FC<KanjiCardProps> = ({
  data,
  isFlipped,
  onFlip,
  onSpeak,
  theme,
}) => {
  const writerRef = useRef<any>(null);

  const styles = useMemo(() => {
    switch (theme) {
      case "sakura":
        return {
          frontBorder: "border-rose-100",
          frontText: "text-[#eb22b1]",
          strokeColor: "#eb22b1",
          backBg: "bg-[#eb22b1]",
          backAccent: "bg-white/20 border-white/30",
          backSubText: "text-rose-100",
        };
      case "fuji":
        return {
          frontBorder: "border-sky-100",
          frontText: "text-[#0a8ccd]",
          strokeColor: "#0a8ccd",
          backBg: "bg-[#0a8ccd]",
          backAccent: "bg-white/20 border-white/30",
          backSubText: "text-sky-100",
        };
      default: // Dark Mode
        return {
          frontBorder: "border-indigo-200",
          frontText: "text-indigo-500",
          strokeColor: "#6366f1",
          backBg: "bg-indigo-600",
          backAccent: "bg-indigo-700/50 border-indigo-400/50",
          backSubText: "text-indigo-100",
        };
    }
  }, [theme]);

  return (
    <div className="relative w-full h-full perspective-1000">
      <motion.div
        className="w-full h-full transition-transform duration-500 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={onFlip}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center border-b-8 p-6 ${styles.frontBorder}`}
        >
          <div className="text-center mb-4">
            <h3 className={`text-xl font-bold ${styles.frontText}`}>
              {data.meaning_mm}{" "}
            </h3>
            <p className="flex justify-center pt-2 text-slate-400">
              <span className={`text-sm font-medium pr-4`}>
                KUNYOMI:&nbsp;{data.kunyomi}
              </span>
              <span className={`text-sm font-medium `}>
                ONYOMI:&nbsp;{data.onyomi}
              </span>
            </p>
          </div>
          <div className="my-2 relative">
            <KanjiStrokeWriter
              ref={writerRef}
              kanji={data.kanji}
              width={160}
              height={160}
              strokeColor={styles.strokeColor}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                writerRef.current?.replay();
              }}
              className={`absolute bottom-1 -right-2 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 active:scale-95 transition-transform ${styles.frontText}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <polyline points="21 3 21 8 16 8" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2">
            <span className={`text-6xl font-bold block mb-4 text-slate-400`}>
              {data.kanji}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(data.kanji);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-colors ${
                theme === "sakura"
                  ? "bg-rose-50 text-[#eb22b1] border-rose-100"
                  : theme === "fuji"
                    ? "bg-sky-50 text-[#0a8ccd] border-sky-100"
                    : "bg-indigo-50 text-indigo-600 border-indigo-100"
              }`}
            >
              🔊 Listen
            </button>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 backface-hidden rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 transition-colors duration-500 ${styles.backBg}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <h2
            className={`text-xl font-medium uppercase tracking-widest opacity-80 ${styles.backSubText}`}
          >
            {data.meaning_en}
          </h2>

          <h1 className="text-3xl font-bold text-white mt-2 mb-6">
            {data.meaning_mm}
          </h1>

          <div
            className={`w-full space-y-4 border-t pt-6 ${styles.backSubText} border-white/20`}
          >
            <p className="flex justify-between">
              <span className="text-xs opacity-60 uppercase">Onyomi</span>
              <span className="font-medium text-sm">{data.onyomi}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-xs opacity-60 uppercase">Kunyomi</span>
              <span className="font-medium text-sm">{data.kunyomi}</span>
            </p>
          </div>

          <div className="w-full mt-4 space-y-2 overflow-auto custom-scrollbar">
            <p
              className={`text-[10px] uppercase font-bold tracking-widest ${styles.backSubText}`}
            >
              Compounds (တွဲလုံးများ)
            </p>
            <div className="w-full max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {data.compounds.map((cp, index) => {
                const getCompoundStyles = () => {
                  switch (theme) {
                    case "sakura":
                      return "bg-[#cda3ce]/30 border-[#cda3ce]/40 hover:bg-[#cda3ce]/60";
                    case "fuji":
                      return "bg-[#a0cde5]/30 border-[#a0cde5]/40 hover:bg-[#a0cde5]/60";
                    default:
                      return "bg-indigo-700/40 border-indigo-500/30 hover:bg-indigo-500";
                  }
                };

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg border group transition-all duration-300 mb-2 ${getCompoundStyles()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeak(cp.kanji);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white leading-tight">
                        {cp.kanji}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${styles.backSubText} opacity-80`}
                      >
                        {cp.reading}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-white/90">
                      {cp.meaning_mm}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KanjiCard;
