import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { 
  Globe, 
  Server, 
  Database, 
  Cloud, 
  Brain, 
  Wrench,
  Star,
  TrendingUp,
  Code2,
  Smartphone
} from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Globe,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      skills: [
        { name: "React", level: 95, category: "Expert" },
        { name: "Next.js", level: 90, category: "Expert" },
        { name: "TypeScript", level: 92, category: "Expert" },
        { name: "Tailwind CSS", level: 88, category: "Advanced" },
        { name: "Vue.js", level: 80, category: "Advanced" },
        { name: "Angular", level: 75, category: "Intermediate" }
      ]
    },
    {
      title: "Backend Development",
      icon: Server,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      skills: [
        { name: "Node.js", level: 90, category: "Expert" },
        { name: "Python", level: 88, category: "Expert" },
        { name: "Java", level: 82, category: "Advanced" },
        { name: "Express.js", level: 85, category: "Advanced" },
        { name: "FastAPI", level: 80, category: "Advanced" },
        { name: "Django", level: 75, category: "Intermediate" }
      ]
    },
    {
      title: "AI / Machine Learning",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      skills: [
        { name: "TensorFlow", level: 85, category: "Advanced" },
        { name: "PyTorch", level: 82, category: "Advanced" },
        { name: "LangChain", level: 88, category: "Expert" },
        { name: "OpenAI APIs", level: 90, category: "Expert" },
        { name: "Pandas", level: 85, category: "Advanced" },
        { name: "NumPy", level: 83, category: "Advanced" }
      ]
    },
    {
      title: "Databases",
      icon: Database,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      skills: [
        { name: "PostgreSQL", level: 88, category: "Advanced" },
        { name: "MongoDB", level: 85, category: "Advanced" },
        { name: "Redis", level: 80, category: "Advanced" },
        { name: "Supabase", level: 85, category: "Advanced" },
        { name: "MySQL", level: 78, category: "Intermediate" },
        { name: "SQLite", level: 82, category: "Advanced" }
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: Cloud,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      skills: [
        { name: "Docker", level: 85, category: "Advanced" },
        { name: "AWS", level: 82, category: "Advanced" },
        { name: "Kubernetes", level: 75, category: "Intermediate" },
        { name: "GitHub Actions", level: 80, category: "Advanced" },
        { name: "Azure", level: 78, category: "Intermediate" },
        { name: "Vercel", level: 88, category: "Expert" }
      ]
    },
    {
      title: "Mobile Development",
      icon: Smartphone,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      skills: [
        { name: "React Native", level: 85, category: "Advanced" },
        { name: "Flutter", level: 75, category: "Intermediate" },
        { name: "iOS Development", level: 70, category: "Intermediate" },
        { name: "Android Development", level: 72, category: "Intermediate" },
        { name: "Expo", level: 80, category: "Advanced" },
        { name: "Progressive Web Apps", level: 85, category: "Advanced" }
      ]
    }
  ];

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Expert": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Advanced": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getProgressColor = (level: number) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500";
    if (level >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

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
            Technical Skills
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            A comprehensive overview of my technical expertise
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1 }}
            >
              <Card className="bg-gray-800/30 border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <span className="text-white">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{skill.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryBadgeColor(skill.category)}`}
                          >
                            {skill.category}
                          </Badge>
                        </div>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      
                      <div className="relative">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ 
                              delay: 0.8 + categoryIndex * 0.1 + skillIndex * 0.05,
                              duration: 0.8,
                              ease: "easeOut"
                            }}
                            className={`h-full rounded-full ${getProgressColor(skill.level)}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">12+</div>
              <div className="text-gray-400">Expert Level Skills</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">25+</div>
              <div className="text-gray-400">Technologies Mastered</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Code2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">6+</div>
              <div className="text-gray-400">Years Experience</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8"
        >
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-primary mb-4">Continuous Learning</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Technology evolves rapidly, and so do I. I'm committed to staying current with 
                the latest trends, tools, and best practices in software development. 
                Every project is an opportunity to learn something new and push boundaries.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
