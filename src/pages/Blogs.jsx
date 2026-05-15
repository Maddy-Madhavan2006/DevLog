import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import BlogCard from "@/components/custom/BlogCard";
import Loader from "@/components/custom/Loader";

import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const Blogs = () => {
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔐 AUTH CHECK (FIXED)
  if (!user || !token) {
    return (
      <div className="text-center py-32">
        <h1 className="text-3xl font-bold">No Blogs Found</h1>
        <p className="text-muted-foreground mt-3">
          Please login to view and manage your blogs.
        </p>
      </div>
    );
  }

  // 📦 FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs/my-blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          toast.error("Failed to fetch blogs");
          throw new Error("Fetch failed");
        }

        const data = await response.json();

        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error(error);
        setBlogs([]);
        setFilteredBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  // 🔍 SEARCH FILTER
  useEffect(() => {
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredBlogs(filtered);
  }, [search, blogs]);

  // 🗑 DELETE BLOG
  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Delete this blog?</p>

          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 rounded bg-gray-200"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 rounded bg-red-500 text-white"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/blogs/${id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  if (!response.ok) {
                    throw new Error();
                  }

                  setBlogs((prev) => {
                    const updated = prev.filter((b) => b.id !== id);
                    setFilteredBlogs(updated);
                    return updated;
                  });

                  toast.success("Blog deleted successfully");
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to delete blog");
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
      },
    );
  };

  // ⏳ LOADING STATE
  if (loading) {
    return <Loader />;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            My Blogs
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your published blogs, edit your content, and continue sharing
            your ideas.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search your blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-xl"
          />
        </div>

        {/* BLOG LIST */}
        {filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                desc={blog.content}
                image={blog.image}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border rounded-2xl bg-muted/20">
            <h2 className="text-2xl font-semibold">
              You haven't started blogging yet
            </h2>

            <p className="text-muted-foreground mt-3">
              Create your first blog and share your ideas with the world.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
