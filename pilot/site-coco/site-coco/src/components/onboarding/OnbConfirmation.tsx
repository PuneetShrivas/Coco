"use client"; // This is a Client Component

import { Box, Flex, Spinner, Button, Text, SimpleGrid, HStack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { PiChatTeardropDots } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { Manrope } from "next/font/google"
import { cn } from "@/lib/utils";
const manrope = Manrope({ weight: '800', subsets: ["latin"] });


const OnbConfirmation = ({ apiStatus, dbUser }: { apiStatus: 'idle' | 'loading' | 'success' | 'error'; dbUser: any; }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState<'loading' | 'success' | 'error'>('loading');

  

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      h="60vh" 
    >
      {apiStatus === 'loading' ? (
        <>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="purple.500"
            size="xl" 
          />
          <Text mt={4}>Setting things up for you!</Text>
        </>
      ) : (
        apiStatus === "success" ? (
          <>
          <Text mt="35vh" mb={10} fontSize="24px" fontWeight="bold" color="#7E43AB">
              All Set!
            </Text>

            
            <PiChatTeardropDots size="100px" color="#C4EB5F"  />
            
            <Button mt={3} onClick={() => router.push("/dashboard")} className='rounded-2xl h-10 bg-[#C4EB5F] mx-2' variant='outline'>
            <span className={cn(manrope.className, ' text-[24px] text-[#485F0C]')}> Ask Coco! </span>
            </Button>
            <Text mt="2vh" mb="2vh" mx="3vw" fontSize="14px" fontWeight="normal" color="gray" textAlign="center">
              Check the profile section for your styling season and suggested colors
            </Text>
          </>
        ) : ( // apiStatus === "error"
          <Text color="red.500">There was an error. Please try again.</Text>
        )
      )}
    </Flex>
  );
};

export default OnbConfirmation;
