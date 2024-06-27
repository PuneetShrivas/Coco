"use client";

import { cn } from "@/lib/utils";
import {
    Flex,
    Box,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Button,
    Image,
    Spinner,
} from "@chakra-ui/react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Camera } from "lucide-react";
import { Lexend, Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useState } from "react";
import { PiNumberCircleOne } from "react-icons/pi";
import FileUpload from "../FileUpload";
const lexendFont = Lexend({ weight: '400', subsets: ["latin"] });
const manrope = Manrope({ weight: '500', subsets: ["latin"] });

const OnbLanding = ({ dbUser, user, setNextEnabled }: { dbUser: any; user: KindeUser | null, setNextEnabled: (value: boolean) => void }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(dbUser?.baseImageURL ?? null); // New state to store preview URL
    
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //       if (previewUrl || dbUser?.baseImageURL) {
    //         setNextEnabled(true);
    //       }
    //     }, 100); // Adjust the timeout value as needed
      
    //     return () => clearTimeout(timeoutId); // Clean up the timeout on unmount
    //   }, [previewUrl, dbUser?.baseImageURL]); 
    
    const handleImageUpload = async (file: File | null) => {
        if (file) {
            setIsLoading(true);
            onClose();
            setPreviewUrl(URL.createObjectURL(file));
            try {
                const formData = new FormData();
                formData.append("image", file);

                const response = await fetch("/api/user/baseimage", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    // Image uploaded successfully, you can update the user object here if needed
                    setNextEnabled(true);
                    console.log("Image uploaded successfully.");
                    const data = await response.json();
                    console.log(data.fileName)
                    localStorage.setItem("baseImageURL", JSON.stringify(data.fileName));
                } else {
                    console.error("Error uploading image:", response.statusText);
                    setPreviewUrl(dbUser?.baseImageURL ?? null);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                setPreviewUrl(dbUser?.baseImageURL ?? null);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <div className={lexendFont.className}>
                <p className="text-white">-</p>
                <h1 className="mt-[10vh] text-center text-[28px] text-[#171A1FFF]">
                    Hello {user?.given_name}!
                </h1>
                <h2 className="mt-[3vh] text-center text-[28px] text-[#7E43AB]">
                    Welcome to COCO
                </h2>
                <h3 className="mt-[3vh] text-center text-[20px] text-[#171A1F] mx-[3vh]" >
                    Let&apos;s begin with getting to know
                    you so COCO can give suggestions
                    specifically - <span className="text-[#ABE31E]">designed for you!</span>
                </h3>
            </div>
            <Box className="mt-[5vh] flex flex-col gap-[2vh] p-4 bg-[#FAFBFB]">
                <Flex flexDir="row" alignItems="center" className={cn("items-middle align-middle", lexendFont.className)}>
                    <PiNumberCircleOne size="50px" className="ml-[6vw]" color="#7E43ABFF" />
                    <p className="mx-[5vw] text-[20px] align-middle">Let&apos;s see how you look</p>
                </Flex>
                <Flex flexDir="row" alignItems="center" mx="auto" mb="3vh">
                    <Button onClick={onOpen} bgColor="#FAFBFB" height="20vh">
                        {dbUser.baseImageURL ? (
                            <p className={cn(manrope.className, "text-[13px] text-[#171A1F] text-left ml-[10vw] leading-[18px]")}>
                                Do you want  to <br /> change this photo?
                            </p>
                        ) : (
                            <p className={cn(manrope.className, "text-[13px] text-[#171A1F] text-left ml-[10vw] leading-[18px]")}>
                                Add a smiley <br /> passport photo
                            </p>
                        )}

                        <Box className="bg-[#EAECEF] rounded-md  mx-6 h-[15vh] w-[30vw] flex items-center justify-center">
                            {isLoading ? (
                                <Spinner size="md" />
                            ) : previewUrl ? (
                                <img src={previewUrl} alt="Base Image" className="rounded-lg object-cover overflow-hidden" />
                            ) : (
                                <div className="px-[6vw]">
                                    <Camera height={35} width={35} color="gray" />
                                </div>
                            )}
                        </Box>
                    </Button>
                </Flex>
                <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth="1px">Upload Image</DrawerHeader>
                            <DrawerBody>
                                <FileUpload onImageUpload={handleImageUpload} />
                            </DrawerBody>
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
            </Box>
        </div>
    );
};

export default OnbLanding;
