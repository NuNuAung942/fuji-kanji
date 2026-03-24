import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  nextCard,
  toggleFlip,
  setDay,
  setWeek,
  addWeekData,
  previousCard,
} from "./features/kanji/kanjiSlice";
import KanjiCard from "./components/features/KanjiCard";
import WeekMenu from "./components/features/WeekMenu";
import DayMenu from "./components/features/DayMenu";
import { useState } from "react";
import ThemeSwitcher from "./components/ui/ThemeSwitcher";
import QuizView from "./components/features/QuizView";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "./components/ui/Button";

function App() {
  const dispatch = useAppDispatch();
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [theme, setTheme] = useState<"dark" | "sakura" | "fuji">("dark");
  const { weeks, selectedWeek, selectedDay, currentIndex, isFlipped } =
    useAppSelector((state) => state.kanji);
  const currentWeek = weeks.find((w) => w.week === selectedWeek);

  const getThemeClass = () => {
    switch (theme) {
      case "sakura":
        return "bg-sakura-light text-sakura-dark";
      case "fuji":
        return "bg-fuji-light text-fuji-dark";
      default:
        return "bg-slate-900 text-white";
    }
  };

  const handleWeekChange = async (week: number) => {
    const isDataLoaded = weeks.some((w) => w.week === week);

    if (!isDataLoaded) {
      try {
        const data = await import(`./data/n3_week${week}.json`);
        dispatch(addWeekData(data.default || data));
      } catch (error) {
        console.error("JSON load error for week " + week + ":", error);
      }
    }
    dispatch(setWeek(week));
  };

  const currentWeekData = weeks.find((w) => w.week === selectedWeek);
  const currentDayData = currentWeekData?.days.find(
    (d) => d.day === selectedDay,
  );
  const kanjiList = currentDayData?.kanji_list || [];
  const currentKanji = kanjiList[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === kanjiList.length - 1;

  const handleSpeak = (text: string) => {
    const synth = window.speechSynthesis;

    const speakNow = () => {
      const voices = synth.getVoices();

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = "ja-JP";
      msg.rate = 0.7;

      const jpVoice = voices.find((v) => v.lang.startsWith("ja"));

      if (jpVoice) {
        msg.voice = jpVoice;
      }

      synth.cancel();
      synth.speak(msg);
    };
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = speakNow;
    } else {
      speakNow();
    }
    alert("Speak " + text);
  };

  //quiz
  const startWeekQuiz = () => {
    const allWeekKanji =
      currentWeekData?.days.flatMap((d) => d.kanji_list) || [];
    const shuffledQuiz = [...allWeekKanji].sort(() => Math.random() - 0.5);
    const limitedQuiz = shuffledQuiz.slice(0, 30);

    return limitedQuiz;
  };

  return (
    <div
      className={`min-h-screen text-white flex flex-col items-center p-6 transition-colors duration-500 ${getThemeClass()}`}
    >
      {isQuizActive ? (
        <div className="flex flex-col min-w-[350px] items-center justify-center min-h-screen p-6">
          <QuizView
            kanjiList={startWeekQuiz()}
            week={selectedWeek}
            theme={theme}
            onClose={() => setIsQuizActive(false)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center min-w-[350px] p-6 pt-0">
          <header className="mt-8 mb-6 text-center">
            <h1
              className={`text-2xl font-black tracking-tighter uppercase transition-colors duration-500 ${
                theme === "sakura"
                  ? "text-[#eb22b1]"
                  : theme === "fuji"
                    ? "text-[#0a8ccd]"
                    : "text-indigo-400"
              }`}
            >
              Sou Matome N3
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">
              {currentWeek?.week_title || "N3 Study"} • Day {selectedDay}
            </p>
          </header>
          <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />

          <WeekMenu
            selectedWeek={selectedWeek}
            totalWeeks={weeks.length}
            theme={theme}
            onSelectWeek={(week) => handleWeekChange(week)}
          />
          <DayMenu
            selectedDay={selectedDay}
            onSelectDay={(day) => dispatch(setDay(day))}
            theme={theme}
            onStartQuiz={() => setIsQuizActive(true)}
          />

          {/* Main Flashcard Display */}
          <main className="w-full max-w-sm aspect-[3/4] min-h-[450px]">
            {currentKanji ? (
              <KanjiCard
                data={currentKanji}
                isFlipped={isFlipped}
                theme={theme}
                onFlip={() => dispatch(toggleFlip())}
                onSpeak={(text) => handleSpeak(text)}
              />
            ) : (
              <div className="text-slate-500">No data found for this day.</div>
            )}
          </main>

          {/* Pagination Controls */}
          <footer className="mt-2 w-full max-w-sm flex items-center justify-between">
            <Button
              onClick={() => dispatch(previousCard())}
              disabled={isFirstCard}
              className={`p-4 rounded-2xl shadow-lg border transition-all active:scale-90 ${
                isFirstCard ? "opacity-30 cursor-not-allowed" : "opacity-100"
              } ${
                theme === "sakura"
                  ? "bg-white text-[#eb22b1] border-rose-100 hover:bg-rose-50 shadow-rose-200/50"
                  : theme === "fuji"
                    ? "bg-white text-[#0a8ccd] border-sky-100 hover:bg-sky-50 shadow-sky-200/50"
                    : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700 shadow-black/20"
              }`}
            >
              <ArrowLeft
                size={24}
                strokeWidth={3}
                color={`${theme === "sakura" || theme === "fuji" ? "black" : "white"}`}
              />
            </Button>
            <span
              className={`font-mono text-lg font-black ${theme === "dark" ? "text-indigo-400" : "text-slate-800"}`}
            >
              {currentIndex + 1} / {kanjiList.length}
            </span>
            <Button
              onClick={() => dispatch(nextCard())}
              disabled={isLastCard}
              className={`p-4 rounded-2xl shadow-lg border transition-all active:scale-90 ${
                isLastCard ? "opacity-30 cursor-not-allowed" : "opacity-100"
              } ${
                theme === "sakura"
                  ? "bg-white text-[#eb22b1] border-rose-100 hover:bg-rose-50 shadow-rose-200/50"
                  : theme === "fuji"
                    ? "bg-white text-[#0a8ccd] border-sky-100 hover:bg-sky-50 shadow-sky-200/50"
                    : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700 shadow-black/20"
              }`}
            >
              <ArrowRight
                size={24}
                strokeWidth={3}
                color={`${theme === "sakura" || theme === "fuji" ? "black" : "white"}`}
              />
            </Button>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
