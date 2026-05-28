import React, { useState } from 'react';
import { Button, Card } from '@heroui/react';
import { api } from '@/shared/api';

interface MessageProps {
  type: 'ai' | 'user';
  content: string;
  specialContent?: React.ReactNode;
  lessonId?: string;
  onRuleSaved?: () => void;
}

interface RuleCardData {
  type: 'rule_card';
  topic: string;
  title: string;
  content: {
    headers: string[];
    rows: string[][];
  };
}

function parseRuleCard(text: string): { card: RuleCardData; cleanText: string } | null {
  try {
    const startIndex = text.indexOf('{');
    if (startIndex !== -1) {
      const endIndex = text.lastIndexOf('}');
      if (endIndex > startIndex) {
        const jsonStr = text.substring(startIndex, endIndex + 1);
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.type === 'rule_card') {
          const before = text.substring(0, startIndex).trim();
          const after = text.substring(endIndex + 1).trim();
          const cleanText = [before, after].filter(Boolean).join('\n\n');
          return { card: parsed, cleanText };
        }
      }
    }
  } catch (e) {
    // Fail silently
  }
  return null;
}

export const Message = ({ type, content, specialContent, lessonId, onRuleSaved }: MessageProps) => {
  const isAI = type === 'ai';
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Parse rule card if message is from AI
  const parsedData = isAI ? parseRuleCard(content) : null;
  const displayContent = parsedData ? parsedData.cleanText : content;

  const handleSave = async (card: RuleCardData) => {
    setIsSaving(true);
    try {
      await api.saveDiaryRule(
        lessonId || null,
        card.topic,
        card.title,
        card.content
      );
      setIsSaved(true);
      if (onRuleSaved) {
        onRuleSaved();
      }
    } catch (e) {
      console.error(e);
      alert('Не удалось сохранить правило в дневник.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex items-start gap-4 max-w-[85%] ${!isAI ? 'self-end flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
        isAI ? 'bg-surface-container-high border-outline-variant/30' : 'bg-primary border-primary/20'
      }`}>
        <span className={`material-symbols-outlined text-[20px] ${
          isAI ? 'text-on-surface-variant' : 'text-on-primary'
        }`}>
          {isAI ? 'smart_toy' : 'person'}
        </span>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {displayContent && (
          <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isAI 
              ? 'bg-surface-container-high text-on-surface rounded-tl-sm border border-outline-variant/20' 
              : 'bg-primary-container text-on-primary-container rounded-tr-sm border border-primary/20'
          }`}>
            {displayContent}
          </div>
        )}

        {/* Rule Card Rendering */}
        {parsedData && (
          <Card className="bg-surface p-5 border border-outline-variant/40 shadow-md flex flex-col gap-3 max-w-full">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded self-start">
                  {parsedData.card.topic}
                </span>
                <h3 className="font-bold text-on-surface text-base">{parsedData.card.title}</h3>
              </div>
              <Button
                size="sm"
                variant={isSaved ? "outline" : "solid"}
                color={isSaved ? "default" : "primary"}
                className={`font-semibold shrink-0 ${isSaved ? 'border-green-500/30 text-green-500 hover:bg-green-500/5' : 'bg-primary text-white hover:bg-primary/95'}`}
                isLoading={isSaving}
                isDisabled={isSaved}
                onPress={() => handleSave(parsedData.card)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    {isSaved ? 'check' : 'bookmark'}
                  </span>
                  <span>{isSaved ? 'Сохранено' : 'Сохранить в дневник'}</span>
                </div>
              </Button>
            </div>

            {/* Interactive Table */}
            <div className="border border-outline-variant/40 rounded-xl overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="bg-surface-variant/50 border-b border-outline-variant/40">
                    {parsedData.card.content.headers.map((hdr, idx) => (
                      <th key={idx} className="px-4 py-2.5 font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                        {hdr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {parsedData.card.content.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-surface-variant/20 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2.5 text-sm text-on-surface">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {specialContent}
      </div>
    </div>
  );
};
