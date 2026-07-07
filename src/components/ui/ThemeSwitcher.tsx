import { motion } from "framer-motion";

interface ThemeSwitcherProps {
  currentTheme: "dark" | "sakura" | "fuji";
  setTheme: (theme: "dark" | "sakura" | "fuji") => void;
}

const themes = [
  { id: "dark", color: "bg-slate-800", label: "Midnight", icon: "🌙" },
  { id: "sakura", color: "bg-rose-200", label: "Sakura", icon: "🌸" },
  { id: "fuji", color: "bg-sky-200", label: "Fuji", icon: "🗻" },
] as const;

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  setTheme,
}) => {
  return (
    <div
      className={`flex p-1 gap-1 rounded-full border border-white/10 shadow-xl mb-2 backdrop-blur-md ${
        currentTheme === "sakura"
          ? "border-rose-200 bg-[radial-gradient(#eb22b1,_transparent)]"
          : currentTheme === "fuji"
            ? "border-sky-200 bg-[radial-gradient(#0a8ccd,_transparent)]"
            : "bg-[radial-gradient(#435297,_transparent)]"
      }`}
    >
      {themes.map((theme) => {
        const isActive = currentTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90"
            title={theme.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeThemeCircle"
                className={`absolute inset-0 rounded-full shadow-sm ${
                  currentTheme === "sakura"
                    ? "bg-white shadow-rose-200"
                    : currentTheme === "fuji"
                      ? "bg-white shadow-sky-200"
                      : "bg-white/10 border border-white/20"
                }`}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              />
            )}
            <span
              className={`text-base z-10 transition-opacity ${isActive ? "opacity-100" : "opacity-40"}`}
            >
              {theme.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
