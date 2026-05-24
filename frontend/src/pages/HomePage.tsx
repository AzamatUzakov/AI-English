import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@shared/api";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLesson = async () => {
    try {
      const lesson = await api.createLesson(); // no topic, defaults to null
      // after creation, go to lesson page
      navigate(`/lesson/${lesson.id}`);
    } catch (e) {
      console.error(e);
      alert("Не удалось создать новый урок. Попробуйте позже.");
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-surface-container-low">
      {/* Header with actions */}
      <header className="flex justify-between items-center mb-4">
        <button
          onClick={handleStartLesson}
          className="btn-primary px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Начать урок
        </button>
        <span className="text-lg font-medium">День&nbsp;2</span>
      </header>

      {/* Empty chat placeholder */}
      <section className="flex-1 border border-outline-variant rounded-md p-4 overflow-y-auto">
        <p className="text-gray-500 text-center mt-12">
          Чат пока пуст. После запуска урока появятся сообщения от ИИ.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
