import { App } from "./Phone";

interface PhoneAppsProps {
  apps: App[];
  onAppClick: (app: App) => void;
}

export const PhoneApps = ({ apps, onAppClick }: PhoneAppsProps) => {
  return (
    <div className="p-6 h-full animated-bg floating-shapes relative">
      <div className="grid grid-cols-3 gap-6 mt-8">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app)}
            className="flex flex-col items-center space-y-2 group transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-gray-700 transition-colors">
              {app.icon}
            </div>
            <span className="text-white text-xs text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};