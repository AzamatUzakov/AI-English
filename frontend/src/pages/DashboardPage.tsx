import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, Lesson } from "@shared/api";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);

  // Load lessons on mount
  useEffect(() => {
    api.getLessons()
      .then(data => {
        setLessons(data);
        // Calculate average score (ignore null scores)
        const scores = data.map(l => l.score).filter((s): s is number => typeof s === "number");
        setAverageScore(scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null);
        // Calculate streak – consecutive days with at least one lesson
        const dates = data
          .map(l => new Date(l.date))
          .sort((a, b) => b.getTime() - a.getTime()); // newest first
        let cnt = 0;
        let cursor = new Date();
        cursor.setHours(0, 0, 0, 0); // start of today
        for (const d of dates) {
          const day = new Date(d);
          day.setHours(0, 0, 0, 0);
          if (day.getTime() === cursor.getTime()) {
            cnt++;
            cursor.setDate(cursor.getDate() - 1);
          } else if (day.getTime() < cursor.getTime()) {
            // break on first missing day
            break;
          }
        }
        setStreak(cnt);
      })
      .catch(err => console.error("Failed to load lessons", err));
  }, []);

  const handleStartLesson = async () => {
    try {
      const lesson = await api.createLesson();
      navigate(`/lesson/${lesson.id}`);
    } catch (e) {
      console.error(e);
      alert("Не удалось создать урок. Попробуйте позже.");
    }
  };

  const goToLesson = (id: string) => {
    navigate(`/lesson/${id}`);
  };

  return (
    <div className="p-6 bg-surface-container-low min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleStartLesson}
          className="btn-primary px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Начать новый урок
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Средний балл</h2>
          <p>{averageScore !== null ? averageScore.toFixed(2) : "—"}</p>
        </div>
        <div className="p-4 border rounded bg-surface-container">
          <h2 className="text-lg font-medium mb-2">Серия дней (streak)</h2>
          <p>{streak}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Ваши уроки</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-500">Нет завершённых уроков.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Тема</th>
                <th className="text-left py-2">Дата</th>
                <th className="text-left py-2">Статус</th>
                <th className="text-left py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l.id} className="border-b">
                  <td className="py-2">{l.topic ?? "—"}</td>
                  <td className="py-2">{new Date(l.date).toLocaleDateString()}</td>
                  <td className="py-2">{l.status}</td>
                  <td className="py-2">
                    <button
                      onClick={() => goToLesson(l.id)}
                      className="text-primary underline"
                    >
                      Перейти
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Here you will see the list of past lessons and statistics.</p>
    </div>
  );
};

export default DashboardPage;
