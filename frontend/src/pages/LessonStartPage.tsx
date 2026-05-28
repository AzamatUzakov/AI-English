import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Lesson } from "@shared/api";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { DiaryPanel } from "@/widgets/DiaryPanel/ui/DiaryPanel";

export const LessonStartPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryVersion, setDiaryVersion] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [diaryWidth, setDiaryWidth] = useState(400);
  const [isDiaryOverlay, setIsDiaryOverlay] = useState(false);

  // Dashboard state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const resizingType = useRef<'sidebar' | 'diary-right' | 'diary-left' | null>(null);
  
  const handleRuleSaved = useCallback(() => {
    setDiaryVersion(prev => prev + 1);
  }, []);

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

  // Load lessons for the dashboard view
  useEffect(() => {
    setIsLoading(true);
    api.getLessons()
      .then(data => {
        setLessons(data);
        const scores = data.map(l => l.score).filter((s): s is number => typeof s === "number");
        setAverageScore(scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null);
        
        const dates = data
          .map(l => l.date ? new Date(l.date) : null)
          .filter((d): d is Date => d !== null && !isNaN(d.getTime()))
          .sort((a, b) => b.getTime() - a.getTime());
          
        let cnt = 0;
        let cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        for (const day of dates) {
          day.setHours(0, 0, 0, 0);
          if (day.getTime() === cursor.getTime()) {
            cnt++;
            cursor.setDate(cursor.getDate() - 1);
          } else if (day.getTime() < cursor.getTime()) {
            break;
          }
        }
        setStreak(cnt);
      })
      .catch(err => console.error("Failed to load lessons", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStartLesson = async () => {
    try {
      const lesson = await api.createLesson();
      navigate(`/lesson/${lesson.id}`);
    } catch (e) {
      console.error(e);
      alert('Не удалось создать урок. Попробуйте позже.');
    }
  };

  const goToLesson = (id: string) => {
    navigate(`/lesson/${id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-on-surface overflow-hidden relative">
      <header className="flex justify-between items-center p-4 border-b border-outline-variant">
        <button
          onClick={handleStartLesson}
          className="btn-primary px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Начать урок
        </button>
        <span className="text-lg font-medium">День {streak + 1}</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
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

        <div className="flex-1 flex overflow-hidden relative">
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
                refreshTrigger={diaryVersion}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-1 bg-outline-variant/30 hover:bg-primary cursor-col-resize z-30 transition-colors"
                onMouseDown={startResizing('diary-right')}
              ></div>
            </div>
          )}

          {/* Dashboard Main Area */}
          <div className="flex-1 h-full min-w-[300px] overflow-y-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Добро пожаловать в AI Tutor!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="p-6 border border-outline-variant rounded-2xl bg-surface-container">
                <h2 className="text-lg text-on-surface-variant font-medium mb-2">Средний балл</h2>
                <p className="text-4xl font-bold text-primary">{averageScore !== null ? averageScore.toFixed(1) : "—"}</p>
              </div>
              <div className="p-6 border border-outline-variant rounded-2xl bg-surface-container">
                <h2 className="text-lg text-on-surface-variant font-medium mb-2">Серия дней (Streak)</h2>
                <p className="text-4xl font-bold text-primary">{streak} 🎯</p>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-semibold">Ваши уроки</h2>
            </div>
            
            {isLoading ? (
              <p className="text-on-surface-variant">Загрузка уроков...</p>
            ) : lessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-outline-variant rounded-2xl">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">forum</span>
                <p className="text-on-surface-variant text-lg">Чат пока пуст. Нажмите кнопку «Начать урок», чтобы начать.</p>
                <button
                  onClick={handleStartLesson}
                  className="mt-6 btn-primary px-6 py-3 rounded-xl hover:bg-primary/90 transition text-lg font-medium"
                >
                  Начать первый урок
                </button>
              </div>
            ) : (
              <div className="border border-outline-variant rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-on-surface-variant">Тема</th>
                      <th className="px-6 py-4 font-semibold text-on-surface-variant">Дата</th>
                      <th className="px-6 py-4 font-semibold text-on-surface-variant">Статус</th>
                      <th className="px-6 py-4 font-semibold text-on-surface-variant text-right">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {lessons.map(l => (
                      <tr key={l.id} className="hover:bg-surface-variant/20 transition-colors">
                        <td className="px-6 py-4 font-medium">{l.topic ?? "Новый урок"}</td>
                        <td className="px-6 py-4 text-on-surface-variant">
                          {l.date && !isNaN(new Date(l.date).getTime()) 
                            ? new Date(l.date).toLocaleDateString() 
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            l.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => goToLesson(l.id)}
                            className="text-primary hover:underline font-medium"
                          >
                            Перейти
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

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
