export const About = () => {
  return (
    <div className="p-6 text-white min-h-full">
      <img
        src="/icons/about-me.png"
        alt="Marco Ponce"
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary object-cover"
      />
      <h2 className="text-2xl font-bold mb-4 text-primary text-center">About Me</h2>
      <div className="space-y-4">
        <p className="text-gray-300">
          Hello! I'm Marco Ponce, a Software Engineer and ML/AI Engineer with over 6+ years of experience who enjoys working with scalable, intelligent systems that solve real-world problems.
        </p>
        <p className="text-gray-300">
          I specialize in building intelligent, full-stack applications with a strong foundation in Python. I use modern frameworks like React and TypeScript on the frontend, and tools like LangChain, FastAPI, and PyTorch to develop scalable, LLM-powered systems.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-primary">Quick Facts</h3>
          <ul className="space-y-2 text-gray-300">
            <li>▪️ Prioritizing readability, scalability, and clear documentation</li>
            <li>▪️ Strong understanding in modern web technologies</li>
            <li>▪️ I adapt quickly to new tools, languages, and frameworks as needed</li>
            <li>▪️ Always learning new technologies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};