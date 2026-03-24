import React from "react";

interface WeekMenuProps {
  selectedWeek: number;
  totalWeeks: number;
  onSelectWeek: (week: number) => void;
  theme: "dark" | "sakura" | "fuji";
}

const WeekMenu: React.FC<WeekMenuProps> = ({
  selectedWeek,
  totalWeeks,
  onSelectWeek,
  theme,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto pb-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
          const isActive = selectedWeek === week;

          return (
            <button
              key={week}
              onClick={() => onSelectWeek(week)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0 active:scale-95 ${
                isActive
                  ? theme === "sakura"
                    ? "bg-[#eb22b1] text-white shadow-lg shadow-[#eb22b1]/40 scale-105"
                    : theme === "fuji"
                      ? "bg-[#0a8ccd] text-white shadow-lg shadow-[#0a8ccd]/40 scale-105"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105"
                  : theme === "dark"
                    ? "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
                    : "bg-white/50 text-slate-400 hover:bg-white/80 hover:text-slate-600"
              }`}
            >
              WEEK {week}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekMenu;
