import { Box, Flex, Text, Heading, Link, IconButton, Icon, Button } from "@chakra-ui/react";
import { Inter, Lexend, Manrope } from "next/font/google";
import { Shirt, BotMessageSquare, Backpack, ArrowDownWideNarrow, ChevronRight } from 'lucide-react';

import MaxWidthWrapper from "./MaxWidthWrapper";
import { cn } from "@/lib/utils";
const interFont = Inter({ subsets: ['latin'] });
const LexendFont = Lexend({ weight: '700', subsets: ['latin'] })
const manrope = Manrope({ weight: '400', subsets: ["latin"] });


const ComingSoon: React.FC = () => {
const features = [
    { image: "/tryon.png", title: "Virtual Try Ons", iconcolor: "#7E43AB", strokecolor: "#FFFFFF", icon: Shirt, bgcolor: "#EEDEF6", description: "See how it looks before you buy! Experiment with styles and find your perfect fit." },
    { image: "/shoppingassistant.png", title: "Shopping Assistant", iconcolor: "#CDEB80", strokecolor: "#000000", icon: BotMessageSquare, bgcolor: "#C9E3E1", description: "Your personal AI shopper. Tailored recommendations to grow your wardrobe easily." },
    { image: "/wardrobe.png", title: "Digital Wardrobe", iconcolor: "#E66E6C", strokecolor: "#FFFFFF", icon: Backpack, bgcolor: "#FEE1B6", description: "Organize your closet, create outfits, and get great styling inspirations quickly." }
];
    return (
        <div className="bg-[#FFFFFF] ">
            <h1 className="text-[28px] font-bold text-left text-[#7e43ab] ml-[5vw] mt-[12vh]">Coming Soon</h1>
            <Flex flexDir="column" className="mt-[4vh]">
            {features.map((section)=>{
                return(
                    <div key={section.title} className="w-full bg-[#FAFBFB] h-[23vh]">
                        <Flex flexDir="row">
                        <Flex flexDir="column">
                        <Flex flexDir="row" mx="25px" mt="1vh" align="center" alignItems="center">
                            <Button width={39} height={39} rounded="2xl" bgColor={section.iconcolor}>
                            <Icon as={section.icon} color={section.strokecolor}/>
                            </Button>
                            <h2 className={cn(LexendFont.className,"text-xl ml-[3vw] font-bold text-[20px] text-left text-[#171a1f]")}>{section.title}</h2>
                        </Flex>
                        <Flex flexDir="row" className=" mt-[1vh]">
                            <h2 className={cn(manrope.className,"text-justify pl-[7vw] text-[14px] pr-[5vw] text-gray-800 ")}>
                                <span>{section.description}</span>
                            </h2>
                        </Flex>
                        </Flex>
                        <div>
                                <Box mr="3vw" mt="2vh" rounded={"xl"} backgroundImage={section.image} className="w-[25vw] h-[15vh]" backgroundPosition="center" backgroundRepeat="no-repeat" backgroundSize="cover"/>
                            </div>
                        </Flex>
                    </div>
                );
            })}
            </Flex>
        </div>
    );
};

export default ComingSoon;