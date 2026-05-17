import { Button, InputGroup } from "@heroui/react";

export const ChatInput = () => {
  return (
    <div className="relative group w-full">
      {/* Soft glow behind input */}
      <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
      
      <InputGroup 
        className="h-16 bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all rounded-full overflow-hidden flex items-center px-2"
      >
        <InputGroup.Prefix className="flex items-center">
          <Button 
            isIconOnly 
            variant="tertiary" 
            className="text-on-surface-variant hover:text-on-surface w-12 h-12 min-w-12 rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">mic</span>
          </Button>
        </InputGroup.Prefix>
        
        <InputGroup.Input 
          placeholder="Type your response..."
          className="flex-1 bg-transparent border-none focus:outline-none text-on-surface placeholder:text-on-surface-variant/40 italic text-base px-3 h-full"
        />

        <InputGroup.Suffix className="flex items-center">
          <Button 
            isIconOnly 
            variant="primary"
            className="w-12 h-12 min-w-12 rounded-full shadow-lg shadow-primary/40 bg-primary flex items-center justify-center transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px] text-white" aria-hidden="true">send</span>
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </div>
  );
};
