import { useState, useEffect, useMemo } from 'react';
import { Button, Card } from "@heroui/react";
import { api, type DiaryRule } from "@/shared/api";

interface DiaryPanelProps {
  isOpen: boolean;
  width: number;
  onClose: () => void;
  onToggleOverlay?: () => void;
  isOverlay?: boolean;
  refreshTrigger?: number;
}

export const DiaryPanel = ({ isOpen, width, onClose, onToggleOverlay, isOverlay, refreshTrigger }: DiaryPanelProps) => {
  const [rules, setRules] = useState<DiaryRule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch rules from API
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    api.getDiaryRules()
      .then(data => {
        setRules(data);
      })
      .catch(err => {
        console.error("Failed to load diary rules", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, refreshTrigger]);

  // Handle rule deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это правило?')) return;
    try {
      await api.deleteDiaryRule(id);
      setRules(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
      alert('Ошибка при удалении правила.');
    }
  };

  // Get unique list of topics
  const topics = useMemo(() => {
    const list = rules.map(r => r.topic).filter((t): t is string => !!t);
    return Array.from(new Set(list));
  }, [rules]);

  // Filter rules based on search and selected topic
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.topic && r.topic.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTopic = !selectedTopic || r.topic === selectedTopic;
      return matchesSearch && matchesTopic;
    });
  }, [rules, searchQuery, selectedTopic]);

  if (!isOpen) return null;

  return (
    <div 
      className="h-full w-full p-6 flex flex-col overflow-y-auto relative bg-inherit"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-on-surface">Дневник</h2>
          {onToggleOverlay && (
            <Button 
              isIconOnly 
              variant="tertiary" 
              size="sm"
              onPress={onToggleOverlay}
              className={`text-on-surface-variant hover:text-primary transition-colors ${isOverlay ? 'text-primary' : ''}`}
              title={isOverlay ? "Unpin from Sidebar" : "Cover Sidebar"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isOverlay ? 'side_navigation' : 'dock_to_left'}
              </span>
            </Button>
          )}
        </div>
        <Button 
          isIconOnly 
          variant="tertiary" 
          onPress={onClose} 
          className="text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4 shrink-0">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">
          search
        </span>
        <input 
          type="text"
          placeholder="Поиск правил..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface text-on-surface border border-outline-variant/30 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-primary transition"
        />
      </div>

      {/* Topic Filter Pills */}
      {topics.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              !selectedTopic 
                ? 'bg-primary border-primary text-white' 
                : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
            }`}
          >
            Все
          </button>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedTopic === t 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      
      {/* Rules List Container */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="text-center py-8 text-on-surface-variant">Загрузка правил...</div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant italic">
            {rules.length === 0 ? 'Ваш дневник пуст. Сохраняйте правила из чата с ИИ!' : 'Ничего не найдено'}
          </div>
        ) : (
          filteredRules.map(rule => (
            <Card key={rule.id} className="bg-surface p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-2 relative group shrink-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  {rule.topic && (
                    <span className="text-[9px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded self-start">
                      {rule.topic}
                    </span>
                  )}
                  <h3 className="font-bold text-on-surface text-sm">{rule.title}</h3>
                </div>
                <Button 
                  isIconOnly 
                  variant="tertiary" 
                  size="sm"
                  onPress={() => handleDelete(rule.id)}
                  className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить правило"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </Button>
              </div>

              {/* Dynamic rule card table content */}
              {rule.content && rule.content.headers && rule.content.rows && (
                <div className="border border-outline-variant/30 rounded-lg overflow-x-auto mt-2">
                  <table className="w-full text-left border-collapse min-w-[200px]">
                    <thead>
                      <tr className="bg-surface-variant/40 border-b border-outline-variant/30">
                        {rule.content.headers.map((hdr: string, idx: number) => (
                          <th key={idx} className="px-3 py-1.5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">
                            {hdr}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {rule.content.rows.map((row: string[], rowIdx: number) => (
                        <tr key={rowIdx}>
                          {row.map((cell: string, cellIdx: number) => (
                            <td key={cellIdx} className="px-3 py-1.5 text-xs text-on-surface">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
