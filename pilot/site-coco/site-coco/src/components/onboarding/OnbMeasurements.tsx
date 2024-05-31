import { Box, Flex, Select, Spinner, Input, Text, Switch, Slider, SliderTrack, SliderFilledTrack, SliderThumb, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { cn, Button } from "@nextui-org/react";
import { PiNumberCircleTwo } from "react-icons/pi";
import { Lexend, Manrope } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";

const lexendFont = Lexend({ weight: '400', subsets: ["latin"] });
const manrope = Manrope({ weight: '700', subsets: ["latin"] });

type OnbMeasurementsProps = {
    onMeasurementsData: (data: {
        height: string | null;
        dressingSize: string | null;
        age: string | null;
        genderFemale: boolean | null;
    }) => void;
    dbUser: any;
    user: KindeUser | null;
    setNextEnabled: (value: boolean) => void;
};

const OnbMeasurements = ({ onMeasurementsData, dbUser, user, setNextEnabled }: OnbMeasurementsProps) => {
    const [useCm, setUseCm] = useState(false);
    const [height, setHeight] = useState(170); // Initial height in centimeters
    const [feet, setFeet] = useState(5); // Initial feet value
    const [inches, setInches] = useState(7); // Initial inches value
    const [dressRegion, setDressRegion] = useState("US"); // State for US/UK selection
    const [dressSize, setDressSize] = useState(0); // State for dress size
    const [age, setAge] = useState(25); // Default age
    const [gender, setGender] = useState("female"); // Default gender

    useEffect(() => {
        const totalInches = height / 2.54;
        setFeet(Math.floor(totalInches / 12));
        setInches(Math.round(totalInches % 12));
    }, [height]);
    const handleFeetChange = (feetValue: string) => {
        setFeet(parseInt(feetValue, 10));
        setHeight(feet * 30.48 + inches * 2.54);
    };
    const handleInchesChange = (inchesValue: string) => {
        setInches(parseInt(inchesValue, 10));
        setHeight(feet * 30.48 + inches * 2.54);
    };
    const handleDressRegionChange = (newRegion: string) => {
        setDressRegion(newRegion);
        setDressSize(newRegion === "US" ? 0 : 4);
    };
    const handleDressSizeChange = (newSize: string) => {
        setDressSize(parseInt(newSize, 10));
    };
    const memoizedOnMeasurementsData = useCallback(onMeasurementsData, []);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (dbUser && dbUser.metaId) {
            console.log("trying to fetch metas because they do exist")
            const fetchUserMeta = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/user/metas/${dbUser.metaId}`);
                    if (response.ok) {
                        const meta = await response.json();
                        console.log(meta, 'the meta')

                        // Height
                        if (meta.height) {
                            const heightVal = parseFloat(meta.height);
                            setHeight(heightVal);
                            setUseCm(true); // Assuming height is stored in cm in the database
                        }

                        // Dress Size
                        if (meta.dressingSize) {
                            const [size, region] = meta.dressingSize.split(" ");
                            setDressSize(parseInt(size, 10));
                            setDressRegion(region);
                        }

                        // Age
                        if (meta.age) {
                            setAge(parseInt(meta.age, 10));
                        }

                        // Gender
                        if (meta.genderFemale !== undefined) {
                            setGender(meta.genderFemale ? "female" : "male");
                        }

                        console.log("loaded metas from dbUser");
                        // Trigger onMeasurementsData to signal parent the data is loaded and valid
                        onMeasurementsData({
                            height: `${height}`, // Always send height in cm
                            dressingSize: `${dressSize} ${dressRegion}`,
                            age: `${age}`,
                            genderFemale: gender === 'female',
                        });
                    } else {
                        console.log("Error fetching user metas:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching user metas:", error);
                } finally {
                    setIsLoading(false); // Stop loading in any case
                }
            };

            fetchUserMeta();
        }
    }, [dbUser, memoizedOnMeasurementsData]); // Dependency on dbUser and onMeasurementsData


    useEffect(() => {
        if (dressSize !== null && age && gender) {
            onMeasurementsData({
                height: `${height}`, // Always send height in cm
                dressingSize: `${dressSize} ${dressRegion}`,
                age: `${age}`,
                genderFemale: gender === 'female',
            });
        }
        setNextEnabled(true);
    }, [height, dressSize, age, gender, dressRegion]);

    return (
        <div>
            <p className="text-white">-</p>
            <div className="mt-[10vh]">
                <Box className="mt-[5vh] flex flex-col gap-[2vh] bg-[#FAFBFB] rounded-lg ">
                    <Flex flexDir="row" mt="2vh" alignItems="center" className={cn("align-middle", lexendFont.className)}>
                        <PiNumberCircleTwo size="50px" className="ml-[2vw]" color="#7E43ABFF" />
                        <p className="mx-[2vw] text-[20px]">Give COCO your Measurements</p>
                    </Flex>
                    <Flex flexDir="row">
                        <Box className="rounded-md overflow-hidden p-3">
                            <img src="/image1.jpg" alt="" className="h-[54vh] w-[45vw] rounded-md object-cover" />
                        </Box>
                        <Flex flexDir="column" className="w-[55vw]" position="relative">
                            
                                {isLoading && (
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                        bg="rgba(0, 0, 0, 0.5)" // Semi-transparent gray
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        zIndex={1} // Ensure the overlay is above other content
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
                                {/* Height */}
                                <Flex flexDir="column" mt="2vh" className="mb-4 px-4 w-auto">
                                    <Flex flexDir="row" mb="1vh" justifyContent="space-between" alignItems="center">
                                        <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Height</Text>
                                        <div className="text-[14px]">
                                            in
                                            <Switch
                                                colorScheme="purple"
                                                isChecked={useCm}
                                                onChange={() => setUseCm(!useCm)}
                                                className="px-2"
                                            >
                                            </Switch>
                                            cm
                                        </div>
                                    </Flex>
                                    {useCm ? (
                                        <>
                                            <Slider
                                                aria-label='height-slider'
                                                value={height}
                                                min={115}
                                                max={300}
                                                step={1} // Step to 1 for whole numbers
                                                onChange={(val) => setHeight(Math.floor(val))} // Round down
                                            >
                                                <SliderTrack>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb />
                                            </Slider>
                                            <Text className="text-center">{height} cm</Text>
                                        </>
                                    ) : (
                                        <Flex flexDir="row">
                                            <Select value={`${feet}ft`} onChange={(e) => handleFeetChange(e.target.value)}>
                                                {[...Array(7)].map((_, i) => <option key={i} value={`${i + 4}ft`}>{i + 4}ft</option>)}
                                            </Select>
                                            <Select value={`${inches}in`} onChange={(e) => handleInchesChange(e.target.value)}>
                                                {[...Array(12)].map((_, i) => <option key={i} value={`${i}in`}>{i}in</option>)}
                                            </Select>
                                        </Flex>
                                    )}
                                </Flex>
                                {/* Dress Size */}
                                <Flex flexDir="column" className="mb-4 px-4 w-auto">
                                    <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Dress Size</Text>
                                    <Flex flexDir="row">
                                        <Select value={dressRegion} onChange={(e) => handleDressRegionChange(e.target.value)}>
                                            <option value="US">US</option>
                                            <option value="UK">UK</option>
                                        </Select>
                                        <Select value={dressSize} onChange={(e) => handleDressSizeChange(e.target.value)}>
                                            {[...Array(dressRegion === "US" ? 10 : 10)].map((_, i) => (
                                                <option key={i} value={(dressRegion === "US" ? i * 2 : i * 2 + 4)}>
                                                    {dressRegion === "US" ? i * 2 : i * 2 + 4}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Flex>
                                {/* Age */}
                                <Flex flexDir="column" className="mb-4 px-4 w-auto">
                                    <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Age</Text>
                                    <NumberInput
                                        defaultValue={age}
                                        min={13} // Example minimum age
                                        max={120} // Example maximum age
                                        onChange={(valueString) => setAge(parseInt(valueString, 10) || 0)} // Update age state
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Flex>
                                {/* Gender */}
                                <Flex flexDir="column" className="px-4 w-auto">
                                    <Text className={cn("text-[13px] leading-[20px]", manrope.className)}>Gender</Text>
                                    <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </Select>
                                </Flex>
                            </Flex>
                        </Flex>
                </Box>
            </div>
        </div>
    );
};

export default OnbMeasurements;
