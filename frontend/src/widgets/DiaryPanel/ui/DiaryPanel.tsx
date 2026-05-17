import { Button, Card } from "@heroui/react";

interface DiaryPanelProps {
  isOpen: boolean;
  width: number;
  onClose: () => void;
  onToggleOverlay?: () => void;
  isOverlay?: boolean;
}

export const DiaryPanel = ({ isOpen, width, onClose, onToggleOverlay, isOverlay }: DiaryPanelProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="h-full w-full p-6 flex flex-col overflow-y-auto relative bg-inherit"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-on-surface">My Diary</h2>
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
      
      <div className="flex flex-col gap-4">
        <Card className="bg-surface p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
            <h3 className="font-bold text-on-surface text-base">Rule of Reciprocity</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            In negotiations, people generally feel obliged to return favors or concessions.
          </p>
          <div className="border border-outline-variant/50 rounded-lg overflow-hidden mt-2">
            <div className="grid grid-cols-2 bg-surface-variant border-b border-outline-variant/50 p-2 font-bold text-xs text-on-surface uppercase">
              <div>Term</div>
              <div>Meaning</div>
            </div>
            <div className="grid grid-cols-2 border-b border-outline-variant/50 p-2 text-sm text-on-surface-variant">
              <div>Concession</div>
              <div>Something given up or yielded.</div>
            </div>
            <div className="grid grid-cols-2 p-2 text-sm text-on-surface-variant">
              <div>Mutual Benefit</div>
              <div>An outcome good for both sides.</div>
            </div>
          </div>
        </Card>

        {/* Placeholder for more notes */}
        <div className="mt-8 border-t border-outline-variant/30 pt-4">
          <p className="text-xs text-on-surface-variant italic text-center">Your negotiation notes will appear here</p>
        </div>
      </div>
    </div>
  );
};
