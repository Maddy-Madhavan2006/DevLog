const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-10 text-center">

      {/* Title */}
      <h1 className="text-5xl font-bold tracking-tight">
        About DevLog
      </h1>

      {/* Intro */}
      <p className="text-muted-foreground leading-7 text-lg">
        DevLog is a modern blogging platform built for developers and creators
        to share ideas, tutorials, and knowledge in a clean and distraction-free reading experience.
      </p>

      {/* Extra Section */}
      <div className="space-y-6 text-left">

        <div>
          <h2 className="text-2xl font-semibold mb-2">🚀 Our Mission</h2>
          <p className="text-muted-foreground leading-7">
            To empower developers and creators by providing a simple and fast platform
            to publish and share meaningful content with the world.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">💡 What You Can Do</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2">
            <li>Read high-quality tech blogs</li>
            <li>Create and publish your own articles</li>
            <li>Edit and manage your content easily</li>
            <li>Explore modern web development topics</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">⚡ Built For Developers</h2>
          <p className="text-muted-foreground leading-7">
            DevLog is built using modern technologies like React, Tailwind CSS,
            and Node.js, focusing on performance, scalability, and clean UI design.
          </p>
        </div>

      </div>

    </div>
  );
};

export default About;