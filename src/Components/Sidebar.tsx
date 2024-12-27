import React from "react";
import { ChevronRight, X } from "lucide-react";
import {
  Home,
  Store,
  Package,
  BookOpen,
  PieChart,
  FileText,
  Settings,
} from "lucide-react";

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Home" },
  { icon: Store, label: "Stores" },
  { icon: Package, label: "Products", active: true },
  { icon: BookOpen, label: "Catalogue" },
  { icon: PieChart, label: "Promotions" },
  { icon: FileText, label: "Reports" },
  { icon: FileText, label: "Docs" },
  { icon: Settings, label: "Settings" },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <div className="w-full  h-full flex flex-col gap-6 p-5 border-r-2">
      <div className="flex justify-between items-center p-6 border-b">
        <img src="./lemon.png" alt="Logo" className="h-10 w-auto rounded-md" />
        {/* Close Button */}
        {isOpen && (
          <button onClick={onClose} className="text-gray-600 ">
            <X className="h-6 w-6 lg:hidden" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto ">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium
                ${
                  item.active
                    ? "bg-[#ECF7FF] text-[#1F8CD0]"
                    : "text-gray-600 hover:bg-gray-100"
                }
              ${!item.active ? "cursor-not-allowed" : ""}
                `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className=" border-t ">
        <div className="p-2 w-full">
          <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            <img
              src="./Andy.png"
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Andy Samberg
              </p>
              <p className="text-xs text-gray-500 truncate">
                andy.samberg@gmail.com
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
