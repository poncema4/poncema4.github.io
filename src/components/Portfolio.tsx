import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../integrations/supabase/client";

// Terminal Animation Component
const TerminalAnimation = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const commands = [
    { command: "git status", output: "On branch main\nYour branch is up to date with 'origin/main'", delay: 2000 },
    { command: "npm run build", output: "✓ Build completed successfully", delay: 1500 },
    { command: "python train_model.py", output: "Training model... 95% accuracy achieved", delay: 2500 },
    { command: "ls", output: "home/  skills/  experience/  projects/  publications/  leave_a_note/" },
    { command: "cd ~/portfolio && whoami", output: "marco ponce :)", delay: 1000 },
    { command: "cat README.md", output: "Welcome to my portfolio!", delay: 2000 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length);
      setCurrentText("");
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const command = commands[currentCommand];
    if (command) {
      let index = 0;
      const typing = setInterval(() => {
        if (index <= command.command.length) {
          setCurrentText(command.command.slice(0, index));
          index++;
        } else {
          clearInterval(typing);
        }
      }, 100);

      return () => clearInterval(typing);
    }
  }, [currentCommand]);

  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursor);
  }, []);

  return (
    <div className="space-y-1 text-gray-300 min-h-[120px]">
      <div className="flex">
        <span className="text-green-400">$ </span>
        <span className="text-white">{currentText}</span>
        {showCursor && <span className="text-green-400">|</span>}
      </div>
      {currentText === commands[currentCommand]?.command && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-cyan-400 whitespace-pre-line text-xs"
        >
          {commands[currentCommand]?.output}
        </motion.div>
      )}
    </div>
  );
};
import { 
  Github, 
  Linkedin, 
  Mail, 
  Code, 
  Database, 
  Server, 
  Globe, 
  Terminal,
  Brain,
  Zap,
  Award,
  BookOpen,
  Users,
  ExternalLink,
  ChevronDown,
  Star,
  GitBranch,
  Layers,
  Cloud,
  MapPin,
  GraduationCap,
  Briefcase,
  Trophy,
  Shield,
  Target,
  TrendingUp,
  X,
  Send,
  Trash2,
  Undo,
  Redo,
  Palette,
  Menu,
  Gamepad2,
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ContactForm } from "./ContactForm";
import { useInView } from "react-intersection-observer";

// Star generation function for animated background
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 5,
    animationDuration: Math.random() * 3 + 2,
  }));
};

// Enhanced content filtering function
const containsInappropriateContent = (text: string): boolean => {
  const inappropriateWords = [
    // Profanity
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap', 'piss',
    'hell', 'wtf', 'omfg', 'stfu', 'gtfo', 'fml', 'damn', 'dammit',
    // Offensive terms
    'hate', 'kill', 'die', 'death', 'murder', 'stupid', 'idiot', 'moron', 
    'retard', 'retarded', 'dumb', 'loser', 'freak', 'weirdo',
    // Discriminatory
    'nazi', 'racist', 'sexist', 'homophobic', 'transphobic', 'bigot',
    // Inappropriate sexual content
    'porn', 'sex', 'sexual', 'nude', 'naked', 'penis', 'vagina', 'breast',
    'dick', 'cock', 'pussy', 'boobs', 'tits', 'ass', 'butt', 'horny',
    // Substances
    'drugs', 'cocaine', 'heroin', 'weed', 'marijuana', 'meth', 'crack',
    'alcohol', 'drunk', 'beer', 'wine', 'vodka', 'whiskey',
    // Spam patterns
    'http', 'www', '.com', '.net', '.org', 'click here', 'buy now',
    'free money', 'get rich', 'make money fast'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Check for inappropriate words
  const hasInappropriateWords = inappropriateWords.some(word => lowerText.includes(word));
  
  // Check for repeated characters (spam detection)
  const hasSpamPattern = /(.)\1{4,}/.test(text) || // 5+ repeated chars
                        /[!@#$%^&*]{3,}/.test(text) || // 3+ special chars
                        /[A-Z]{5,}/.test(text); // 5+ caps in a row
  
  return hasInappropriateWords || hasSpamPattern;
};

// Admin functionality - check if user is admin
const isAdmin = () => {
  const adminKey = localStorage.getItem('portfolioAdminKey');
  return adminKey === import.meta.env.VITE_ADMIN_KEY; // Secret admin key from env
};

// Note interface
export interface Note {
  id: string;
  name: string;
  message: string;
  drawing: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  timestamp: number;
}

const colors = [
  "bg-yellow-300", "bg-pink-300", "bg-blue-300", 
  "bg-green-300", "bg-purple-300", "bg-orange-300",
  "bg-red-300", "bg-cyan-300", "bg-indigo-300"
];

const drawingColors = [
  '#000000', '#ff0000', '#00ff00', '#0000ff', 
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500',
  '#800080', '#008000'
];

export const Portfolio = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [stars] = useState(() => generateStars(150));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Leave a Note state
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteError, setNoteError] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawing, setDrawing] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [drawingHistory, setDrawingHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [adminMode, setAdminMode] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Real resume data for Marco Ponce
  const personalInfo = {
    name: "Marco Ponce",
    roles: [
      "Software Engineer",
      "Computer Science Graduate",
      "Linux Lover",
    ],

    linkedin: "https://www.linkedin.com/in/ponce-marco/",
    calendly: "https://calendly.com/ponce-marco/nj",
    github: "https://github.com/poncema4",
    gpa: "3.8",
    university: "Seton Hall University",
    graduation: "May 2026"
  };

  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % personalInfo.roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const skills = {
    programming: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" }
    ],
    frameworks: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "LangChain", icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" }
    ],
    cloud: [
      { name: "Google Cloud Platform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" }
    ]
  };

  const experience = [
    {
      role: "Cybersecurity Consulting Intern",
      company: "Arcova",
      location: "Holmdel, NJ",
      period: "Jun 2026 - Present",
      type: "Internship",
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      tech: ["Python", "FastAPI", "Next.js", "TypeScript", "GCP", "Vertex AI", "LangChain", "PostgreSQL"],
      achievements: [
        "Shipped a full-stack AI platform to GCP behind Entra ID SSO and 300+ CI tests, launching 4 LLM features to production",
        "Architected keyless Claude inference on Vertex AI with IAM auth, eliminating 100% of stored credentials for SOC 2",
        "Ported an agentic LangChain research pipeline with web-search tooling, slashing client research time by 95%"
      ]
    },
    {
      role: "Cybersecurity Research & Systems Assistant",
      company: "Seton Hall University",
      location: "South Orange, NJ",
      period: "Dec 2025 - May 2026",
      type: "Part-time",
      icon: Target,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      tech: ["Virtual Machines", "Security Tools", "Networking", "Lab Systems"],
      achievements: [
        "Installed, configured, and tested software, virtual machines, and security tools for workshops and class labs",
        "Maintained and troubleshot Wi-Fi adapters, network devices, and lab systems used for cybersecurity teaching",
        "Prepared lab environments before sessions, connecting devices and verifying virtual machine functionality"
      ]
    },
    {
      role: "Software Engineer",
      company: "PirateShield",
      location: "Newark, NJ",
      period: "Sep 2025 - May 2026",
      type: "Part-time",
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      tech: ["Python", "TypeScript", "Docker", "Git"],
      achievements: [
        "Implemented Zero-Trust anomaly detection using Python and TypeScript, boosting IoT response speed by 45% across networks",
        "Optimized multi-threaded event processing with Docker, cutting CPU usage 30% and enhancing real-time data throughput",
        "Created scalable plug-and-play security APIs, accelerating K–12 deployment time by 60% and assisting 10+ organizations"
      ]
    },
    {
      role: "Software Engineer",
      company: "Nobile Tech",
      location: "New York City, NY",
      period: "Aug 2022 - Aug 2025",
      type: "Part-time",
      icon: Server,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      tech: ["Java", "SQL", "Redis", "Docker", "Kubernetes", "Git"],
      achievements: [
        "Designed and launched 300+ custom game servers in Java, scaling to support over 2,500+ concurrent users",
        "Introduced automated monitoring and debugging tools, decreasing server downtime by 60% and advancing overall stability",
        "Amplified client traffic by 400% by launching 20+ web platforms through targeted SEO and social media strategies"
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "Reality AI",
      location: "New York City, NY",
      period: "Jun 2025 - Aug 2025",
      type: "Internship",
      icon: Code,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      tech: ["React.js", "Next.js", "JavaScript", "Tailwind CSS", "PostgreSQL"],
      achievements: [
        "Automated educators’ workflows using React.js and Next.js, reducing manual tasks by 15% and increasing productivity",
        "Built scalable real-time APIs with LangChain and Redis, managing 1000+ concurrent users while ensuring low latency",
        "Accelerated deployment speed by 40% through CI/CD pipelines with 85%+ test coverage, minimizing production errors"
      ]
    },
    {
      role: "Teaching Assistant",
      company: "Seton Hall University",
      location: "South Orange, NJ",
      period: "Aug 2024 - December 2024",
      type: "Part-time",
      icon: GraduationCap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      tech: ["Racket", "Python", "Data Structures"],
      achievements: [
        "Led review sessions and tutored 100+ students in Racket, Python, and Data Structures, raising average grade by 15%",
        "Facilitated learning during office hours by guiding students toward solutions and optimizations, improving overall outcomes"
      ]
    },
    {
      role: "Game Developer",
      company: "Roblox",
      location: "Remote",
      period: "Apr 2019 - Aug 2023",
      type: "Part-time",
      icon: Gamepad2,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      tech: ["Lua", "Roblox Studio"],
      achievements: [
        "Enhanced gameplay reliability for 16.2B+ visits on MeepCity by scripting and optimizing multiplayer systems in Lua",
        "Reduced crash rates by 35% during peak traffic by collaborating with the lead team on core mechanics and live features",
        "Improved server performance by 25% through refactoring and debugging legacy Lua code in high-traffic environments",
        "Mentored 20+ developers across Roblox games, cutting debugging time 50% and boosting development cycles and stability"  
      ]
    }
  ];

  const projects = [
    {
      title: "PirateFlow",
      period: "Mar 2026",
      status: "Completed",
      icon: Code,
      color: "text-blue-400",
      description: "Real-time campus space intelligence platform featuring AI-powered utilization analytics, automated anomaly detection, face recognition access control, and smart room booking with live updates.",
      tech: ["React.js", "Python", "Supabase", "Tailwind CSS", "FastAPI"],
      highlights: [
        "Led a 5-person team to develop AI room search, revenue tracking, and 7-day occupancy forecasting across 3 building types",
        "Engineered a real-time campus space intelligence platform, cutting ghost bookings by 71% with AI anomaly detection",
        "Deployed full-stack app to production across 5 buildings, achieving 99.9% uptime and reducing unauthorized access by 85%"
      ],
      github: "https://github.com/poncema4/PirateFlow"
    },
    {
      title: "CyberSmart",
      period: "Aug 2025 - Dec 2025",
      status: "Completed",
      icon: Shield,
      color: "text-purple-400",
      description: "AI-powered cybersecurity education platform using neural networks and advanced ML algorithms to provide personalized phishing detection and password security training with real-time analytics.",
      tech: ["Python", "Streamlit", "Scikit-learn", "SQLite", "NumPy", "Pandas"],
      highlights: [
        "Delivered an AI-powered cybersecurity platform with a MLP neural network, generating $5,000 revenue and engagement",
        "Promoted engagement by 75% and retention by 60% through adaptive learning modules on phishing and password security",
        "Streamlined SQLite tracking and neural network recommendations, revamping assessment accuracy by 30% across users"
      ],
      github: "https://github.com/poncema4/CyberSmart"
    },
        {
      title: "DocsGPT",
      period: "Oct 2025 - Nov 2025",
      status: "Completed",
      icon: Brain,
      color: "text-blue-400",
      description: "Private AI platform for agents, assistants and enterprise search. Built-in Agent Builder, Deep research, Document analysis, Multi-model support, and API connectivity for agents.",
      tech: ["Python", "TypeScript", "LangChain", "Docker", "Shell", "PowerShell"],
      highlights: [
        "Enhanced DocsGPT, an open-source platform with 20,000+ users, improving AI prompt logic and RAG accuracy by 20%",
        "Resolved fixes for Docker deployments via Shell and PowerShell, minimizing setup errors by 60% across environments",
        "Refined mobile and desktop layout architecture, decreasing rendering issues by 35% and elevating usability for users"
      ],
      github: "https://github.com/arc53/DocsGPT"
    },
    {
      title: "Marcode-AI",
      period: "Jul 2025 - Aug 2025",
      status: "Completed",
      icon: Globe,
      color: "text-green-400",
      description: "A SaaS platform that is an AI-powered website builder that instantly creates customizable websites from a single prompt. Just describe your vision to the AI and it will create the website within seconds.",
      tech: ["TypeScript", "React.js", "Next.js", "PostgreSQL", "OpenAI API", "Docker", "Vercel"],
      highlights: [
        "Developed a SaaS platform generating websites from text prompts, shrinking build time by 70% with 200+ daily outputs",
        "Expanded AI accuracy by 30% through engineering advanced natural language processing modules and prompt engineering",
        "Orchestrated Docker microservices on Vercel, maintaining 99.9% uptime and supporting 300% user growth"
      ],
      github: "https://github.com/poncema4/Marcode-AI"
    },
    {
      title: "TenantE",
      period: "Mar 2025 - May 2025",
      status: "Completed",
      icon: Server,
      color: "text-yellow-400",
      description: "A full-featured e-commerce marketplace platform that is built for scalability and performace for user registration, product listings, purchases, order management, and secure checkout.",
      tech: ["TypeScript", "React.js", "Next.js", "MongoDB", "Vercel", "Javascript", "CSS"],
      highlights: [
        "Built a multi-tenant e-commerce platform for 100+ vendors with isolated data, ensuring strong privacy and security",
        "Optimized backend APIs and queries, reducing page load time by 35%, enabling seamless transactions under heavy traffic",
        "Designed responsive UI with client-side state management, boosting mobile usability by 40% across multiple devices"
      ],
      github: "https://github.com/poncema4/multitenant-ecommerce"
    },
    {
      title: "GoPirate",
      period: "Apr 2025 - May 2025",
      status: "Completed",
      icon: Gamepad2,
      color: "text-purple-400",
      description: "Multi-player game with a chat feature included where players battle and fight till the last man wins.",
      tech: ["Python", "Jupyter Notebook", "PyTorch", "Sqlite"],
      highlights: [
        "An integrated chatbot assists players with in-game queries using AI-powered responses and logs unknown questions",
        "Built using tkinter, socket, and threading, with a clear separation of GUI, networking, game logic, and chatbot modules",
      ],
      github: "https://github.com/poncema4/GoPirate"
    }
  ];

  const stats = [
    { value: "3+", label: "Years Experience", sublabel: "Software Engineering", icon: Briefcase },
    { value: "20K+", label: "Users Impacted", sublabel: "Across Projects", icon: Users },
    { value: "50+", label: "Open Source", sublabel: "Contributions", icon: GitBranch },
    { value: "2", label: "ACM Publications", sublabel: "Security Research", icon: Trophy }
  ];

  const publications = [
    {
      title: "RiskCast: Behavioral Risk Forecasting Across Multi-Modal Security Streams",
      venue: "ACM IWSPA '26",
      authors: "S. Anand, M. Ponce, D. Duong",
      location: "Frankfurt am Main, Germany",
      period: "Jun 2026",
      doi: "https://doi.org/10.1145/3806007.3810965"
    },
    {
      title: "BBKR: Behavior-Driven Key Rotation for Zero Trust Network Security",
      venue: "ACM SaT-CPS '26",
      authors: "S. Anand, M. Ponce, D. Duong",
      location: "Frankfurt am Main, Germany",
      period: "Jun 2026",
      doi: "https://doi.org/10.1145/3806008.3811702"
    }
  ];

  const certifications = [
    "Building with the Claude API",
    "Claude Code in Action",
    "Claude 101",
    "Claude Code 101",
    "Claude Platform 101",
    "Introduction to Model Context Protocol",
    "Model Context Protocol: Advanced Topics",
    "Introduction to Subagents",
    "Introduction to Agent Skills",
    "Introduction to Claude Cowork",
    "AI Fluency Framework & Foundations",
    "AI Fluency for Nonprofits",
    "AI Fluency for Small Businesses",
    "AI Capabilities and Limitations",
    "AWS Academy Graduate — Cloud Foundations"
  ];

  // Load notes from Supabase
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) {
          console.error('Error loading notes:', error);
          // Fallback to localStorage for existing notes
          const savedNotes = localStorage.getItem('leaveNotes');
          if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
          }
        } else {
          setNotes(data || []);
        }
      } catch (err) {
        console.error('Error loading notes:', err);
        // Fallback to localStorage
        const savedNotes = localStorage.getItem('leaveNotes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      }
    };
    
    loadNotes();
  }, []);

  // Save note to Supabase
  const saveNoteToDatabase = async (note: Note) => {
    try {
      const { error } = await supabase
        .from('notes')
        .insert([{
          id: note.id,
          name: note.name,
          message: note.message,
          drawing: note.drawing,
          x: note.x,
          y: note.y,
          rotation: note.rotation,
          color: note.color,
          timestamp: note.timestamp
        }]);
      
      if (error) {
        console.error('Error saving note to database:', error);
        // Fallback to localStorage
        const currentNotes = JSON.parse(localStorage.getItem('leaveNotes') || '[]');
        currentNotes.push(note);
        localStorage.setItem('leaveNotes', JSON.stringify(currentNotes));
      }
    } catch (err) {
      console.error('Error saving note:', err);
      // Fallback to localStorage
      const currentNotes = JSON.parse(localStorage.getItem('leaveNotes') || '[]');
      currentNotes.push(note);
      localStorage.setItem('leaveNotes', JSON.stringify(currentNotes));
    }
  };

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Height of the navbar
      const elementTop = element.offsetTop - navHeight;
      window.scrollTo({ top: elementTop, behavior: 'smooth' });
    }
  };

  // Intersection observers
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [experienceRef, experienceInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [notesRef, notesInView] = useInView({ threshold: 0.3, triggerOnce: false });

  useEffect(() => {
    if (heroInView) setCurrentSection('hero');
    else if (skillsInView) setCurrentSection('skills');
    else if (experienceInView) setCurrentSection('experience');
    else if (projectsInView) setCurrentSection('projects');
    else if (notesInView) setCurrentSection('notes');
  }, [heroInView, skillsInView, experienceInView, projectsInView, notesInView]);

  // Note handling functions
  const handleSubmitNote = async () => {
    setNoteError("");
    
    if (!noteName.trim() || !noteMessage.trim()) {
      setNoteError("Please fill in both name and message fields");
      return;
    }

    if (noteName.length > 45 || noteMessage.length > 45) {
      setNoteError("Name and message must be 45 characters or less");
      return;
    }

    if (containsInappropriateContent(noteName) || containsInappropriateContent(noteMessage)) {
      setNoteError("Message contains inappropriate content and cannot be posted");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      name: noteName.trim(),
      message: noteMessage.trim(),
      drawing,
      x: Math.random() * 55 + 5, // 5-60% from left (accounts for note width)
      y: Math.random() * 45 + 5, // 5-50% from top (accounts for note height)
      rotation: Math.random() * 20 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      timestamp: Date.now()
    };

    // Add to local state immediately for instant feedback
    setNotes(prev => [...prev, newNote]);
    
    // Save to database
    await saveNoteToDatabase(newNote);
    
    // Reset form
    setNoteName("");
    setNoteMessage("");
    setDrawing("");
    setShowNoteForm(false);
    clearCanvas();
  };

  // Helper function to get coordinates from mouse or touch event
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return null;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  // Canvas drawing functions with proper cursor alignment and touch support
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current state before starting to draw (for undo functionality)
    if (drawingHistory.length === 0) {
      // Initialize with blank canvas
      setDrawingHistory([""]);
      setHistoryIndex(0);
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    
    if (!isDrawing) return;
    
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    setDrawing(dataUrl);
    
    // Save this stroke to history (each stroke is a new history state)
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawing("");
    // Reset history to just the blank state
    setDrawingHistory([""]);
    setHistoryIndex(0);
  };

  const undoDrawing = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const historyState = drawingHistory[newIndex];
      setDrawing(historyState);
      
      // If there's a drawing to restore, load it
      if (historyState && historyState !== "") {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = historyState;
      }
    }
  };

  const redoDrawing = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const historyState = drawingHistory[newIndex];
      setDrawing(historyState);
      
      // If there's a drawing to restore, load it
      if (historyState && historyState !== "") {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = historyState;
      }
    }
  };

  // Initialize canvas when opening note form
  const openNoteForm = () => {
    setShowNoteForm(true);
    // Reset drawing state
    setDrawing("");
    setDrawingHistory([""]);
    setHistoryIndex(0);
    setNoteName("");
    setNoteMessage("");
    setNoteError("");
  };

  // Admin functions
  const handleAdminLogin = () => {
    if (adminKeyInput === import.meta.env.VITE_ADMIN_KEY) {
      setAdminMode(true);
      localStorage.setItem('portfolioAdminKey', adminKeyInput);
      setAdminKeyInput("");
      setAdminError("");
    } else if (adminKeyInput.trim() !== "") {
      setAdminError("Incorrect.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (adminMode) {
      // Remove from local state immediately
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      // Delete from database
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId);
        
        if (error) {
          console.error('Error deleting note from database:', error);
        }
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
    localStorage.removeItem('portfolioAdminKey');
  };

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleNotesAreaClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on the container itself, not on a note
    if (e.target === e.currentTarget) {
      setSelectedNoteId(null);
    }
  };

  // Check admin status on mount
  useEffect(() => {
    if (isAdmin()) {
      setAdminMode(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated Stars Background */}
      <div className="fixed inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.animationDuration,
              repeat: Infinity,
              delay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Menu - Top Left */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Menu className="h-4 w-4 text-white" />
            </button>
            
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 mx-auto">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'skills', label: 'Skills' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'publications', label: 'Publications' },
                { id: 'notes', label: 'Leave a Note' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors hover:text-white ${
                    currentSection === item.id ? 'text-white font-medium' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Contact Button & Social Links - Top Right */}
            <div className="flex items-center space-x-2">
              <motion.a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Github className="h-4 w-4" />
              </motion.a>
              
              <motion.a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>

              <motion.a
                href={personalInfo.calendly}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Calendar className="h-4 w-4" />
              </motion.a>

              {/* Contact Me Button */}
              <motion.button
                onClick={handleContactClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:bg-white/20 md:hover:bg-white/30 md:border md:border-white/20 md:rounded-md md:px-4 md:py-2 md:flex md:items-center md:gap-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden md:inline text-white text-sm">Contact</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 border-t border-white/10 pt-4"
            >
              <div className="flex flex-col space-y-3">
                {[
                  { id: 'hero', label: 'Home' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'publications', label: 'Publications' },
                  { id: 'notes', label: 'Leave a Note' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`text-left py-2 px-4 rounded-lg transition-colors ${
                      currentSection === item.id 
                        ? 'text-white bg-white/10 font-medium' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
      
      {/* Main Content */}
      <div className="relative z-20 pt-20">
        {/* Hero Section */}
        <section id="hero" ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6"
                >
                  <span className="block text-white">Hi, I'm </span>
                  <span className="block bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {personalInfo.name}
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg md:text-xl lg:text-3xl font-semibold mb-4 md:mb-6 h-8 md:h-12"
                >
                  <span className="text-gray-300">I'm a </span>
                  <motion.span
                    key={currentRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    {personalInfo.roles[currentRole]}
                  </motion.span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0"
                >
                  Computer Science graduate from <span className="text-white font-semibold">{personalInfo.university}</span>
                  {' '}with a deep interest for building innovative software,
                  graduated in <span className="text-white font-semibold">{personalInfo.graduation}</span>.
                </motion.p>

                {/* Terminal Interface */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-black/90 backdrop-blur-sm rounded-lg border border-gray-600 p-4 font-mono text-sm max-w-lg mx-auto lg:mx-0 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-3 border-b border-gray-600 pb-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-xs">marco@desktop: ~</span>
                  </div>
                  <TerminalAnimation />
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Contact Card & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-xl text-center border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 text-purple-400" />
                    <div className="text-xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-gray-300 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-6 md:py-8 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Technical Skills
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                My current tech stack and tools that I have used in projects or work
              </p>
            </motion.div>

            <div className="grid gap-3 md:gap-4">
              {/* Programming Languages */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10"
              >
                <h3 className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                  <Code className="text-blue-400 w-4 h-4" />
                  Programming Languages
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {skills.programming.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 p-2 rounded-lg text-center border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <div className="w-4 h-4 mb-1 mx-auto">
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs font-medium text-white truncate">{skill.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Frameworks & Tools */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10"
              >
                <h3 className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                  <Layers className="text-green-400 w-4 h-4" />
                  Frameworks & Tools
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {skills.frameworks.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 p-2 rounded-lg text-center border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <div className="w-4 h-4 mb-1 mx-auto">
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs font-medium text-white truncate">{skill.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Cloud & Databases */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10"
              >
                <h3 className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                  <Cloud className="text-purple-400 w-4 h-4" />
                  Cloud & Databases
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {skills.cloud.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 p-2 rounded-lg text-center border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <div className="w-4 h-4 mb-1 mx-auto">
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-xs font-medium text-white truncate">{skill.name}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" ref={experienceRef} className="py-6 md:py-8 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Experience
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                My journey into software engineering and technology
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-5">
              {experience.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg ${job.bgColor} flex items-center justify-center`}>
                        <job.icon className={`w-4 h-4 ${job.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white truncate">{job.role}</h3>
                          <p className="text-sm text-purple-300 font-semibold truncate">{job.company}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-300 font-medium">{job.period}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            job.type === 'Full-time' ? 'bg-green-500/20 text-green-300' :
                            job.type === 'Internship' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {job.type}
                          </span>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.tech.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-white/10 text-gray-300 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Achievements */}
                      <ul className="space-y-1 text-gray-300">
                        {job.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="py-8 md:py-12 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                Some of my recent personal projects and contributions
              </p>
            </motion.div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                        <project.icon className={`w-4 h-4 ${project.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-400">{project.period}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1 mb-4">
                    {project.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-start">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors"
                    >
                      <Github className="w-3 h-3" />
                      <span className="text-xs font-medium">View Code</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="py-8 md:py-12 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Publications
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
                Peer-reviewed security research published at ACM venues
              </p>
            </motion.div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              {publications.map((pub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {pub.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{pub.venue} · {pub.period} · {pub.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{pub.authors}</p>
                  <motion.a
                    href={pub.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1 text-purple-300 hover:text-white transition-colors"
                  >
                    <span className="text-xs font-medium">Read Paper (DOI)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications strip */}
        <section id="certifications" className="py-4 md:py-6 px-4 md:px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-xs uppercase tracking-widest mb-3"
            >
              Certifications — Anthropic & AWS
            </motion.p>
            <div className="flex flex-wrap justify-center gap-2">
              {certifications.map((cert) => (
                <span key={cert} className="px-3 py-1.5 bg-white/10 border border-white/10 text-gray-200 rounded-full text-xs font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Leave a Note Section */}
        <section id="notes" ref={notesRef} className="py-6 md:py-8 px-4 md:px-6 relative pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Leave a Note
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-6 md:mb-8">
                Draw something, write a note, and watch it appear on the canvas!
              </p>

              {/* Admin Controls */}
              <div className="mb-6 flex justify-center">
                {!adminMode ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        placeholder="Admin key..."
                        value={adminKeyInput}
                        onChange={(e) => {
                          setAdminKeyInput(e.target.value);
                          setAdminError("");
                        }}
                        className="w-32 text-xs h-8"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      />
                      <Button
                        onClick={handleAdminLogin}
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-2"
                      >
                        Admin
                      </Button>
                    </div>
                    {adminError && (
                      <span className="text-red-400 text-xs">{adminError}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">Admin Mode Active</span>
                    <Button
                      onClick={handleAdminLogout}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>

              {!showNoteForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={openNoteForm}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 md:px-6 py-2 text-sm md:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Write a Note
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Notes Display */}
            <div 
              className="relative h-80 md:h-96 mb-6 md:mb-8 px-4 md:px-8 overflow-hidden"
              onClick={handleNotesAreaClick}
            >
              <AnimatePresence>
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: selectedNoteId === note.id ? 1.1 : 1, 
                      rotate: selectedNoteId === note.id ? 0 : note.rotation,
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100,
                      damping: 15 
                    }}
                    className={`absolute w-32 h-32 md:w-40 md:h-40 ${note.color} p-2 md:p-3 rounded-lg transform cursor-pointer group hover:scale-105 transition-all duration-300 ${
                      selectedNoteId === note.id ? 'shadow-2xl z-50' : 'shadow-xl z-10'
                    }`}
                    style={{
                      left: `${Math.max(0, Math.min(note.x, 65))}%`,
                      top: `${Math.max(0, Math.min(note.y, 50))}%`,
                    }}
                    whileHover={{ scale: selectedNoteId === note.id ? 1.1 : 1.05, rotate: selectedNoteId === note.id ? 0 : 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNoteClick(note.id);
                    }}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Admin Delete Button */}
                      {adminMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg z-10 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-xs md:text-sm mb-1 truncate">
                          {note.name}
                        </h4>
                        <p className="text-gray-700 text-xs leading-tight overflow-hidden line-clamp-2 md:line-clamp-3">
                          {note.message}
                        </p>
                      </div>

                      {note.drawing && (
                        <div className="mt-1">
                          <img 
                            src={note.drawing} 
                            alt="Drawing" 
                            className="w-full h-6 md:h-10 object-contain rounded"
                          />
                        </div>
                      )}

                      <div className="text-xs text-gray-600 mt-1">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 text-center border border-white/20 max-w-xs mx-auto"
            >
              <div className="flex items-center justify-center gap-3 md:gap-4 text-white">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold">{notes.length}</div>
                  <div className="text-xs opacity-80">Total Notes</div>
                </div>
                <div className="w-px h-5 md:h-6 bg-white opacity-30"></div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold">
                    {notes.filter(note => 
                      new Date(note.timestamp).toDateString() === new Date().toDateString()
                    ).length}
                  </div>
                  <div className="text-xs opacity-80">Today</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Note Form Modal */}
      <AnimatePresence>
        {showNoteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Create Note</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNoteForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value.slice(0, 45))}
                    placeholder="Your name..."
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {noteName.length}/45 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    value={noteMessage}
                    onChange={(e) => setNoteMessage(e.target.value.slice(0, 45))}
                    placeholder="Your message..."
                    className="w-full h-16 md:h-20 resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {noteMessage.length}/45 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw something
                  </label>
                  
                  {/* Drawing Tools */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Palette className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">Colors:</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {drawingColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setDrawingColor(color)}
                          className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 ${
                            drawingColor === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={undoDrawing}
                      disabled={historyIndex <= 0}
                      className="text-xs"
                    >
                      <Undo className="w-3 h-3 mr-1" />
                      Undo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={redoDrawing}
                      disabled={historyIndex >= drawingHistory.length - 1}
                      className="text-xs"
                    >
                      <Redo className="w-3 h-3 mr-1" />
                      Redo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCanvas}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="w-full h-24 md:h-32 bg-gray-50 rounded cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      onTouchCancel={stopDrawing}
                    />
                  </div>
                </div>

                {noteError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {noteError}
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowNoteForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitNote}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Note
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <ContactForm onClose={() => setShowContactForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};