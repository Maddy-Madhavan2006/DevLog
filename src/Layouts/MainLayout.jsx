import { Outlet } from "react-router-dom";

import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;