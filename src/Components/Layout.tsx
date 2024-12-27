// import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="fixed z-20 pt-1 pl-1 pb-4 left-0 top-0 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-600 "
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <div className="w-full h-screen flex flex-col md:flex-row ">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div
          className={`fixed md:sticky z-50 inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-1/5`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="p-4 2xl:px-10 w-full h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
