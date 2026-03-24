import React, { useState, useMemo } from "react";
import type { Kanji } from "../../features/kanji/kanjiSlice";
import Button from "../ui/Button";

const getQuizOptions = (kanjiList: Kanji[], currentIndex: number) => {
  const currentKanji = kanjiList[currentIndex];
  if (!currentKanji) return [];
  const correct = `${currentKanji.meaning_mm} (${currentKanji.onyomi})`;

  const others = [...kanjiList]
    .filter((k) => k.kanji !== currentKanji.kanji)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((k) => `${k.meaning_mm} (${k.onyomi})`);
  return [correct, ...others].sort(() => Math.random() - 0.5);
};

interface QuizViewProps {
  kanjiList: Kanji[];
  week: number;
  theme: "dark" | "sakura" | "fuji";
  onClose: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({
  kanjiList,
  theme,
  onClose,
  week,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const correctMeaning = `${kanjiList[currentIndex]?.meaning_mm} (${kanjiList[currentIndex]?.onyomi})`;
  const options = useMemo(
    () => getQuizOptions(kanjiList, currentIndex),
    [currentIndex, kanjiList],
  );

  const handleAnswer = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const isRight = option === correctMeaning;

    setIsCorrect(isRight);
    if (isRight) setScore(score + 1);

    setTimeout(() => {
      if (currentIndex < kanjiList.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  // Theme Styles
  const styles = useMemo(() => {
    switch (theme) {
      case "sakura":
        return {
          card: "bg-white/90 border-rose-200 shadow-rose-100",
          kanji: "text-rose-600",
          subText: "text-rose-400",
          progressBg: "bg-rose-100",
          progressFill: "bg-rose-400",
          defaultBtn: "border-rose-100 text-rose-800 hover:bg-rose-50",
          closeBtn: "text-rose-900 bg-rose-100 hover:bg-rose-200",
        };
      case "fuji":
        return {
          card: "bg-white/90 border-sky-200 shadow-sky-100",
          kanji: "text-sky-700",
          subText: "text-sky-400",
          progressBg: "bg-sky-100",
          progressFill: "bg-sky-500",
          defaultBtn: "border-sky-100 text-sky-800 hover:bg-sky-50",
          closeBtn: "text-sky-900 bg-sky-100 hover:bg-sky-200",
        };
      default: // Dark Mode
        return {
          card: "bg-slate-800 border-slate-700 shadow-black/40",
          kanji: "text-indigo-400",
          subText: "text-slate-500",
          progressBg: "bg-slate-700",
          progressFill: "bg-indigo-500",
          defaultBtn: "border-slate-700 text-slate-200 hover:bg-slate-700/50",
          closeBtn: "text-white bg-white/10 hover:bg-white/20",
        };
    }
  }, [theme]);

  const getHeaderStyles = () => {
    switch (theme) {
      case "sakura":
        return "text-rose-900 bg-rose-50 hover:bg-rose-100";
      case "fuji":
        return "text-sky-900 bg-sky-50 hover:bg-sky-100";
      default:
        return "text-white bg-white/10 hover:bg-white/20";
    }
  };

  const progressPercent = ((currentIndex + 1) / kanjiList.length) * 100;
  if (showResult) {
    const percentage = Math.round((score / kanjiList.length) * 100);
    const getFeedback = () => {
      if (percentage === 100)
        return {
          msg: "Perfect!",
          sub: "အားလုံးမှန်ပါတယ်! ထူးချွန်တယ်!",
          icon: "👑",
        };
      if (percentage >= 80)
        return {
          msg: "Excellent!",
          sub: "အရမ်းတော်တယ်! ဆက်ကြိုးစားပါ!",
          icon: "🔥",
        };
      if (percentage >= 50)
        return {
          msg: "Good Job!",
          sub: "မဆိုးဘူးနော်! နောက်တစ်ခေါက် ထပ်လုပ်ကြည့်ရအောင်!",
          icon: "✨",
        };
      return {
        msg: "Keep Going!",
        sub: "စိတ်မလျှော့နဲ့ဦး! နည်းနည်းပဲ လိုတော့တယ်!",
        icon: "💪",
      };
    };

    const feedback = getFeedback();

    return (
      <div
        className={`p-10 rounded-[2.5rem] border-2 text-center shadow-2xl relative overflow-hidden transition-all duration-700 ${styles.card}`}
      >
        {/* Background Decorative Glow */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${styles.progressFill}`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${styles.progressFill}`}
        />

        <div className="relative z-10">
          <span className="text-6xl mb-4 block animate-bounce">
            {feedback.icon}
          </span>

          <h2
            className={`text-5xl font-black mb-1 tracking-tighter ${styles.kanji}`}
          >
            {feedback.msg}
          </h2>

          <p className={`text-sm font-bold mb-8 opacity-70 ${styles.subText}`}>
            {feedback.sub}
          </p>

          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className={`${styles.progressBg} opacity-20`}
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * percentage) / 100}
                strokeLinecap="round"
                className={`${styles.progressFill} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${styles.kanji}`}>
                {percentage}%
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold opacity-50 ${styles.subText}`}
              >
                {score} / {kanjiList.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setShowResult(false);
                setSelectedOption(null);
              }}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg ${styles.progressFill} text-white`}
            >
              Try Again
            </button>

            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-black/5 dark:hover:bg-white/5 ${styles.subText}`}
            >
              Back to Study
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm px-4 relative">
      {/* --- Close Button --- */}
      <Button
        onClick={onClose}
        className={`absolute -top-16 right-4 p-2 rounded-full transition-all active:scale-90 z-50 ${getHeaderStyles()}`}
        title="Exit Quiz"
      >
        <span className={`text-lg ${styles.defaultBtn}`}>Back to Study</span>
      </Button>
      <div
        className={`w-full max-w-sm p-6 min-w-[350px] rounded-3xl border-2 shadow-2xl ${styles.card}`}
      >
        <div className="mb-6">
          <h3
            className={`text-sm font-black uppercase tracking-[0.3em] text-center mb-4 ${styles.kanji} opacity-80`}
          >
            Week {week} Quiz!
          </h3>
          <div className="flex justify-between items-end mb-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${styles.subText}`}
            >
              Question {currentIndex + 1} of {kanjiList.length}
            </span>
            <span className={`text-xs font-bold ${styles.subText}`}>
              Score: {score}
            </span>
          </div>
          {/* Progress Bar */}
          <div className={`w-full h-1.5 rounded-full ${styles.progressBg}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${styles.progressFill}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2
            className={`text-8xl font-black mb-2 drop-shadow-sm transition-all duration-500 ${styles.kanji}`}
          >
            {kanjiList[currentIndex]?.kanji}
          </h2>
          <p
            className={`text-[10px] uppercase font-black tracking-[0.2em] ${styles.subText} opacity-50`}
          >
            Choose the correct meaning
          </p>
        </div>
        <div className="space-y-3">
          {options.map((option) => {
            const isThisCorrect = option === correctMeaning;
            const isThisSelected = selectedOption === option;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex justify-between items-center ${
                  selectedOption
                    ? isThisCorrect
                      ? "border-green-500 bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" // အဖြေမှန်ကို အမြဲ အစိမ်းပြမယ်
                      : isThisSelected
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "opacity-40 border-transparent text-slate-500"
                    : styles.defaultBtn
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
