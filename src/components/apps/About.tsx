export const About = () => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-primary">About Me</h2>
      <div className="space-y-4">
        <p className="text-gray-300">
          Hi! I'm Marco Ponce, a passionate Software Engineer and UI/UX Designer with over 2.5 years of experience creating beautiful and functional digital experiences.
        </p>
        <p className="text-gray-300">
          I specialize in building modern web applications using cutting-edge technologies like React, TypeScript, and Node.js, while also focusing on creating intuitive user interfaces and experiences.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-primary">Quick Facts</h3>
          <ul className="space-y-2 text-gray-300">
            <li>🌟 Software Engineer by day, UI/UX developer by night</li>
            <li>💻 Full-stack development enthusiast</li>
            <li>🎨 Passionate about design and user experience</li>
            <li>🚀 Always learning new technologies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};