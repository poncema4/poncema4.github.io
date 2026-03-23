import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Github, 
  Star, 
  Calendar,
  Code,
  Zap,
  Brain,
  ShoppingCart,
  Shield,
  Gamepad2,
  Image,
  Puzzle,
  BookOpen,
  Database,
  CloudLightning
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export const Projects = () => {
  const projects = [
    {
      title: "Marcode-AI",
      description: "A cutting-edge SaaS platform that transforms text prompts into fully functional, customizable websites using advanced AI agents and modern web technologies.",
      tech: ["TypeScript", "Next.js", "OpenAI API", "PostgreSQL", "Docker", "Vercel"],
      status: "In Progress",
      category: "AI/SaaS",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "https://github.com/poncema4/Marcode-AI",
      highlights: ["AI-Powered Generation", "Multi-framework Support", "Real-time Customization"],
      featured: true
    },
    {
      title: "TenantE E-commerce Platform",
      description: "Scalable multi-tenant e-commerce solution enabling vendors to create storefronts, manage inventory, and process payments seamlessly.",
      tech: ["TypeScript", "React", "Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
      status: "Completed",
      category: "E-commerce",
      icon: ShoppingCart,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      link: "https://github.com/poncema4/multitenant-ecommerce",
      highlights: ["Multi-tenant Architecture", "Payment Processing", "Vendor Dashboard"],
      featured: true
    },
    {
      title: "Deepfake Detection System",
      description: "Advanced AI-powered detection system using CNN models and metadata analysis to identify deepfake images with high accuracy.",
      tech: ["Python", "TensorFlow", "PyTorch", "OpenCV", "Jupyter"],
      status: "Completed",
      category: "AI/ML",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      link: "https://github.com/poncema4/Deepfake",
      highlights: ["Custom CNN Model", "95% Accuracy", "Real-time Detection"],
      featured: true
    },
    {
      title: "Fraud Detection Engine",
      description: "Real-time fraud detection system with machine learning models, featuring dynamic risk assessment and interactive visualization.",
      tech: ["Python", "Streamlit", "Scikit-learn", "Pandas", "XGBoost"],
      status: "Completed",
      category: "FinTech",
      icon: Database,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      link: "https://github.com/poncema4/Fraud-Detection-System",
      highlights: ["Real-time Prediction", "Interactive Dashboard", "Risk Scoring"],
      featured: false
    },
    {
      title: "GoPirate Multiplayer Game",
      description: "Feature-rich multiplayer battle game with real-time chat, AI bot integration, and dynamic gameplay mechanics.",
      tech: ["Python", "SQLite", "Tkinter", "Socket Programming"],
      status: "Completed",
      category: "Gaming",
      icon: Gamepad2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      link: "https://github.com/poncema4/GoPirate",
      highlights: ["Multiplayer Support", "Real-time Chat", "AI Bot Integration"],
      featured: false
    },
    {
      title: "Smart Canvas Assistant",
      description: "Intelligent education assistant that integrates with Canvas LMS and OpenAI to provide automated responses and document analysis.",
      tech: ["Java", "Canvas API", "OpenAI API", "Spring Boot"],
      status: "Completed",
      category: "EdTech",
      icon: BookOpen,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      link: "https://github.com/poncema4/OpenAI-API",
      highlights: ["LMS Integration", "Document Analysis", "Automated Responses"],
      featured: false
    },
    {
      title: "Puzzle Generator API",
      description: "Cloud-based API service that generates customizable puzzle images from user descriptions with dynamic scrambling algorithms.",
      tech: ["Java", "Microsoft Azure", "Spring Boot", "Image Processing"],
      status: "Completed",
      category: "API/Cloud",
      icon: Puzzle,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      link: "https://github.com/poncema4/Puzzle-API",
      highlights: ["Cloud Deployment", "Image Processing", "Dynamic Generation"],
      featured: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Planning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="p-6 min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Featured Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            Showcasing innovation through code
          </motion.p>
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"
          >
            <Star className="h-6 w-6" />
            Featured Projects
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-gray-800/30 border-gray-700 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${project.bgColor}`}>
                        <project.icon className={`h-6 w-6 ${project.color}`} />
                      </div>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-white text-xl mb-2">{project.title}</CardTitle>
                    <Badge variant="outline" className="w-fit mb-3 text-primary border-primary/30">
                      {project.category}
                    </Badge>
                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Highlights */}
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-gray-700/50">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 group/btn"
                        onClick={() => window.open(project.link, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        View Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group/btn"
                      >
                        <ExternalLink className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
          >
            <Code className="h-6 w-6 text-primary" />
            Additional Projects
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full bg-gray-800/20 border-gray-700 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <project.icon className={`h-5 w-5 ${project.color}`} />
                        <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className={getStatusColor(project.status) + " text-xs"}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300 text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tech.slice(0, 4).map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-700/30">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 4 && (
                        <Badge variant="secondary" className="text-xs bg-gray-700/30">
                          +{project.tech.length - 4}
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group"
                      onClick={() => window.open(project.link, '_blank')}
                    >
                      <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
              <div className="text-gray-400">Total Projects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{projects.filter(p => p.status === 'Completed').length}</div>
              <div className="text-gray-400">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <CloudLightning className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">15+</div>
              <div className="text-gray-400">Technologies Used</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};