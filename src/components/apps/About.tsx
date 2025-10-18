import { motion } from "framer-motion";
import { Code, Brain, Rocket, Heart, MapPin, Calendar, GraduationCap, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export const About = () => {
  const highlights = [
    { icon: Code, label: "6+ Years Experience", color: "text-blue-400" },
    { icon: Brain, label: "AI/ML Specialist", color: "text-purple-400" },
    { icon: Rocket, label: "Full-Stack Developer", color: "text-green-400" },
    { icon: Trophy, label: "Problem Solver", color: "text-yellow-400" },
  ];

  const personalInfo = [
    { icon: MapPin, label: "Based in New Jersey, USA" },
    { icon: GraduationCap, label: "CS @ Seton Hall University '26" },
    { icon: Calendar, label: "Available for opportunities" },
    { icon: Heart, label: "Passionate about technology" },
  ];

  const values = [
    "Clean, scalable code architecture",
    "User-centered design thinking", 
    "Continuous learning mindset",
    "Collaborative team environment",
    "Innovation through technology",
    "Performance optimization focus"
  ];

  return (
    <div className="p-6 min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
            className="relative mb-6"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-purple-500 p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-4xl">👨‍💻</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
            >
              ⚡
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Marco Ponce
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-6"
          >
            Full-Stack Developer & AI/ML Engineer
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
              >
                <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                <p className="text-sm text-gray-300 text-center">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* About Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">My Story</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Hello! I'm a passionate Software Engineer with expertise in building 
                  intelligent, scalable systems that solve real-world problems. My journey 
                  in technology spans over 6 years, with a deep focus on full-stack 
                  development and AI/ML integration.
                </p>
                <p>
                  I specialize in creating modern web applications using React, TypeScript, 
                  and Node.js, while leveraging Python, TensorFlow, and cloud technologies 
                  to build intelligent backend systems.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Personal Info</h3>
              <div className="space-y-3">
                {personalInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4 text-center">What I Value</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-gray-300">{value}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-lg">
            Ready to build something amazing together? 
            <span className="text-primary font-semibold"> Let's connect!</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};