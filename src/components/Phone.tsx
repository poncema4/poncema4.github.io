import { useState, useEffect } from "react";
import { PhoneApps } from "./PhoneApps";
import { AppContent } from "./AppContent";

export interface App {
  id: string;
  name: string;
  icon: string;
  iconType?: "emoji" | "img";
  isExternal?: boolean;
  url?: string;
}

const apps: App[] = [
  { id: "about", name: "About", icon: "👤", iconType: "emoji" },
  { id: "skills", name: "Skills", icon: "⚡", iconType: "emoji" },
  { id: "projects", name: "Projects", icon: "🚀", iconType: "emoji" },
  { id: "tools", name: "Tools", icon: "🛠️", iconType: "emoji" },
  { id: "github", name: "GitHub", icon: "/icons/github.png", iconType: "img", isExternal: true, url: "https://github.com/poncema4" },
  { id: "experience", name: "Experience", icon: "💼", iconType: "emoji" },
  { id: "vercel", name: "Vercel", icon: "▲", iconType: "emoji", isExternal: true, url: "https://vercel.com" },
  { id: "linkedin", name: "LinkedIn", icon: "/icons/linkedin.png", iconType: "img", isExternal: true, url: "https://www.linkedin.com/in/marco-ponce-359127294/" },
  { id: "password", name: "Password Gen", icon: "🔐", iconType: "emoji" },
  { id: "tictactoe", name: "Tic Tac Toe", icon: "/icons/tic-tac-toe.png", iconType: "img" },
  { id: "orcid", name: "ORCID", icon: "/icons/orcid.png", iconType: "img", isExternal: true, url: "https://orcid.org/0009-0007-8937-3530" },
];

export const Phone = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="absolute inset-0 bg-black rounded-[3rem] p-2">
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 py-2 text-white text-sm">
            <span>{currentTime}</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm ml-2">
                <div className="w-4 h-1 bg-white rounded-sm mt-0.5 ml-0.5"></div>
              </div>
            </div>
          </div>
          {/* Screen Content */}
          <div className="flex-1 h-0">
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