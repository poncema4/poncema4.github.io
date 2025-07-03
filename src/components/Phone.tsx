import { useState } from "react";
import { PhoneApps } from "./PhoneApps";
import { AppContent } from "./AppContent";

export interface App {
  id: string;
  name: string;
  icon: string;
  isExternal?: boolean;
  url?: string;
}

const apps: App[] = [
  { id: "about", name: "About", icon: "👤" },
  { id: "skills", name: "Skills", icon: "⚡" },
  { id: "projects", name: "Projects", icon: "🚀" },
  { id: "tools", name: "Tools", icon: "🛠️" },
  { id: "github", name: "GitHub", icon: "⚫", isExternal: true, url: "https://github.com" },
  { id: "experience", name: "Experience", icon: "💼" },
  { id: "vercel", name: "Vercel", icon: "▲", isExternal: true, url: "https://vercel.com" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", isExternal: true, url: "https://linkedin.com" },
  { id: "password", name: "Password Gen", icon: "🔐" },
  { id: "tictactoe", name: "Tic Tac Toe", icon: "⭕" },
  { id: "orcid", name: "ORCID", icon: "🆔", isExternal: true, url: "https://orcid.org" },
];

export const Phone = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAppClick = (app: App) => {
    if (app.isExternal && app.url) {
      window.open(app.url, '_blank');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setActiveApp(app.id);
      setIsLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    setActiveApp(null);
  };

  return (
    <div className="relative w-80 h-[640px] mx-auto">
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-gray-800 rounded-[3rem] p-2">
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 py-2 text-white text-sm">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-4 h-1 bg-white rounded-sm mt-0.5 ml-0.5"></div>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading...</p>
                </div>
              </div>
            ) : activeApp ? (
              <AppContent appId={activeApp} onBack={handleBack} />
            ) : (
              <PhoneApps apps={apps} onAppClick={handleAppClick} />
            )}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
};