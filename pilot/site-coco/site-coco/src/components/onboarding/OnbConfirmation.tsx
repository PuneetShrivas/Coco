"use client"; // This is a Client Component

import { Box, Flex, Spinner, Button, Text, SimpleGrid, HStack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { PiChatTeardropDots, PiPencilSimpleLineLight } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { Lexend, Manrope, Montserrat } from "next/font/google"
import { cn } from "@/lib/utils";
import CircularImageWithRing from "../CircularImageWithRing";
import AskCoco from './../AskCoco';
import mixpanel from "mixpanel-browser";
const manrope = Manrope({ weight: '800', subsets: ["latin"] });
const manropeBold = Manrope({ weight: '800', subsets: ["latin"] });
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
            width="6.3vw" /* Adjust for desired width of each color swatch */
            height="25px"  /* Adjust for desired height of the palette */
          >
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

function capitalizeWord(word: string) {
  if (!word) return word; // Handle empty input
  return word.charAt(0).toUpperCase() + word.slice(1);
}



const OnbConfirmation = ({ apiStatus, dbUser }: { apiStatus: 'idle' | 'loading' | 'success' | 'error'; dbUser: any; }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [localBaseImageURL, setLocalBaseImageURL] = useState<string>("");
  const [metasLoaded, setMetasLoaded] = useState(false);
  var [meta, setMeta] = useState({ age: "23", genderFemale: false, ethnicity: "Indian", bodyType: "hourglass", stylingSeason: "Warm Autumn", seasonColors: ["#87CEEB", "#ADD8E6", "#87CEFA", "#B0E0E6"], hairColor: "Black", irisColor: "Gray", skinTone: "#B0E0E6", dressingSize: "UK 14", height: "165 cm" });
  
  const setmetas= async()=>{
    console.log("setMetas started")
    if (dbUser) { 
      const fetchUserMeta = async () => {
        setIsLoading(true);
        try {
          let localMetas;
          let localImageURL;
          console.log(!localMetas);
          while (!metasLoaded) {
            await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200 milliseconds
            localMetas = JSON.parse(localStorage.getItem("metas") ?? ""); 
            localImageURL = JSON.parse(localStorage.getItem("baseImageURL") ?? ""); 
            if( localMetas.hasOwnProperty('seasonColors')){
              setMetasLoaded(true);
              setLocalBaseImageURL("https://coco-ai-images.s3.amazonaws.com/"+localImageURL);
              setMeta(localMetas);
            }
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
  }

  useEffect(() => {
    setmetas();
  });
  

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
          { !isLoading ? (<>
            <Box mt="35vh" mx="3vw" p="10px" className="flex flex-col items-center justify-center" rounded="lg">
              <Flex flexDir="column">
              <Text mb={2} mt="5vh" fontSize="24px" fontWeight="bold" align="center" color="#7E43AB">
                All Set!
              </Text>
              <Text mb={2} px="5vw" fontSize="16px" align="left" color="#7E43AB">
                We detected the following features from your photo:
              </Text>
              </Flex>
              <Flex flexDir="row">
                <div className="ml-[8.5vw] mt-[4.4vh]">
                    <CircularImageWithRing src={dbUser ? localBaseImageURL : "/image1.jpg"} alt="userimage" ringColor="#C4EB5F55" ringSize={5} />
                </div>
                <div>
                    <Flex flexDir="column" className="ml-[6.4vw] mt-[7.1vh]">
                        
                        <div className="flex flex-col">
                            <span className={cn(manrope.className, "font-thin text-[16px] text-[#7D5F95]")}>{meta?.age}, {meta?.genderFemale ? <span>Female</span> : <span>Male</span>}</span>
                            <span className={cn(manrope.className, "font-thin text-[16px] text-[#7D5F95]")}>Ethnicity: {meta?.ethnicity}</span>
                        </div>
                    </Flex>
                </div>
            </Flex>

            <Box className=" mx-[6.9vw] bg-white h-full mt-[2vh] rounded-xl" shadow="2xl">
                <Flex flexDir="column" >
                    <Flex flexDir="row" className="ml-[5.3vw] mr-[10.5vw] mt-[1.7vh]" justify="space-between" alignItems="baseline">
                        <span className={cn(LexendFont.className, "font-bold text-[18px]")}>Season Profile</span>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="2.5vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Your Season</span>
                        <Button variant="solid" width="auto" height="4vh" bgColor="#E6F6BE" color="#485F0C" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {meta.stylingSeason}</span> </Button>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-black h-[22px]")}>Hair Color</span>
                        <Button variant="solid" width="auto" height="4vh" bgColor="gray.400" color="black" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {capitalizeWord(meta.hairColor)} </span> </Button>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Eye Color</span>
                        <Button variant="solid" width="auto" height="4vh" bgColor="#C6ADDA" color="#7E43AB" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {capitalizeWord(meta.irisColor)}</span> </Button>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Skin Tone</span>
                        <Button variant="solid" width="35.89vw" height="4vh" bgColor={meta.skinTone} color="#7E43AB" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> </span> </Button>
                    </Flex>
                    <Flex flexDir="column" mx="5.8vw" mt="1.7vh" mb="2.5vh" alignContent="start" alignItems="start">
                        <span className={cn(MonsterratFont.className, "text-[14px] text-[#171A1FFF] h-[22px] mt-[0.5vh] mb-[0.5vh] text-left")}>
                            Suggested Colors To Wear
                        </span>
                        <ColorPalette colors={meta.seasonColors} />
                    </Flex>
                </Flex>
            </Box>
            </Box>
            <Flex flexDir="row" align="end" alignItems="end" alignContent="end" >
            <Button mt={3} onClick={() => router.push("/dashboard")} rounded="full" className='rounded-full h-10 w-24 bg-[#C4EB5F] mx-2' variant='outline'>
            <span className={cn(manrope.className, 'text-xs text-[14px] text-[#485F0C]')}> AskCoco </span>
          </Button>
            </Flex>
          </>) : (<Text color="purple.200">Loading ...</Text>) }
          </>
          
        ) : ( // apiStatus === "error"
          <Text color="red.500">There was an error. Please try again.</Text>
        )
      )}
    </Flex>
  );
};

export default OnbConfirmation;
