"use client"; // This is a Client Component

import { Box, Flex, Spinner, Button, Text, SimpleGrid, HStack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { PiChatTeardropDots, PiPencilSimpleLineLight } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { Lexend, Manrope, Montserrat } from "next/font/google"
import { cn } from "@/lib/utils";
const manrope = Manrope({ weight: '800', subsets: ["latin"] });
const LexendFont = Lexend({ weight: '700', subsets: ['latin'] })
const MonsterratFont = Montserrat({ weight: '400', subsets: ["latin"] })

function ColorPalette({ colors }: { colors: string[] }) {
  return (
      <Box className="rounded-md overflow-hidden">
          <Flex flexDir="row" alignItems="stretch">
              {colors.map((color) => (
                  <Box
                      key={color}
                      bg={color}
                      width="25px" /* Adjust for desired width of each color swatch */
                      height="25px"  /* Adjust for desired height of the palette */
                  > 
                  </Box>
              ))}
          </Flex>
      </Box>
  );
}

const OnbConfirmation = ({ apiStatus, dbUser }: { apiStatus: 'idle' | 'loading' | 'success' | 'error'; dbUser: any; }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  var [meta, setMeta] = useState({ age: "23", genderFemale: true, ethnicity: "Indian", bodyType: "hourglass", stylingSeason: "Warm Autumn", seasonColors: ["#87CEEB", "#ADD8E6", "#87CEFA", "#B0E0E6"], hairColor: "Black", irisColor: "Gray", skinTone: "#B0E0E6", dressingSize: "UK 14", height: "165 cm" });

  useEffect(() => {
    if (dbUser && dbUser.metaId) { // Check if metaId exists
        const fetchUserMeta = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/user/metas/${dbUser.metaId}`);
                if (response.ok) {
                    var loadedMeta = await response.json();
                    setMeta(loadedMeta)
                    console.log("loaded metas from dbUser");
                } else {
                    console.log("error in fetching metas");
                }
            } catch (error) {
                console.error("Error fetching user metas:", error);
            } finally {
                setIsLoading(false); // Stop loading in any case
            }
        };

        fetchUserMeta();
    } else {
        console.log("no metas from dbUser");
    }
}, [dbUser]);

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
          
            <Box shadow="xl"  mt="35vh" mx="3vw" p="10px" className="flex flex-col items-center justify-center" rounded="lg">
            <Text mb={10} mt="5vh" fontSize="24px" fontWeight="bold" align="center" color="#7E43AB">
              All Set!
            </Text>
            <Flex flexDir="row" className="ml-[5.3vw] mr-[10.5vw] mt-[1.7vh]" justify="space-between" alignItems="baseline">
                        <span className={cn(LexendFont.className, "font-bold text-[18px]")}>Season Profile</span>
                        <PiPencilSimpleLineLight className="ml-[6.4vw]" size={22} strokeWidth={2} color="#171A1FFF"/>
                    </Flex>
                    <Flex flexDir="column" mx="5.8vw" mt="1.7vh" mb="2.5vh" alignContent="start" alignItems="start">
                        <span className={cn(MonsterratFont.className, "text-[14px] text-[#171A1FFF] h-[22px] mt-[0.5vh] mb-[0.5vh] text-left")}>
                            Suggested Colors To Wear
                        </span>
                        <ColorPalette colors={meta.seasonColors} />
                    </Flex>
            </Box>
            <PiChatTeardropDots height="10vh" size="100px" color="#C4EB5F"  />
            <Button mt={3} onClick={() => router.push("/dashboard")} className='rounded-2xl h-10 bg-[#C4EB5F] mx-2' variant='outline'>
            <span className={cn(manrope.className, ' text-[24px] text-[#485F0C]')}> Ask Coco! </span>
            </Button>
          </>
        ) : ( // apiStatus === "error"
          <Text color="red.500">There was an error. Please try again.</Text>
        )
      )}
    </Flex>
  );
};

export default OnbConfirmation;
