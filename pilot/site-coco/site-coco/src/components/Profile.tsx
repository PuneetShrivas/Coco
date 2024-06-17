"use client"

import { Box, Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { User } from "lucide-react";
import { IN } from 'country-flag-icons/react/3x2'
import { Inter, Lexend, Manrope, Montserrat } from "next/font/google";
import { CircleUser } from "lucide-react";

import config from './../../tailwind.config';
import { cn } from "@/lib/utils";
import CircularImageWithRing from './CircularImageWithRing';
import { PiPencilSimpleLineLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import mixpanel from "mixpanel-browser";

const interFont = Inter({ subsets: ['latin'] });
const LexendFont = Lexend({ weight: '700', subsets: ['latin'] })
const manrope = Manrope({ weight: '400', subsets: ["latin"] })
const manropeBold = Manrope({ weight: '800', subsets: ["latin"] })
const MonsterratFont = Montserrat({ weight: '400', subsets: ["latin"] })

function capitalizeWord(word: string) {
    if (!word) return word; // Handle empty input
    return word.charAt(0).toUpperCase() + word.slice(1);
}


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

const Profile = ({
    user, dbUser
}: {
    user: KindeUser | null,
    dbUser: any
}) => {
    const router = useRouter();
    const imageUrl = user?.picture
    var [meta, setMeta] = useState({ age: "23", genderFemale: true, ethnicity: "Indian", bodyType: "hourglass", stylingSeason: "Warm Autumn", seasonColors: ["#87CEEB", "#ADD8E6", "#87CEFA", "#B0E0E6"], hairColor: "Black", irisColor: "Gray", skinTone: "#B0E0E6", dressingSize: "UK 14", height: "165 cm" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || "", { debug: true, track_pageview: true, persistence: 'localStorage' });
        mixpanel.track('profile_view');
        mixpanel.identify(user?.id);
        mixpanel.people.set({
            '$name':user?.given_name?.concat(" ",user?.family_name||""),
            '$email':user?.email,
        });
      });
      
    const handleEditProfile = () => {
        onOpen();
    };

    const handleConfirmRestartOnboarding = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/onboarded', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isOnboarded: false }), // Send the updated flag
            });

            if (response.ok) {
                // Onboarding status updated successfully
                router.push('/dashboard/onboarding'); // Redirect to the onboarding flow
            } else {
                console.error('Failed to update onboarding status:', response.statusText);
                // Handle the error (e.g., show a toast notification)
            }
        } catch (error) {
            console.error("Error updating onboarding status:", error);
            // Handle the error (e.g., show a toast notification)
        } finally {
            setIsSubmitting(false);
            onClose(); // Close the modal
        }
    };

    return (
        <div className="bg-[#FFFFFF] relative">
            {isLoading && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(255, 255, 255, 0.7)" // Lighter white overlay (70% opacity)
                    backdropFilter="blur(5px)"    // Apply blur effect
                    display="flex"
                    justifyContent="center"
                    zIndex={2}
                >
                    <Spinner className='mt-[30vh]' size="xl" color="purple.500" />
                </Box>
            )}
            <h1 className={cn(LexendFont.className, "text-[28px] font-bold text-left text-[#7e43ab] ml-[5vw] mt-[12vh]")}>Hey, {user?.given_name}</h1>
            <h2 className={cn(LexendFont.className, "text-[20px] font-bold text-left text-[#171A1F] ml-[5vw] mt-[5px] tracking-tight")}>Welcome to your personal profile</h2>
            <Flex flexDir="row">
                <div className="ml-[8.5vw] mt-[4.4vh]">
                    <CircularImageWithRing src={dbUser ? dbUser?.baseImageURL : "/image1.jpg"} alt="userimage" ringColor="#C4EB5F55" ringSize={5} />
                </div>
                <div>
                    <Flex flexDir="column" className="ml-[6.4vw] mt-[7.1vh]">
                        <Flex flexDir="row">
                            <span className={cn(LexendFont.className, "font-bold text-[20px]")}>{user?.given_name}</span>
                            <PiPencilSimpleLineLight className="ml-[6.4vw] size-5" strokeWidth={2} color="#171A1FFF" onClick={handleEditProfile} />
                        </Flex>
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
                        <PiPencilSimpleLineLight className="ml-[6.4vw]" size={22} strokeWidth={2} color="#171A1FFF" onClick={handleEditProfile} />
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
                    
                    <Flex flexDir="column" mx="5.8vw" mt="1.7vh" mb="2.5vh" alignContent="start" alignItems="start">
                        <span className={cn(MonsterratFont.className, "text-[14px] text-[#171A1FFF] h-[22px] mt-[0.5vh] mb-[0.5vh] text-left")}>
                            Suggested Colors To Wear
                        </span>
                        <ColorPalette colors={meta.seasonColors} />
                    </Flex>
                </Flex>
            </Box>

            <Box className=" mx-[6.9vw] bg-white h-full mt-[2vh] mb-[10vh] rounded-xl" shadow="2xl">
                <Flex flexDir="column" >
                    <Flex flexDir="row" className="ml-[5.3vw] mr-[10.5vw] mt-[1.7vh]" justify="space-between" alignItems="baseline">
                        <span className={cn(LexendFont.className, "font-bold text-[18px]")}>Body Profile</span>
                        <PiPencilSimpleLineLight className="ml-[6.4vw]" size={22} strokeWidth={2} color="#171A1FFF" onClick={handleEditProfile} />
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Body Type</span>
                        <Button variant="solid"  width="auto" height="4vh" bgColor="#FBEBEB" color="#DE0E0B" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {capitalizeWord(meta.bodyType)} Shaped</span> </Button>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Dressing Size</span>
                        <Button variant="solid" width="auto" height="4vh" bgColor="#C6ADDA" color="#7E43AB" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {meta.dressingSize} </span> </Button>
                    </Flex>
                    <Flex flexDir="row" justify="space-between" mx="5.8vw" mb="1vh" mt="1.7vh" alignContent="center" alignItems="center">
                        <span className={cn(MonsterratFont.className, " text-[16px] text-[#171A1FFF] h-[22px]")}>Height</span>
                        <Button variant="solid" width="auto" height="4vh" bgColor="#E6F6BE" color="#485F0C" rounded={50}><span className={cn(manropeBold.className, " text-[14px]")}> {meta.height} cm</span> </Button>
                    </Flex>
                </Flex>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered> {/* Add isCentered prop */}
                <ModalOverlay />
                <ModalContent mx="25px" >
                    <ModalHeader>Restart Onboarding</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Do you want to take the onboarding process again?<br />
                        {isSubmitting ? (<span>Redirecting</span>) : (<span></span>)}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            No
                        </Button>
                        <Button
                            isLoading={isSubmitting} // Show spinner when loading
                            colorScheme="purple"
                            onClick={handleConfirmRestartOnboarding}
                        >
                            Yes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
export default Profile