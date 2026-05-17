import { Button, Card, ProgressBar } from "@heroui/react";

interface SidebarProps {
  onDiaryClick: () => void;
  width?: number;
}

export const Sidebar = ({ onDiaryClick, width }: SidebarProps) => {
  return (
    <nav className="hidden md:flex flex-col h-full w-full p-6 bg-surface border-r border-outline-variant z-20 shrink-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 px-2 min-w-[200px]">
        <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <span className="material-symbols-outlined text-on-primary-container text-3xl" aria-hidden="true">school</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-bold text-on-surface tracking-tight">AI Tutor</span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">Academic</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
        <Button 
          variant="secondary"
          className="justify-start px-0 h-14 text-on-surface bg-surface-variant/50 border-l-4 border-primary rounded-r-xl overflow-hidden group"
        >
          <div className="flex items-center gap-4 px-4 w-full h-full transition-transform group-active:translate-x-1">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">dashboard</span>
            <span className="font-semibold text-base">Lessons</span>
          </div>
        </Button>
        <Button 
          variant="tertiary"
          className="justify-start px-0 h-14 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all rounded-xl group"
          onPress={onDiaryClick}
        >
          <div className="flex items-center gap-4 px-4 w-full h-full transition-transform group-active:translate-x-1">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">menu_book</span>
            <span className="font-semibold text-base">Diary</span>
          </div>
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="mt-auto mb-6 bg-surface-container-high p-5 border border-outline-variant/20 shadow-none rounded-2xl min-w-[200px]">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-on-surface-variant font-bold uppercase tracking-wider">Level</span>
            <span className="text-[12px] text-primary font-black px-2 py-0.5 bg-primary/10 rounded-md">INTERMEDIATE</span>
          </div>
          
          <div className="flex flex-col gap-3">
             <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
               <span>Daily Progress</span>
               <span className="text-on-surface font-bold">65%</span>
             </div>
             <ProgressBar value={65} className="w-full">
               <ProgressBar.Track className="h-2 bg-background rounded-full overflow-hidden">
                 <ProgressBar.Fill className="bg-primary h-full rounded-full transition-all duration-1000" />
               </ProgressBar.Track>
             </ProgressBar>
          </div>

          <Button 
            size="md" 
            variant="outline" 
            className="w-full h-11 border-outline-variant/50 text-on-surface hover:bg-surface-variant/50 font-bold rounded-xl text-sm"
          >
            View Statistics
          </Button>
        </div>
      </Card>

      {/* Footer Links */}
      <div className="flex flex-col gap-1 border-t border-outline-variant pt-6 mt-2 min-w-[200px]">
        <Button 
          variant="tertiary" 
          size="sm"
          className="justify-start px-0 h-12 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 rounded-xl group"
        >
          <div className="flex items-center gap-4 px-4 w-full h-full">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Button>
        <Button 
          variant="tertiary" 
          size="sm"
          className="justify-start px-0 h-12 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 rounded-xl group"
        >
          <div className="flex items-center gap-4 px-4 w-full h-full">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">help</span>
            <span className="text-sm font-medium">Support</span>
          </div>
        </Button>
      </div>
    </nav>
  );
};
