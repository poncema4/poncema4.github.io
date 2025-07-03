export const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      status: "Completed"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      tech: ["Next.js", "TypeScript", "Supabase"],
      status: "In Progress"
    },
    {
      title: "Portfolio Website",
      description: "Responsive portfolio website with interactive elements",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      status: "Completed"
    },
    {
      title: "Mobile Banking App",
      description: "Secure mobile banking interface design",
      tech: ["Figma", "React Native", "UI/UX"],
      status: "Design Phase"
    }
  ];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-primary">My Projects</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg border-l-4 border-primary">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <span className="text-xs bg-primary px-2 py-1 rounded text-white">
                {project.status}
              </span>
            </div>
            <p className="text-gray-300 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};