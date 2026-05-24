import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@shared/api";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { DiaryPanel } from "@/widgets/DiaryPanel/ui/DiaryPanel";

export const LessonStartPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [diaryWidth, setDiaryWidth] = useState(400);
  const [isDiaryOverlay, setIsDiaryOverlay] = useState(false);

  const resizingType = useRef<'sidebar' | 'diary-right' | 'diary-left' | null>(null);

  const startResizing = useCallback(
    (type: 'sidebar' | 'diary-right' | 'diary-left') => (e: React.MouseEvent) => {
      e.preventDefault();
      resizingType.current = type;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    []
  );

  const stopResizing = useCallback(() => {
    resizingType.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!resizingType.current) return;
      if (resizingType.current === 'sidebar' || resizingType.current === 'diary-left') {
        const newWidth = e.clientX;
        if (newWidth > 0 && newWidth < 600) setSidebarWidth(newWidth);
      } else if (resizingType.current === "diary-right") {
        const newWidth = e.clientX - sidebarWidth;
        if (newWidth > 200 && newWidth < 1000) setDiaryWidth(newWidth);
      }
    },
    [sidebarWidth]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleStartLesson = async () => {
    try {
      const lesson = await api.createLesson();
      navigate(`/lesson/${lesson.id}`);
    } catch (e) {
      console.error(e);
      alert('Не удалось создать урок. Попробуйте позже.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-on-surface overflow-hidden relative">
      {/* Header with Start Lesson button and Day label */}
      <header className="flex justify-between items-center p-4 border-b border-outline-variant">
        <button
          onClick={handleStartLesson}
          className="btn-primary px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Начать урок
        </button>
        <span className="text-lg font-medium">День 2</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex shrink-0 h-full relative transition-[width] duration-300 ${sidebarWidth < 50 ? 'z-0' : 'z-20'}`}
          style={{ width: sidebarWidth < 50 ? 0 : sidebarWidth }}
        >
          <Sidebar onDiaryClick={() => setIsDiaryOpen(!isDiaryOpen)} />
          <div
            className="absolute right-0 top-0 bottom-0 w-1 bg-outline-variant/30 hover:bg-primary cursor-col-resize z-30 transition-colors"
            onMouseDown={startResizing('sidebar')}
          ></div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Diary Panel */}
          {isDiaryOpen && (
            <div
              className="flex shrink-0 h-full relative bg-surface-container-high border-r border-outline-variant z-20"
              style={{
                width: diaryWidth,
                marginLeft: isDiaryOverlay ? -sidebarWidth : 0,
                transition: 'margin-left 0.3s ease',
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/0 hover:bg-primary/50 cursor-col-resize z-30 transition-colors"
                onMouseDown={startResizing('diary-left')}
              ></div>
              <DiaryPanel
                isOpen={isDiaryOpen}
                width={diaryWidth}
                onClose={() => setIsDiaryOpen(false)}
                onToggleOverlay={() => setIsDiaryOverlay(!isDiaryOverlay)}
                isOverlay={isDiaryOverlay}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-1 bg-outline-variant/30 hover:bg-primary cursor-col-resize z-30 transition-colors"
                onMouseDown={startResizing('diary-right')}
              ></div>
            </div>
          )}

          {/* Chat placeholder */}
          <div className="flex-1 h-full min-w-[300px] flex items-center justify-center p-6">
            <p className="text-gray-500">Чат пока пуст. Нажмите кнопку «Начать урок», чтобы начать.</p>
          </div>
        </div>

        {/* Restore Sidebar button */}
        {sidebarWidth < 50 && (
          <button
            onClick={() => setSidebarWidth(260)}
            className="absolute left-4 bottom-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg z-50 hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonStartPage;
