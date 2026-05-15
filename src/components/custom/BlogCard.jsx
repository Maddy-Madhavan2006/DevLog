import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const BlogCard = ({
  id,
  title,
  desc,
  image,
  onDelete,
  readOnly = false, // ✅ important default
}) => {

  const handleDelete = async () => {
  try {
    if (onDelete) {
      await onDelete(id);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300">

      {/* IMAGE (safe fallback) */}
      <div className="overflow-hidden">
        <img
          src={image || "/placeholder.jpg"} // ✅ prevents blank src error
          alt={title || "Blog image"}
          className="h-60 w-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">

        <h2 className="text-2xl font-bold leading-tight">
          {title}
        </h2>

        <p className="text-muted-foreground leading-7 line-clamp-3">
          {desc}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 pt-2">

          {/* READ MORE (always visible) */}
          <Link to={`/blog/${id}`}>
            <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              Read More
            </button>
          </Link>

          {/* EDIT + DELETE (only when NOT readOnly) */}
          {!readOnly && (
            <>
              <Link to={`/blog/edit/${id}`}>
                <button className="p-2 rounded-xl border border-border hover:bg-accent transition">
                  <Pencil className="w-4 h-4" />
                </button>
              </Link>

              <button
                onClick={handleDelete}
                className="p-2 rounded-xl border border-border text-red-500 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default BlogCard;