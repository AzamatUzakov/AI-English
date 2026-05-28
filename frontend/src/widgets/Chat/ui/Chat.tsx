import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollShadow, Button } from "@heroui/react";
import { Message } from "@entities/message/ui/Message";
import { ChatInput } from "@features/chat-input/ui/ChatInput";
import { api, type LessonMessage } from "@shared/api";

interface ChatProps {
  lessonId: string;
  onRuleSaved?: () => void;
}

export const Chat = ({ lessonId, onRuleSaved }: ChatProps) => {
  const navigate = useNavigate();
  // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [messages, setMessages] = useState<LessonMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    api.getLessonMessages(lessonId)
      .then(data => {
        setMessages(data);
        setIsLoading(false);
        scrollToBottom();
      })
      .catch(err => {
        console.error("Failed to load messages", err);
        setIsLoading(false);
      });
  }, [lessonId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (timeLeft <= 0 || isFinishing) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinishing]);

  const handleSendMessage = async (text: string) => {
    if (isTyping || isFinishing) return;
    
    // Optimistically add user message
    const tempId = Date.now().toString();
    const userMsg: LessonMessage = {
      id: tempId,
      lessonId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      await api.sendMessage(lessonId, 'user', text);
      // Refresh messages to get the AI response
      const updatedMessages = await api.getLessonMessages(lessonId);
      setMessages(updatedMessages);
    } catch (e) {
      console.error(e);
      alert("Ошибка отправки сообщения");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinishLesson = async () => {
    setIsFinishing(true);
    try {
      await api.generateLessonSummary(lessonId);
      navigate(`/lesson/${lessonId}/result`);
    } catch (e) {
      console.error(e);
      alert("Не удалось завершить урок.");
      setIsFinishing(false);
    }
  };

  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const isTimeUp = timeLeft <= 0;

  return (
    <div className="flex flex-col h-full bg-surface-container-low overflow-hidden relative">
      {/* TopAppBar */}
      <header className="h-16 flex justify-between items-center px-gutter w-full bg-surface border-b border-outline-variant z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="tertiary" className="md:hidden text-on-surface-variant">
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </Button>
          <h1 className="text-xl font-bold text-on-surface">Advanced Business English</h1>
        </div>
        <div className="flex items-center gap-4">
          {isTimeUp && !isFinishing && (
            <span className="text-sm font-bold text-error animate-pulse">Время вышло!</span>
          )}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isTimeUp ? 'bg-error/20 border-error/50 text-error' : 'bg-surface-variant/50 border-outline-variant text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">timer</span>
            <span className="font-mono text-sm font-bold">{timeString}</span>
          </div>
          <Button 
            color="primary" 
            variant="solid" 
            size="sm"
            isLoading={isFinishing}
            onPress={handleFinishLesson}
            className="font-bold bg-primary text-white"
          >
            Завершить урок
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Chat Canvas */}
        <ScrollShadow 
          size={40}
          ref={scrollRef}
          className="flex-1 w-full max-w-[900px] mx-auto px-gutter pt-stack-lg pb-56 flex flex-col gap-8 overflow-y-auto scroll-smooth"
        >
          {isLoading ? (
            <div className="flex justify-center py-10 text-on-surface-variant">Загрузка чата...</div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center py-10 text-on-surface-variant">Нет сообщений. Поздоровайтесь с ИИ!</div>
          ) : (
            messages.map((msg) => (
              <Message 
                key={msg.id}
                type={msg.role === 'assistant' ? 'ai' : 'user'} 
                content={msg.content} 
                lessonId={lessonId}
                onRuleSaved={onRuleSaved}
              />
            ))
          )}
          
          {isTyping && (
             <Message 
               type="ai" 
               content="Печатает..." 
             />
          )}
        </ScrollShadow>

        {/* Floating Input Overlay - Fixed to bottom of this container */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          {/* Gradient backdrop for input */}
          <div className="h-40 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent"></div>
          
          <div className="max-w-[800px] mx-auto px-gutter pb-8 pointer-events-auto">
            <div className="flex flex-col items-center">
              {isFinishing ? (
                <div className="h-16 w-full bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant shadow-lg">
                  <span className="text-on-surface-variant font-medium animate-pulse">Урок завершается. ИИ анализирует результаты...</span>
                </div>
              ) : (
                <ChatInput 
                  onSend={handleSendMessage} 
                  disabled={isTyping || isLoading || isFinishing} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
