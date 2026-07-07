import { useState } from "react";
import QuizView from "../components/features/QuizView";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

const QuizViewScreen = () => {
  const navigate = useNavigate();
  const [theme] = useState<"dark" | "sakura" | "fuji">("dark");
  const { weeks, selectedWeek, currentLevel } = useAppSelector(
    (state) => state.kanji,
  );
  const [, setIsQuizActive] = useState(false);
  const currentWeekData = weeks.find((w) => w.week === selectedWeek);

  //quiz
  const startWeekQuiz = () => {
    const allWeekKanji =
      currentWeekData?.days.flatMap((d) => d.kanji_list) || [];
    const shuffledQuiz = [...allWeekKanji].sort(() => Math.random() - 0.5);
    const limitedQuiz = shuffledQuiz.slice(0, 30);

    return limitedQuiz;
  };

  const onCloseQuiz = () => {
    setIsQuizActive(false);
    navigate(`/n${currentLevel || 3}`, {
      state: { level: currentLevel || 3 },
    });
  };

  return (
    <div className="flex flex-col min-w-[350px] items-center justify-center min-h-screen p-6">
      <QuizView
        kanjiList={startWeekQuiz()}
        week={selectedWeek}
        theme={theme}
        onClose={onCloseQuiz}
      />
    </div>
  );
};

export default QuizViewScreen;
