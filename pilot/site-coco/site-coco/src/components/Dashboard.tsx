"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavbar from './BottomNavbar';
import Profile from './Profile';
import ComingSoon from './ComingSoon';
import AskCoco from './AskCoco';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import mixpanel from "mixpanel-browser";

const Dashboard = ({ user, dbUser }: { user: KindeUser | null, dbUser: any }) => {
  const [activeSection, setActiveSection] = useState('Ask Coco'); // Start with dashboard active
  const renderContent = () => {
    switch (activeSection) {
      case 'Coming Soon':
        return <ComingSoon />;
      case 'Ask Coco':
        return <AskCoco user={user} dbUser={dbUser} />;
      case 'Profile':
        return <Profile user={user} dbUser={dbUser} />;
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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNavbar onSectionChange={setActiveSection} activeSection={activeSection} />
    </div>
  );
};


export default Dashboard;
