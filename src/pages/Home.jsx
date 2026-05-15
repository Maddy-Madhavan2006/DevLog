import { useEffect, useState } from "react";

import BlogCard from "@/components/custom/Blogcard";
import Loader from "@/components/custom/Loader";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ALL BLOGS FROM BACKEND
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        setBlogs(data); // show ALL blogs

      } catch (error) {
        console.error(error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-16">

      {/* HERO */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Share Ideas That Matter
        </h1>

        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
          A modern blog platform built with React, Tailwind and shadcn/ui.
        </p>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {blogs.length > 0 ? (
          blogs.map((b) => (
            <BlogCard
              key={b.id}
              id={b.id}
              title={b.title}
              desc={b.content || b.desc}
              image={b.image}
              readOnly={true}   // 🔥 important flag
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No blogs available
          </p>
        )}

      </section>

    </div>
  );
};

export default Home;