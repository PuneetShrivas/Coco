"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavbar from "./BottomNavbar";
import Profile from "./Profile";
import ComingSoon from "./ComingSoon";
import AskCoco from "./AskCoco";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation"; 

type DashboardProps = {
  user: KindeUser | null;
  dbUser: any;
  isLoggedIn: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({
  user,
  dbUser,
  isLoggedIn,
}) => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Ask Coco");

  const handleInteraction = (loggedInAction?: () => void) => { // loggedInAction is now optional
    if (!isLoggedIn) {
      router.push("/sign-in");
    } else if (loggedInAction) { // Only call loggedInAction if it's provided
      loggedInAction();
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Coming Soon":
        return <ComingSoon/>; 
      case "Ask Coco":
        return (
          <AskCoco
            user={user}
            dbUser={dbUser}
            isLoggedIn={isLoggedIn}
            onRequireLogin={handleInteraction}
          />
        );
        case "Profile":
          return (
            <Profile
              user={user}
              dbUser={dbUser}
              isLoggedIn={isLoggedIn}
              onRequireLogin={handleInteraction} 
            />
          );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNavbar
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />
    </div>
  );
};

export default Dashboard;
