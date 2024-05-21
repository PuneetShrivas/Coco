'use client';
import { Navigation, MessageCircleCode, CircleUser } from 'lucide-react';
import { HStack, Button, Icon, Text, Box, useColorModeValue } from '@chakra-ui/react';

interface BottomNavbarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const BottomNavbar = ({ onSectionChange, activeSection }: BottomNavbarProps) => {
  const navLinks = [
    { name: 'Coming Soon', icon: Navigation },
    { name: 'Ask Coco', icon: MessageCircleCode },
    { name: 'Profile', icon: CircleUser },
  ];
  const activeBg = useColorModeValue("#EAD8F8", "#EAD8F8");
  const inactiveBg = useColorModeValue("gray.100", "gray.600");
  const ellipsisBg = useColorModeValue("#2F2F2F", "#2F2F2F");

  return (
    <Box position="fixed" bottom={0} left={0} right={0} zIndex={30} p={4} overflowX="hidden"> 
      <HStack justifyContent="space-around" position="relative"> {/* Make HStack relative */}
        <Box 
          position="absolute"
          top={-4}       // Adjust to create a border-like effect
          left={-4}
          right={-4}
          bottom={-4}   // Adjust to create a border-like effect
          bgColor={ellipsisBg}
          mx={5}
          my={2}
          borderRadius="full"
          zIndex={-1}    // Behind the buttons
          pointerEvents="none" // Prevent click interactions
        />
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const isActive = activeSection === link.name;

          return (
            <div key={link.name} >
              <Button
                variant="ghost"
                onClick={() => onSectionChange(link.name)}
                bgColor={inactiveBg} 
                borderRadius="full"
                justifyContent={isActive ? "start" : "center"}
                px={isActive ? 3 : 2} 
              >
                <Icon as={IconComponent} strokeWidth={1.1} boxSize={isActive ? 5 : 4} color={isActive ? "black" : "gray.500"} mr={isActive ? 2 : 0} /> 
                {isActive && <Text fontSize="sm">{link.name}</Text>}
              </Button>
            </div>
          );
        })}
      </HStack>
    </Box>
  );
};

export default BottomNavbar;
