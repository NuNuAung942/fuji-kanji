import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

interface DayMenuProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  theme: "dark" | "sakura" | "fuji";
  onStartQuiz: () => void;
}

const DayMenu: React.FC<DayMenuProps> = ({
  selectedDay,
  onSelectDay,
  theme,
  onStartQuiz,
}) => {
  const days = [1, 2, 3, 4, 5, 6];
  const navigate = useNavigate();
  const { selectedWeek, currentLevel } = useAppSelector((state) => state.kanji);

  const getContainerClass = () => {
    switch (theme) {
      case "sakura":
        return "bg-rose-100/40 border-[#eb22b1]/30 shadow-rose-200/20";
      case "fuji":
        return "bg-sky-100/50 border-sky-200";
      default:
        return "bg-slate-800/500 border-slate-700";
    }
  };

  const handleQuizClick = () => {
    onStartQuiz();
    navigate(`/n${currentLevel || 3}/week=${selectedWeek}/quiz`, {
      state: {
        level: currentLevel || 3,
        week: selectedWeek,
      },
    });
  };

  return (
    <div className="w-full max-w-sm mb-2">
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3 ml-2">
        Select Study Day
      </p>
      <div
        className={`flex justify-between p-1.5 rounded-2xl backdrop-blur-sm border border-slate-700 ${getContainerClass()}`}
      >
        {days.map((d) => {
          const isActive = selectedDay === d;

          return (
            <button
              key={d}
              onClick={() => onSelectDay(d)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isActive
                  ? theme === "sakura"
                    ? "bg-[#eb22b1] text-white shadow-lg shadow-[#eb22b1]/40"
                    : theme === "fuji"
                      ? "bg-[#0a8ccd] text-white shadow-lg shadow-[#0a8ccd]/40"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
                  : theme === "dark"
                    ? "text-slate-500 hover:text-white hover:bg-white/10"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
              }`}
            >
              D{d}
            </button>
          );
        })}
        <button
          onClick={handleQuizClick}
          className={`w-10 h-10 rounded-xl transition-all flex-shrink-0 flex items-center justify-center shadow-lg active:scale-90 ${
            theme === "sakura"
              ? "bg-[#eb22b1] text-white hover:bg-[#eb22b1]"
              : theme === "fuji"
                ? "bg-[#0a8ccd] text-white hover:bg-[#0a8ccd]"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
          title="Start Quiz"
        >
          Quiz
        </button>
      </div>
    </div>
  );
};

export default DayMenu;
