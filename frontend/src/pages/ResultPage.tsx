import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@shared/api";
import type { Lesson } from "@shared/api";

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getLessonById(id)
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lesson", err);
        setLoading(false);
      });
  }, [id]);

  const handleStartNext = async () => {
    if (!lesson?.nextRec) return;
    try {
      const next = await api.createLesson(lesson.nextRec);
      navigate(`/lesson/${next.id}`);
    } catch (e) {
      console.error(e);
      alert("Не удалось создать следующий урок.");
    }
  };

  if (loading) {
    return <div className="p-6">Загрузка результата…</div>;
  }

  if (!lesson) {
    return <div className="p-6 text-red-500">Урок не найден.</div>;
  }

  return (
    <div className="p-6 bg-surface-container-low min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Итоги урока</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Оценка</h2>
          <p>{lesson.score !== null ? lesson.score : "—"}</p>
        </div>
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Сильные стороны</h2>
          <p>{lesson.strong ?? "—"}</p>
        </div>
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Слабые стороны</h2>
          <p>{lesson.weak ?? "—"}</p>
        </div>
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Саммари</h2>
          <p>{lesson.summary ?? "—"}</p>
        </div>
        <div className="p-4 border rounded bg-surface-container col-span-full">
          <h2 className="text-lg font-medium mb-2">Следующая тема</h2>
          <p>{lesson.nextRec ?? "—"}</p>
          {lesson.nextRec && (
            <button
              onClick={handleStartNext}
              className="mt-2 btn-primary px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Начать следующий урок
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
