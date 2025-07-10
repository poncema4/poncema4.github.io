export const Projects = () => {
  const projects = [
    {
      title: "Marcode-AI",
      description: "A SaaS platform that enables users to instantly generate fully customizable websites from a single text prompt using AI-powered agents.",
      tech: ["TypeScript", "React", "Next.js", "PostgreSQL", "OpenAI API", "Docker", "Vercel"],
      status: "In Progress",
      link: "https://github.com/poncema4/Marcode-AI"
    },
    {
      title: "TenantE E-commerce Platform",
      description: "Multi-tenant e-commerce platform for digital products, supporting user storefronts and vendor tools.",
      tech: ["TypeScript", "React", "Next.js", "MongoDB", "Tailwind CSS", "Vercel"],
      status: "Completed",
      link: "https://github.com/poncema4/multitenant-ecommerce"
    },
    {
      title: "Deepfake Image Detector",
      description: "AI-powered tool to detect deepfake images using metadata analysis and a custom-trained CNN model.",
      tech: ["Python", "JavaScript", "Jupyter Notebook", "TensorFlow", "PyTorch"],
      status: "Completed",
      link: "https://github.com/poncema4/Deepfake"
    },
    {
      title: "GoPirate",
      description: "Multi-player game with a chat feature and chat bot included where players battle and fight till the last man wins.",
      tech: ["Python", "SQLite", "Tkinter"],
      status: "Completed",
      link: "https://github.com/poncema4/GoPirate"
    },
    {
      title: "Fraud Detection System",
      description: "Built a streamlit-based web app for real-time user input, risk prediction, and dynamic fraud classification with visual feedback.",
      tech: ["Python", "Streamlit", "Jupyter Notebook","Scikit-learn", "Pandas", "NumPy"],
      status: "Completed",
      link: "https://github.com/poncema4/Fraud-Detection-System"
    },
    {
      title: "Puzzle-API",
      description: "Generate a puzzle image of the user's input description with their desired dimensions and having to solve the scrambled puzzle.",
      tech: ["Java", "Microsoft Azure", "Okio", "OkHttp"],
      status: "Completed",
      link: "https://github.com/poncema4/Puzzle-API"
    },
    {
      title: "Canvas-API",
      description: " Automated interaction with Canvas LMS and OpenAI’s API to generate responses based on document and text content posted by professors on Canvas.",
      tech: ["Java", "Canvas API", "OpenAI API"],
      status: "Completed",
      link: "https://github.com/poncema4/OpenAI-API"
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
