import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LevelSelection = () => {
  const levels = [5, 4, 3];
  const navigate = useNavigate();

  const handleLevelSelect = async (level: number) => {
    try {
      navigate(`/${level}`, { state: { level: level } });
    } catch (error) {
      console.error("Could not load initial level data", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-sm animate-in fade-in zoom-in duration-500">
      <header className="mb-12 text-center">
        <h1
          className={`text-4xl font-black tracking-tighter uppercase mb-2 text-indigo-400`}
        >
          Select Level
        </h1>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
          Japanese Kanji Learning
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 w-full">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => handleLevelSelect(lvl)}
            className={`group relative overflow-hidden p-8 rounded-3xl border-2 transition-all active:scale-95 shadow-xl flex items-center justify-between
              bg-slate-800 border-slate-700 text-white hover:border-indigo-500 shadow-black/40
              `}
          >
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold opacity-60 uppercase tracking-widest">
                {lvl === 3
                  ? "So-Matome"
                  : lvl === 4
                    ? "Nihongo Challenge"
                    : "Nihongo Challenge"}{" "}
              </span>
              <span className="text-4xl font-black italic">N{lvl}</span>
            </div>
            <ArrowRight
              className={`transition-transform group-hover:translate-x-1
                text-indigo-400`}
              size={32}
              strokeWidth={3}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;
