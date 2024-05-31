import {
  Box, Flex, Text, Input,
  useColorModeValue,
  Button,
  HStack,
  useTheme,
  Center,
  Image,
  VStack,
  Spinner
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { cn } from "@nextui-org/react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Lexend, Manrope } from "next/font/google";
import { PiNumberCircleThree } from "react-icons/pi";

const lexendFont = Lexend({ weight: '400', subsets: ["latin"] });
const manrope = Manrope({ weight: '700', subsets: ["latin"] });

type OnbBodytypeProps = {
  onBodytypeData: (data: {
    bodyType: string | null;
    skinTone: string | null;
    ethnicity: string | null;
  }) => void;
  dbUser: any;
  user: KindeUser | null;
  setNextEnabled: (value: boolean) => void;
};

const OnbBodytype = ({ onBodytypeData, dbUser, user, setNextEnabled }: OnbBodytypeProps) => {
  const [bodyType, setBodyType] = useState<string | null>("hourglass");
  const [skinTone, setSkinTone] = useState<string | null>("#F5E9DE"); // Lightest skin tone by default
  const [ethnicity, setEthnicity] = useState<string | null>("India"); // Default country
  const [isLoading, setIsLoading] = useState(false);
  // Initialize states based on dbUser data (if available)
  useEffect(() => {
    if (dbUser && dbUser.metaId) { // Check if metaId exists

      // Fetch the User_Meta object using metaId
      const fetchUserMeta = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/user/metas/${dbUser.metaId}`);
          if (response.ok) {
            const meta = await response.json();
            if (meta.bodyType) setBodyType(meta.bodyType);
            if (meta.skinTone) setSkinTone(meta.skinTone);
            if (meta.ethnicity) setEthnicity(meta.ethnicity);
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

  // Call onBodytypeData when data is ready
  useEffect(() => {
    if (bodyType && skinTone && ethnicity) {
      onBodytypeData({ bodyType, skinTone, ethnicity });
      setNextEnabled(true);
    }
  }, [bodyType, skinTone, ethnicity]);

  const skinToneColors = ["#F5E9DE", "#F0D5BE", "#D1A885", "#B88A68", "#9B7855", "#73553C"];
  const handleSkinToneClick = (color: string) => {
    setSkinTone(color);
  };

  const theme = useTheme();
  const activeColor = useColorModeValue(
    theme.colors.purple[500],
    theme.colors.purple[200],
  );


  return (
    <div>
      <p className="text-white">-</p>
      <div className="mt-[10vh]">
        <Box className="mt-[5vh] flex flex-col gap-[2vh] bg-[#FAFBFB] rounded-lg">
          <Flex flexDir="row" mt="2vh" alignItems="center" className={cn("align-middle", lexendFont.className)}>
            <PiNumberCircleThree size="50px" className="ml-[2vw]" color="#7E43ABFF" />
            <p className="mx-[2vw] text-[20px]">Tell COCO Your Body Type</p>
          </Flex>
          <Flex flexDir="row">
            <Box className="rounded-md overflow-hidden p-3">
              <img src="/image2.jpg" alt="" className="h-[54vh] w-[45vw] rounded-md object-cover" />
            </Box>
            <Flex flexDir="column" className="w-[55vw]" position="relative">
              {/* Loading Overlay */}
              {isLoading && (
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                bg="rgba(0, 0, 0, 0.5)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                zIndex={1}
                            >
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="purple.500"
                                    size="xl"
                                />
                            </Box>
                        )}
              {/* Body Type */}
              <Flex flexDir="column" mt="2vh" className="mb-4 px-4 w-auto">
                <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Body Type</Text>
                <Flex flexWrap="wrap" justifyContent="center" gap={4}>
                  {["apple", "pear", "hourglass", "rectangle", "triangle"].map((type) => (
                    <VStack key={type} spacing={0} alignItems="center"> {/* VStack for image and text */}
                      <Center
                        w="48px"
                        h="52px"
                        borderRadius="md"
                        bgColor="#EFF6E1"
                        onClick={() => setBodyType(type)}
                        borderWidth={bodyType === type ? "2px" : "1px"}
                        borderColor={bodyType === type ? activeColor : "gray.200"}
                        cursor="pointer"
                      >
                        <Image
                          src={`/bodytypes/${type}.png`}
                          alt={type}
                          w="41px"
                          h="37px"
                        />
                      </Center>
                      <Text className={cn(manrope.className, "text-[11px] leading-[26px] text-[#485F0CFF]")}>
                        {type}  {/* Body type name */}
                      </Text>
                    </VStack>
                  ))}
                </Flex>
              </Flex>
              {/* Ethnicity */}
              <Flex flexDir="column" className="mb-4 px-4 w-auto">
                <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Ethnicity</Text>
                <Input
                  value={ethnicity ?? ''}
                  placeholder="Your Country Here"
                  onChange={(e) => setEthnicity(e.target.value)}
                />
              </Flex>

              {/* Skin Tone */}
              <Flex flexDir="column" className="px-4 w-auto">
                <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Skin Tone</Text>
                <HStack spacing={2}>
                  {skinToneColors.map((color) => (
                    <Box
                      key={color}
                      w="30px" // Adjust size as needed
                      h="30px"
                      borderRadius="sm"  // Slightly less rounded corners for a more square look
                      bgColor={color}
                      onClick={() => handleSkinToneClick(color)}
                      borderWidth={skinTone === color ? "2px" : "1px"}
                      borderColor={skinTone === color ? activeColor : "gray.300"}
                      cursor="pointer"
                    />
                  ))}
                </HStack>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </div>
    </div>
  );
};

export default OnbBodytype;
