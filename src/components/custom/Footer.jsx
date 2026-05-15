const Footer = () => {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center space-y-3">

        <h2 className="text-lg font-semibold">
          DevLog
        </h2>

        <p className="text-sm text-gray-500">
          A simple modern blog for writing and sharing ideas
        </p>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} DevLog. All rights reserved
        </p>

      </div>
    </footer>
  );
};

export default Footer;