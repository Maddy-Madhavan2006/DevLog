import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  Home,
  BookOpen,
  Info,
  Mail,
  PlusCircle,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // AUTH CONTEXT
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  };

  // ⭐ ONLY NEW ADDITION (NAV STYLE)
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-md"
        : "hover:bg-primary/10 hover:text-primary"
    }`;

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl border hover:bg-accent transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="text-2xl font-black tracking-tight">
              DevLog
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {user ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl border bg-card text-sm font-medium">
                  {user.name}
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>

                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}

          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          open ? "visible bg-black/50" : "invisible bg-black/0"
        }`}
      >
        <aside
          className={`fixed left-0 top-0 h-full w-80 bg-background border-r shadow-2xl p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* TOP */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black">Menu</h2>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl border hover:bg-accent transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAV */}
          <nav className="space-y-3">

            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <Home className="w-5 h-5" />
              Home
            </NavLink>

            <NavLink
              to="/blogs"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <BookOpen className="w-5 h-5" />
              My Blogs
            </NavLink>

            {user && (
              <NavLink
                to="/add-blog"
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                <PlusCircle className="w-5 h-5" />
                Add Blog
              </NavLink>
            )}

            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <Info className="w-5 h-5" />
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <Mail className="w-5 h-5" />
              Contact
            </NavLink>

          </nav>

          {/* BOTTOM */}
          <div className="absolute bottom-8 left-6 right-6">

            {user ? (
              <Button
                variant="destructive"
                className="w-full rounded-xl h-11"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full rounded-xl" variant="outline">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="w-full rounded-xl">
                    Register
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;