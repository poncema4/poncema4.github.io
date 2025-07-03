import { TicTacToe } from "./apps/TicTacToe";
import { About } from "./apps/About";
import { Skills } from "./apps/Skills";
import { Projects } from "./apps/Projects";
import { Tools } from "./apps/Tools";
import { Experience } from "./apps/Experience";
import { PasswordGenerator } from "./apps/PasswordGenerator";

interface AppContentProps {
  appId: string;
  onBack: () => void;
}

export const AppContent = ({ appId, onBack }: AppContentProps) => {
  const renderApp = () => {
    switch (appId) {
      case "about":
        return <About />;
      case "skills":
        return <Skills />;
      case "projects":
        return <Projects />;
      case "tools":
        return <Tools />;
      case "experience":
        return <Experience />;
      case "password":
        return <PasswordGenerator />;
      case "tictactoe":
        return <TicTacToe />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-white">
            <p>App content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-black text-white relative">
      {/* App Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
        {renderApp()}
      </div>
    </div>
  );
};