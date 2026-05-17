import { ScrollShadow, Button } from "@heroui/react";
import { Message } from "@entities/message/ui/Message";
import { ChatInput } from "@features/chat-input/ui/ChatInput";

export const Chat = () => {
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
          <div className="flex items-center gap-2 text-error px-3 py-1 bg-error/10 rounded-full border border-error/20">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">timer</span>
            <span className="font-mono text-sm font-bold">45:32</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Chat Canvas */}
        <ScrollShadow 
          size={40}
          className="flex-1 w-full max-w-[900px] mx-auto px-gutter pt-stack-lg pb-56 flex flex-col gap-8 overflow-y-auto"
        >
          <Message 
            type="ai" 
            content="Welcome back! Today we'll focus on negotiation vocabulary. Let's look at the 'Rule of Reciprocity' first." 
          />
          
          <Message 
            type="user" 
            content="Sounds great, can we see some examples in a professional context?" 
          />
          
          <Message 
            type="ai" 
            content="Certainly! In a negotiation, a concession is a point you give up to reach an agreement. For example: 'If you can increase the order volume, I can offer a 10% discount.'" 
          />
        </ScrollShadow>

        {/* Floating Input Overlay - Fixed to bottom of this container */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          {/* Gradient backdrop for input */}
          <div className="h-40 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent"></div>
          
          <div className="max-w-[800px] mx-auto px-gutter pb-8 pointer-events-auto">
          <div className="flex flex-col items-center">
            <ChatInput />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
