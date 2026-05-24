import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LessonStartPage } from "@pages/LessonStartPage";
import { LessonPage } from "@pages/LessonPage/ui/LessonPage";
import { ResultPage } from "@pages/ResultPage";
import { DiaryPage } from "@pages/DiaryPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LessonStartPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/lesson/:id/result" element={<ResultPage />} />
        <Route path="/diary" element={<DiaryPage />} />
      </Routes>
    </BrowserRouter>
  );
};
