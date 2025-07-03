interface ViewToggleProps {
  view: 'mobile' | 'website';
  onToggle: (view: 'mobile' | 'website') => void;
}

export const ViewToggle = ({ view, onToggle }: ViewToggleProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 bg-card/80 backdrop-blur-sm rounded-full p-2 border">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggle('mobile')}
          className={`px-3 py-2 rounded-full text-sm transition-all ${
            view === 'mobile' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📱 Mobile
        </button>
        <button
          onClick={() => onToggle('website')}
          className={`px-3 py-2 rounded-full text-sm transition-all ${
            view === 'website' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🖥️ Website
        </button>
      </div>
    </div>
  );
};