"use client";

import { CircleArrowOutUpRight, MessageCircleHeart, CircleUser } from "lucide-react";

interface BottomNavbarProps {
    onSectionChange: (section: string) => void;
    activeSection: string;
  }
  
const BottomNavbar = ({ onSectionChange, activeSection }: BottomNavbarProps) => {
  const navLinks = [
    { name: 'Coming Soon', icon: CircleArrowOutUpRight },
    { name: 'Ask Coco', icon: MessageCircleHeart },
    { name: 'Profile', icon: CircleUser },
  ];

  return (
    <nav className="sticky h-14 inset-x-0 bottom-0 z-30 w-full border-t bg-white dark:bg-gray-900 p-4 flex justify-around">
      {navLinks.map((link) => {
        const IconComponent = link.icon;
        const isActive = activeSection === link.name;

        return (
          <button 
            key={link.name}
            className="flex flex-col items-center" 
            onClick={() => onSectionChange(link.name)} // Trigger section change
          >
            <IconComponent
              className={`h-6 w-6 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`} 
            />
            <span className="text-xs text-gray-500 dark:text-gray-400"></span> 
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;
