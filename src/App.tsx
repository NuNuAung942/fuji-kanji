import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LevelSelection from "./page/LevelSelection";
import KanjiStudyView from "./page/KanjiStudyView";
import QuizViewScreen from "./page/QuizViewScreen";

function App() {
  return (
    <div
      className={`min-h-screen text-white flex flex-col items-center p-6 transition-colors duration-500 bg-slate-900 text-white`}
    >
      <Router>
        <div
          className={`min-h-screen transition-colors duration-500 bg-slate-900 text-white`}
        >
          <Routes>
            <Route path="/" element={<LevelSelection />} />
            <Route path="/:level" element={<KanjiStudyView />} />
            <Route path="/:level/:week/quiz" element={<QuizViewScreen />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
