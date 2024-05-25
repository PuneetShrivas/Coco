"use client"

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { User } from "lucide-react";
import {IN} from 'country-flag-icons/react/3x2'
import { Inter } from "next/font/google";
import config from './../../tailwind.config';
const interFont = Inter({ subsets: ['latin'] });
const seasonColors = [
    { color: "#87CEEB" },
    { color: "#ADD8E6" },
    { color: "#87CEFA" },
    { color: "#B0E0E6" },
    { color: "#F0F8FF" },
    { color: "#E6E6FA" },
]
const Profile = ({
    user,
}: {
    user: KindeUser | null;
}) => {
    const imageUrl = user?.picture
    return (
        <div className="relative">
            <Box className="bg-[#2F2F2F] h-[33vh] absolute top-0 w-full" style={{ borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px" }} >
                <div className=" mx-auto mt-[10vh] w-9/12">
                    <span className="text-white text-xl font-bold" style={{ font: "Inter" }}>Hello {user?.given_name},</span> <br />
                    <span className="text-white text-base font-thin tracking-wider" style={{ font: "Inter" }}>Welcome to your personal profile</span>
                </div>
            </Box>
            <MaxWidthWrapper>
                <div className="relative top-0 justify-center items-center">
                    <span>-</span>
                    <div className="relative mt-[22vh] mx-auto h-[30vh] w-11/12 rounded-2xl bg-white shadow-xl"> {/* Box container */}
                        <Flex flexDir="row" justify="space-between" className="mx-5 pt-[10px]">
                            <div className="text-gray-800 pt-1 font-bold text-large " style={{ fontFamily: "Inter" }}>
                                Profile
                            </div>
                            <div>
                                <Button mt="3px" variant="outline" borderColor="#2F2F2F" height="26px" size="sm" background="#f1f1f1"> <span className="textiscentered"> Update </span> </Button>
                            </div>
                        </Flex>
                        <Flex flexDir="row" className="mx-5 pt-[8px]">
                            <Flex flexDir="column" className="w-6/12">
                                <div>
                                <div className="text-xs">
                                    Your Season
                                </div>
                                <div className="bg-[#D1E2FE] rounded-md mt-1 mb-3 h-[25px] text-sm w-fit px-2 align-middle"> Warm Autumn </div>
                                </div>
                                <div className="text-xs">
                                    Body Type
                                    <div className="bg-[#ceefdc] rounded-md mt-1 mb-3 h-[25px] text-sm w-fit px-2 align-middle"> Oval - Blige Skin </div>
                    
                                </div>
                                
                            </Flex>
                            <Flex flexDir="column" className="w-6/12"   >
                                
                                <div  className="mb-3">
                                    <Flex flexDir="row" gap="1" justify="space-between">
                                        <Flex flexDir="column" align="center">
                                            <div className="text-xs">Age</div>
                                            <div className="bg-teal-200/50 mt-1 rounded h-[25px] w-fit px-1"> 25</div>
                                        </Flex>
                                        <Flex flexDir="column"  align="center">
                                            <div className="text-xs">Gender</div>
                                            <div className="bg-purple-200/50 mt-1 rounded h-[25px] w-fit px-1"> M</div>
                                        </Flex>
                                        <Flex flexDir="column"  align="center">
                                            <div className="text-xs">Ethnicity</div>
                                            <div > <IN className="rounded overflow-hidden mt-1 "  title="India" height="25px" width="40px" /> </div>
                                        </Flex>
                                    </Flex>
                                </div>
                                <div className="text-xs">
                                    Fit Type
                                    <div className="bg-[#daddf3] rounded-md mt-1 mb-3 h-[25px] text-sm w-fit px-2 align-middle"> Regular - Relaxed </div>

                                </div>
                            </Flex>
                        </Flex>
                        <div className="absolute bottom-0">
                        <div className="text-xs mb-1 mx-5">Colors that suit you</div>
                        <Flex flexDir="row" flexWrap="wrap" gap="2" className=" mb-3 mx-5">
                            {seasonColors.map((seasoncolor) => {
                                return (
                                    <div key={seasoncolor.color} className="h-6 w-6 rounded-full border-1 border-gray-700" style={{ backgroundColor: `${seasoncolor.color}` }} />
                                );
                            })}
                        </Flex>
                        </div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> {/* Circle container */}
                            <div className="overflow-hidden rounded-full w-24 h-24 border-4 border-white "> {/* Circular image clipping */}
                                {imageUrl ? (
                                    <img
                                        src={imageUrl} // Replace with your image path
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <User className="h-12 w-5 text-zinc-900" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-11/12 mt-5 rounded-2xl bg-[#CCE5E3] h-[15vh] shadow-xl">
                        <Flex flexDir="row" mx="20px" pt="10px">
                            <p className='text-large font-bold'>
                                Wardrobe
                            </p>
                            
                        </Flex>
                        <Flex flexDir="row">
                                <div className="bg-[#BBE2CD] rounded-sm h-10 w-10 ml-5 mx-2 my-2 text-[#BBE2CD] border-1 border-gray-500"> . </div>
                                <div className="bg-[#BBE2CD] rounded-sm h-10 w-10 mx-2 my-2 text-[#BBE2CD] border-1 border-gray-500"> . </div>
                                <div className="bg-[#BBE2CD] rounded-sm h-10 w-10 mx-2 my-2 text-[#BBE2CD] border-1 border-gray-500"> . </div>
                                <div className="bg-[#BBE2CD] rounded-sm h-10 w-10 mx-2 my-2 text-[#BBE2CD] border-1 border-gray-500"> . </div>
                                
                                
                            </Flex>
                    </div>
                    <div className="mx-auto w-11/12 mt-5 rounded-2xl bg-[#EEDEF6] h-[15vh] shadow-xl">
                        <Flex flexDir="row" mx="20px" pt="10px">
                            <p className='text-large font-bold'>
                                Preferences
                            </p>
                            
                        </Flex>
                        <Flex flexDir="column">
                                <div className="bg-[#696969] rounded-sm h-3 w-60 ml-5 my-2 text-[#696969] border-1 border-gray-500"> . </div>
                                <div className="bg-[#696969] rounded-sm h-3 w-40 ml-5 my-2 text-[#696969] border-1 border-gray-500"> . </div>
                                
                                
                            </Flex>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}
export default Profile