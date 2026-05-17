import { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { DiaryPanel } from "@/widgets/DiaryPanel/ui/DiaryPanel";

export const LessonPage = () => {
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [diaryWidth, setDiaryWidth] = useState(400);
  const [isDiaryOverlay, setIsDiaryOverlay] = useState(false);
  
  const resizingType = useRef<'sidebar' | 'diary-right' | 'diary-left' | null>(null);

  const startResizing = useCallback((type: 'sidebar' | 'diary-right' | 'diary-left') => (e: React.MouseEvent) => {
    e.preventDefault();
    resizingType.current = type;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    resizingType.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!resizingType.current) return;

    if (resizingType.current === 'sidebar' || resizingType.current === 'diary-left') {
      const newWidth = e.clientX;
      if (newWidth > 0 && newWidth < 600) {
        setSidebarWidth(newWidth);
        // If sidebar becomes too small, we can consider it "closed" or "hidden"
      }
    } else if (resizingType.current === 'diary-right') {
      const newWidth = e.clientX - sidebarWidth;
      if (newWidth > 200 && newWidth < 1000) {
        setDiaryWidth(newWidth);
      }
    }
  }, [sidebarWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="h-screen flex w-full bg-background text-on-surface overflow-hidden relative">
      {/* Sidebar - Resizable / Hiddeable */}
      <div 
        className={`flex shrink-0 h-full relative transition-[width] duration-300 ${sidebarWidth < 50 ? 'z-0' : 'z-20'}`} 
        style={{ width: sidebarWidth < 50 ? 0 : sidebarWidth }}
      >
        <Sidebar 
          onDiaryClick={() => setIsDiaryOpen(!isDiaryOpen)} 
        />
        {/* Sidebar Right Handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 bg-outline-variant/30 hover:bg-primary cursor-col-resize z-30 transition-colors"
          onMouseDown={startResizing('sidebar')}
        ></div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Diary Panel - Resizable from both sides */}
        {isDiaryOpen && (
          <div 
            className={`flex shrink-0 h-full relative bg-surface-container-high border-r border-outline-variant z-20`} 
            style={{ 
              width: diaryWidth,
              marginLeft: isDiaryOverlay ? -sidebarWidth : 0,
              transition: 'margin-left 0.3s ease'
            }}
          >
            {/* Left Handle (to expand over sidebar) */}
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

            {/* Right Handle */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-1 bg-outline-variant/30 hover:bg-primary cursor-col-resize z-30 transition-colors"
              onMouseDown={startResizing('diary-right')}
            ></div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 h-full min-w-[300px] overflow-hidden">
          <Chat />
        </div>
      </div>

      {/* Restore Sidebar Button (if hidden) */}
      {sidebarWidth < 50 && (
        <button 
          onClick={() => setSidebarWidth(260)}
          className="absolute left-4 bottom-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg z-50 hover:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      )}
    </div>
  );
};
