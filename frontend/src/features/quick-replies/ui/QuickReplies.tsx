import { Button } from "@heroui/react";

export const QuickReplies = () => {
  return (
    <div className="flex gap-2 mt-3 justify-center">
      <Button 
        variant="tertiary" 
        size="sm"
        className="bg-surface-container-high border border-outline-variant/20 text-on-surface-variant hover:text-on-surface rounded-full px-4 h-9"
      >
        <span className="material-symbols-outlined text-[18px] mr-2" aria-hidden="true">translate</span>
        Translate
      </Button>
      <Button 
        variant="tertiary" 
        size="sm"
        className="bg-surface-container-high border border-outline-variant/20 text-on-surface-variant hover:text-on-surface rounded-full px-4 h-9"
      >
        <span className="material-symbols-outlined text-[18px] mr-2" aria-hidden="true">spellcheck</span>
        Check Grammar
      </Button>
    </div>
  );
};
