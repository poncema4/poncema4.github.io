export const Projects = () => {
  const projects = [
    {
      title: "TenantE E-commerce Platform",
      description: "Multi-tenant e-commerce platform for digital products, supporting user storefronts and vendor tools.",
      tech: ["TypeScript", "React", "Next.js", "MongoDB", "Tailwind CSS"],
      status: "In Progress",
      link: "https://github.com/poncema4/multitenant-ecommerce"
    },
    {
      title: "Deepfake Image Detector",
      description: "AI-powered tool to detect deepfake images using metadata analysis and ML models.",
      tech: ["Javascript", "CSS", "Jupyter Notebook", "Python", "Docker", "Machine Learning"],
      status: "Completed",
      link: "https://github.com/poncema4/Deepfake"
    },
    {
      title: "GoPirate",
      description: "Multi-player game with a chat feature included where players battle and fight till the last man wins.",
      tech: ["Python", "SQLite3"],
      status: "Completed",
      link: "https://github.com/poncema4/GoPirate"
    },
    {
      title: "Puzzle-API",
      description: "Generate a puzzle image of the user's input description with their desired dimensions and having to solve the scrambled puzzle.",
      tech: ["Java", "OpenAI API", "Okio", "Okhttp"],
      status: "Completed",
      link: "https://github.com/poncema4/Puzzle-API"
    }
  ];

  return (
    <div className="p-6 text-white min-h-full">
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
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-2 text-primary underline hover:text-primary/80 transition-colors"
          >
            View Repo
          </a>
        )}
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
