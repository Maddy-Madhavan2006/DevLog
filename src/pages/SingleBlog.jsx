import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { CalendarDays, Clock, Pencil } from "lucide-react";

const SingleBlog = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 📦 FETCH BLOG
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}`);

        if (!response.ok) {
          throw new Error("Blog not found");
        }

        const data = await response.json();

        setBlog(data);
      } catch (error) {
        console.error(error);

        setBlog({
          id,
          title: "Blog Not Found",
          category: "Technology",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          content:
            "This is fallback content. Backend did not return a valid blog.",
          author: "Admin",
          createdAt: "May 2026",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading Blog...</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
      </div>
    );
  }

  // 🔐 ownership check (IMPORTANT)
  const isOwner =
  user &&
  blog &&
  String(user.id) === String(blog.user_id);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* CATEGORY */}
        <span className="inline-flex px-4 py-2 rounded-full border bg-muted text-sm">
          {blog.category}
        </span>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          {blog.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <span>By {blog.author || "Admin"}</span>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{blog.createdAt || "May 2026"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>
        </div>

        {/* 🔥 EDIT BUTTON (ONLY OWNER SEES IT) */}
        {isOwner && (
          <Link to={`/blog/edit/${blog.id}`}>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-border bg-background text-foreground cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-[1.02]">
              <Pencil className="w-4 h-4" />
              Edit Blog
            </button>
          </Link>
        )}

        {/* IMAGE */}
        <div className="mt-10 overflow-hidden rounded-3xl border">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* CONTENT */}
        <article className="mt-12 prose max-w-none">
          <p>{blog.content}</p>
        </article>
      </div>
    </section>
  );
};

export default SingleBlog;
