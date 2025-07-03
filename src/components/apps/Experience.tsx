export const Experience = () => {
  const experiences = [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      period: "2022 - Present",
      description: "Leading frontend development projects using React and TypeScript. Collaborated with design teams to implement pixel-perfect UI components.",
      achievements: [
        "Increased application performance by 40%",
        "Led a team of 4 junior developers",
        "Implemented CI/CD pipelines"
      ]
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2021 - 2022",
      description: "Developed responsive web applications for various clients. Specialized in React ecosystem and modern CSS frameworks.",
      achievements: [
        "Delivered 15+ client projects",
        "Reduced page load times by 60%",
        "Mentored 2 intern developers"
      ]
    },
    {
      title: "UI/UX Designer",
      company: "Startup Hub",
      period: "2020 - 2021",
      description: "Designed user interfaces and experiences for web and mobile applications. Conducted user research and usability testing.",
      achievements: [
        "Improved user satisfaction by 35%",
        "Created design system for 10+ products",
        "Conducted 50+ user interviews"
      ]
    }
  ];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-primary">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-primary pl-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                <span className="text-sm text-primary font-medium">{exp.period}</span>
              </div>
              <h4 className="text-primary mb-3">{exp.company}</h4>
              <p className="text-gray-300 mb-4">{exp.description}</p>
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Key Achievements:</h5>
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="text-sm text-gray-300 flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};