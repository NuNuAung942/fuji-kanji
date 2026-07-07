import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import {
  nextCard,
  toggleFlip,
  setDay,
  setWeek,
  addWeekData,
  previousCard,
  setLevelData,
} from "../features/kanji/kanjiSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ThemeSwitcher from "../components/ui/ThemeSwitcher";
import WeekMenu from "../components/features/WeekMenu";
import DayMenu from "../components/features/DayMenu";
import KanjiCard from "../components/features/KanjiCard";
import { useNavigate, useParams } from "react-router-dom";

const KanjiStudyView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [, setIsQuizActive] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const { level } = useParams();
  const [theme, setTheme] = useState<"dark" | "sakura" | "fuji">("dark");
  const { weeks, selectedWeek, selectedDay, currentIndex, isFlipped } =
    useAppSelector((state) => state.kanji);
  const currentWeek = weeks.find((w) => w.week === selectedWeek);
  const currentWeekData = weeks.find((w) => w.week === selectedWeek);
  const currentDayData = currentWeekData?.days.find(
    (d) => d.day === selectedDay,
  );
  const kanjiList = currentDayData?.kanji_list || [];
  const currentKanji = kanjiList[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === kanjiList.length - 1;

  const getTotalWeeksByLevel = (level: number) => {
    switch (level) {
      case 3:
        return 6;
      case 4:
        return 3;
      case 5:
        return 4;
      default:
        return 6;
    }
  };

  useEffect(() => {
    const normalizedLevel = level ? parseInt(level.replace(/^n/i, ""), 10) : 5;
    setSelectedLevel(normalizedLevel);
  }, [level]);

  useEffect(() => {
    const loadWeek = async () => {
      const week = selectedWeek;

      const isLoaded = weeks.some((w) => w.week === week);

      if (!isLoaded) {
        const data = await import(`../data/n${selectedLevel}_week${week}.json`);

        dispatch(addWeekData(data.default || data));
      }
    };

    loadWeek();
  }, [selectedLevel, selectedWeek]);

  useEffect(() => {
    const loadInitialWeek = async () => {
      try {
        const module = await import(`../data/n${selectedLevel}_week1.json`);

        dispatch(
          setLevelData({
            selectedLevel,
            weeks: [module.default],
          }),
        );
      } catch (error) {
        console.error("Failed to load week data:", error);
      }
    };

    loadInitialWeek();
  }, [selectedLevel, dispatch]);

  const handleWeekChange = (week: number) => {
    dispatch(setWeek(week));
  };

  const handleSpeak = (text: string) => {
    const synth = window.speechSynthesis;
    synth.resume();
    synth.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "ja-JP";
    msg.rate = 0.7;
    const voices = synth.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith("ja"));
    if (jpVoice) msg.voice = jpVoice;

    synth.speak(msg);
  };

  const handleBackToLevel = () => {
    navigate("/");
  };

  return (
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
          {selectedLevel == 3
            ? "So-Matome N3"
            : selectedLevel == 4
              ? "Nihongo Challenge N4"
              : "Nihongo Challenge N5"}
        </h1>
        {selectedLevel == 3 ? (
          <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">
            {currentWeek?.week_title || "N3 Study"} • Day {selectedDay}
          </p>
        ) : (
          ""
        )}
      </header>
      <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
      <p
        className="flex justify-left items-center w-full mb-6"
        onClick={handleBackToLevel}
      >
        <span className="cursor-pointer flex items-center">
          <ArrowLeft
            size={18}
            strokeWidth={2}
            color={`${theme === "sakura" || theme === "fuji" ? "black" : "white"}`}
          />
          Back to Level
        </span>
      </p>
      <WeekMenu
        selectedWeek={selectedWeek}
        totalWeeks={getTotalWeeksByLevel(selectedLevel)}
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
  );
};

export default KanjiStudyView;
