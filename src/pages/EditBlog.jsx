import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BlogForm from "@/components/custom/BlogForm";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);

  const token = localStorage.getItem("token");

  // 📦 FETCH BLOG
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/blogs/${id}`
        );

        if (!res.ok) throw new toast.error("Blog not found");

        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
        setBlog(null);
      }
    };

    fetchBlog();
  }, [id]);

  // ✏️ UPDATE BLOG
  const handleUpdateBlog = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();

      if (formData.title) payload.append("title", formData.title);
      if (formData.category) payload.append("category", formData.category);
      if (formData.content) payload.append("content", formData.content);

      // ✅ only send image if it's a new file
      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      if (!response.ok) {
        throw new toast.error("Failed to update blog");
      }

      await response.json();

      toast.success("Blog updated successfully ✅");

      navigate(`/blog/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog ❌");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ AUTH CHECK (AFTER HOOKS)
  if (!user) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-4xl font-bold">Login Required</h1>
        <p className="text-muted-foreground mt-4">
          You must login to edit blogs.
        </p>
      </div>
    );
  }

  // ⏳ LOADING
  if (!blog) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-4xl font-bold">Loading Blog...</h1>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <BlogForm
        type="edit"
        initialData={blog}
        onSubmit={handleUpdateBlog}
        loading={loading}
      />
    </section>
  );
};

export default EditBlog;