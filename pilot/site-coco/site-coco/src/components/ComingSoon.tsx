import { Box, Flex, Text, Heading, Link, IconButton, Icon, Button } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { Shirt, BotMessageSquare, Backpack, ArrowDownWideNarrow, ChevronRight } from 'lucide-react';

import MaxWidthWrapper from "./MaxWidthWrapper";
import { cn } from "@/lib/utils";
const interFont = Inter({ subsets: ['latin'] });
const ComingSoon: React.FC = () => {
    const features = [
        { image: "/tryon.png", title: "Virtual Try Ons", iconcolor: "#000000", strokecolor: "#FFFFFF", icon: Shirt, bgcolor: "#EEDEF6", description: "See how it looks before you buy! Experiment with styles and find your perfect fit." },
        { image: "/shoppingassistant.png", title: "Shopping Assistant", iconcolor: "#C9E3E1", strokecolor: "#000000", icon: BotMessageSquare, bgcolor: "#C9E3E1", description: "Your personal AI shopper. Tailored recommendations to grow your wardrobe effortlessly." },
        { image: "/wardrobe.png", title: "Digital Wardrobe", iconcolor: "#E2E2E2", strokecolor: "#000000", icon: Backpack, bgcolor: "#FEE1B6", description: "Organize your closet, create outfits, and get great styling inspirations quickly." }
    ];

    return (
        <div className="bg-[#2F2F2F]">
            <div>
                <MaxWidthWrapper>
                    <Heading className=" mb-30 bg-[#2F2F2F]">-</Heading>
                    <Box className=" bg-white mt-20 mx-32 h-1 mb-2 rounded-full"></Box>
                    <Box className=" bg-white rounded-[30px] shadow-inner" height={700} pt={18}>
                        <div className="mb-6 mx-4 flex flex-row justify-between items-end">
                            <p className="text-2xl font-bold" style={{ fontFamily: 'Inter' }}>
                                Coming Soon
                            </p>
                            <Link className={cn(interFont.className, 'text-small flex items-center')}>
                                <span className="font-bold text-gray-500"> Join Waitlist</span>
                                <ChevronRight size={20} color="#6B7280" />
                            </Link>
                        </div>
                        <Flex display="flex" flexDir="row" className="mx-4 my-4">
                            <div className=" flex flex-col justify-center w-2/12 pt-3">
                                {features.map((feature) => {
                                    const IconComponent = feature.icon
                                    return (
                                        <div className="w-[45px] text-center" key={feature.title}>
                                            <Button
                                                variant="ghost"
                                                bgColor={feature.iconcolor}
                                                borderRadius="25px"
                                                width="fit-content"
                                                justifyContent="center"
                                                padding={0}
                                                shadow="2xl"
                                            >
                                                <Icon rounded="inherit" as={IconComponent} aria-label="feature" className="rounded-full" boxSize={4} strokeWidth={0.9} color={feature.strokecolor} />
                                            </Button>
                                            <div className="justify-center" style={{ display: "flex" }}>
                                                <Box height={150} className="bg-[#d8d6d6] w-[1.5px]">
                                                </Box>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="w-[45px] text-center">
                                    <Button
                                        variant="ghost"
                                        bgColor="gray"
                                        borderRadius="25px"
                                        width="fit-content"
                                        justifyContent="center"
                                        padding={0}
                                    >
                                        <Icon rounded="inherit" as={ArrowDownWideNarrow} aria-label="feature" className="rounded-full" boxSize={4} strokeWidth={0.9} color="#FFFFFF" />
                                    </Button></div>
                            </div>
                            <div className=" flex flex-col ml-auto h-full mt-2 w-10/12">
                                {features.map((feature) => {
                                    return (
                                        <div className="w-full" key={feature.title}>
                                            <Box
                                                key={feature.title}
                                                py={4}
                                                pl={4}
                                                height="160px"
                                                width="full"
                                                borderRadius="25px"
                                                shadow="2xl"
                                                mb="30px"
                                                bgColor={feature.bgcolor}>
                                                <Flex flexDir="column" className="justify-between">
                                                    <Text fontSize="base" fontWeight="bold" className={interFont.className}>
                                                        <div className="text-gray-800 ">
                                                            {feature.title}
                                                        </div>
                                                    </Text>
                                                    <Flex flexDir="row" overflowX="clip" my={1} className="w-full noscrollbar" >
                                                        <div className="text-xs leading-snug w-8/12 pr-2 text-gray-600 text-justify">
                                                            <Flex flexDir="row">
                                                            <div className="items-center py-2 justify-center px-[2px]"> <Box className="w-[65px] h-[2px] rounded-full bg-gray-700 "/> </div>
                                                            <div className="items-center py-2 justify-center px-[2px]"> <Box className="w-[40px] h-[2px] rounded-full bg-gray-500 "/> </div>
                                                            <div className="items-center py-2 justify-center px-[2px]"> <Box className="w-[25px] h-[2px] rounded-full bg-gray-300 "/> </div>
                                                            </Flex>
                                                            {feature.description}
                                                        </div>
                                                        <div className="w-5/12">
                                                            <Box  className="w-[100px] h-[100px] p-5 ml-2 bg-slate-50 rounded-xl shadow-md" backgroundImage={feature.image} backgroundPosition="right" backgroundRepeat="no-repeat" backgroundSize="cover">
                                                            </Box>
                                                        </div>
                                                    </Flex>
                                                </Flex>
                                            </Box>
                                        </div>
                                    );
                                })}
                            </div>
                        </Flex>
                    </Box>
                </MaxWidthWrapper>
            </div>
        </div>
    );
};

export default ComingSoon;