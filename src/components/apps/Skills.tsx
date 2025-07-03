export const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"]
    },
    {
      title: "Backend",
      skills: ["Python", "Java", "Assembly", "Racket"]
    },
    {
      title: "AI / ML",
      skills: ["LangChain", "PyTorch", "Pandas", "NumPy", "FastAPI", "Django"]
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Supabase", "Redis", "SQLite3"]
    },
  ];

  return (
    <div className="p-6 text-white min-h-full">
      <h2 className="text-2xl font-bold mb-6 text-primary">Skills & Technologies</h2>
      <div className="space-y-6">
        {skillCategories.map((category, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-primary">{category.title}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
