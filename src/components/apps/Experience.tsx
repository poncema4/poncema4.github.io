export const Experience = () => {
  const experiences = [
    {
      title: "AI Engineer & Software Developer Intern",
      company: "Reality AI Lab",
      period: "May 2025 – Present",
      description: "Building LLM-powered educational tools and backend services using Python, LangChain, and Google Cloud Run.",
      achievements: [
        "Developed 'Marvel AI' – an AI teaching assistant to improve student query handling",
        "Integrated LangChain, Redis, and cloud-native services for real-time LLM apps",
        "Collaborated cross-functionally to scale tools for research and production"
      ]
    },
    {
      title: "Software Engineer",
      company: "Nobile Tech",
      period: "Aug 2022 – Present",
      description: "Designed scalable infrastructure for game servers and launched web platforms for high-profile clients.",
      achievements: [
        "Deployed 300+ custom Java-based game servers serving 2,500+ concurrent users",
        "Launched 20+ client websites and e-commerce platforms using XenForo and SEO strategy",
        "Secured partnerships with multi-million dollar brands and influencers (27M+ combined reach)"
      ]
    },
    {
      title: "Research Assistant",
      company: "Seton Hall University",
      period: "Sept 2024 – May 2025",
      description: "Worked with Prof. Jason Hemann on logic programming and algorithmic research using Racket.",
      achievements: [
        "Explored graph coloring via miniKanren and faster-miniKanren",
        "Implemented and benchmarked Greedy and Backtracking algorithms",
        "Contributed to academic tools in logic and functional programming"
      ]
    },
    {
      title: "Computer Science Tutor / TA",
      company: "Seton Hall University",
      period: "Aug 2024 – May 2025",
      description: "Supported Intro to Programming I & II courses focused on Racket and functional programming.",
      achievements: [
        "Helped students improve average grades by 13% across sections",
        "Led workshops and office hours for debugging, recursion, and logic design",
        "Worked closely with the MLL program to reinforce fundamental CS concepts"
      ]
    }
  ];

  return (
    <div className="p-6 text-white min-h-full">
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