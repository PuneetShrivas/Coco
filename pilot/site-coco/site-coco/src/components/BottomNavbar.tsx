'use client';
import { PiChatTeardropDots, PiNavigationArrow } from "react-icons/pi";
import { HStack, Button, Icon, Box, useColorModeValue } from '@chakra-ui/react';
import { CircleUser } from "lucide-react";
import { useState, useEffect } from 'react';

interface BottomNavbarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const BottomNavbar = ({ onSectionChange, activeSection }: BottomNavbarProps) => {
  const [clickedSection, setClickedSection] = useState<string | null>(null);

  const navLinks = [
    { name: 'Coming Soon', icon: PiNavigationArrow },
    { name: 'Ask Coco', icon: PiChatTeardropDots },
    { name: 'Profile', icon: CircleUser },
  ];

  const activeBg = useColorModeValue("#FFFFFF", "#FFFFFF");
  const inactiveBg = useColorModeValue("#7E43AB", "#7E43AB");

  const handleInteraction = (linkName: string) => {
    onSectionChange(linkName);
    setClickedSection(linkName);
  };

  useEffect(() => {
    setClickedSection(null);
  }, [activeSection]);

  return (
    <Box position="fixed" bottom={0} left={0} right={0} zIndex={30} px={10}  py={2} bg={activeBg} shadow="md">
      <HStack justifyContent="space-around" alignItems="center" spacing={4} mb={3}>
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const isActive = link.name === clickedSection || link.name === activeSection;

          return (
            <Button
              key={link.name}
              variant="ghost"
              onClick={() => handleInteraction(link.name)}
              onTouchStart={(e) => {
                e.preventDefault(); // Prevent potential ghost clicks
                handleInteraction(link.name);
              }}
              bgColor={isActive ? activeBg : inactiveBg}
              borderRadius="full"
              w="12"
              h="12"
              justifyContent="center"
              // _hover={{ transform: "scale(1.1)", bg: inactiveBg }}
            >
              <Icon
                as={IconComponent}
                boxSize={isActive ? 14 : 7}
                color={isActive ? "#C4EB5F" : "#FFFFFF"}
              />
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
};

export default BottomNavbar;
