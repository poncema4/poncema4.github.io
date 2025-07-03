import { useState } from "react";
import { Phone } from "./Phone";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactForm } from "./ContactForm";
import { ViewToggle } from "./ViewToggle";
import { MouseFollower } from "./MouseFollower";
import linuxPenguin from "@/assets/linux-penguin.png";

export const Portfolio = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'website'>('website');
  const isMobile = useIsMobile();

  const stats = [
    { value: "6+", label: "Years of Experience" },
    { value: "25+", label: "Projects Completed" },
    { value: "15+", label: "Team Collaborations" },
    { value: "5+", label: "Production Deployments" }
  ];

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  const effectiveViewMode = isMobile ? 'mobile' : viewMode;

  return (
    <div className="min-h-screen animated-bg floating-shapes relative overflow-hidden">
      {!isMobile && <MouseFollower />}
      {!isMobile && (
        <ViewToggle 
          view={viewMode} 
          onToggle={setViewMode}
        />
      )}
      
      {/* Mobile Layout */}
      {effectiveViewMode === 'mobile' ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-2">I'm Marco Ponce</p>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-primary">Software Engineer</span>{" "}
              <span className="text-muted-foreground">+</span>
            </h1>
            <h2 className="text-4xl font-bold text-primary mb-4">ML/AI Engineer</h2>
            <div className="text-muted-foreground mb-6">
              <p>Welcome to my portfolio website!</p>
              <p>To see the full version of my portfolio, go on Desktop!</p>
            </div>
            <Button onClick={handleContactClick} className="mb-8">
              Contact Me
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card p-4 rounded-lg text-center border">
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Phone Mockup */}
            <div className="flex-shrink-0">
              <Phone />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-16 text-center">
              <div className="mb-8">
                <p className="text-muted-foreground mb-2">I'm Marco Ponce</p>
                <h1 className="text-6xl font-bold mb-2">
                  <span className="text-primary">Software Engineer</span>{" "}
                  <span className="text-muted-foreground">+</span>
                </h1>
                <h2 className="text-6xl font-bold text-primary mb-6">ML/AI Engineer</h2>
                <div className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  <p>Welcome to my portfolio website!</p>
                  <p>CS @ Seton Hall University</p>
                </div>
                <Button onClick={handleContactClick} size="lg">
                  Contact Me
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linux Penguin Mascot */}
            <div className="flex-shrink-0 ml-16">
              <div className="w-64 h-64 flex items-center justify-center">
                <img 
                  src={linuxPenguin} 
                  alt="Linux Penguin Mascot" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};