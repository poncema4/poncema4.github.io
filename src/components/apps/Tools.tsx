export const Tools = () => {
  const toolCategories = [
    {
      title: "Development",
      tools: [
        { name: "VS Code", description: "Primary code editor" },
        { name: "Git", description: "Version control" },
        { name: "Docker", description: "Containerization" },
        { name: "Postman", description: "API testing" }
      ]
    },
    {
      title: "Design",
      tools: [
        { name: "Figma", description: "UI/UX design" },
        { name: "Adobe XD", description: "Prototyping" },
        { name: "Photoshop", description: "Image editing" },
        { name: "Illustrator", description: "Vector graphics" }
      ]
    },
    {
      title: "Deployment",
      tools: [
        { name: "Vercel", description: "Frontend deployment" },
        { name: "AWS", description: "Cloud services" },
        { name: "Heroku", description: "App hosting" },
        { name: "Netlify", description: "Static sites" }
      ]
    }
  ];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-primary">Development Tools</h2>
      <div className="space-y-6">
        {toolCategories.map((category, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-3 text-primary">{category.title}</h3>
            <div className="grid grid-cols-1 gap-3">
              {category.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{tool.name}</span>
                    <span className="text-sm text-gray-400">{tool.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};