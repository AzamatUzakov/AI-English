interface MessageProps {
  type: 'ai' | 'user';
  content: string;
  specialContent?: React.ReactNode;
}

export const Message = ({ type, content, specialContent }: MessageProps) => {
  const isAI = type === 'ai';

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
      <div className="flex flex-col gap-2 w-full">
        <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isAI 
            ? 'bg-surface-container-high text-on-surface rounded-tl-sm border border-outline-variant/20' 
            : 'bg-primary-container text-on-primary-container rounded-tr-sm border border-primary/20'
        }`}>
          {content}
        </div>
        {specialContent}
      </div>
    </div>
  );
};
