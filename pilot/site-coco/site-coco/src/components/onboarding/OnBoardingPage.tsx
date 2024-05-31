"use client"
import { useState, useEffect } from "react";
import OnbLanding from "@/components/onboarding/OnbLanding";
import OnbMeasurements from "@/components/onboarding/OnbMeasurements";
import OnbBodytype from "@/components/onboarding/OnbBodytype";
import OnbConfirmation from "@/components/onboarding/OnbConfirmation";
import { Box, Button, Progress, Link, useToast } from "@chakra-ui/react"; // Added useToast for notifications
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { v4 as uuidv4 } from 'uuid';

const OnboardingPage = ({ dbUser, user }: { dbUser: any, user: KindeUser | null }) => {
    // State for current step and button enablement
    const [currentStep, setCurrentStep] = useState(0);
    const [nextEnabled, setNextEnabled] = useState(false);

    // State to store values from child components
    const [formData, setFormData] = useState<{
        height: string | null;
        dressingSize: string | null;
        age: string | null;
        genderFemale: boolean | null;
        bodyType: string | null;
        skinTone: string | null;
        ethnicity: string | null;
    }>({
        height: null,
        dressingSize: null,
        age: null,
        genderFemale: null,
        bodyType: null,
        skinTone: null,
        ethnicity: null,
    });

    // Function to handle data from OnbMeasurements
    const handleMeasurementsData = (data: {
        height: string | null;
        dressingSize: string | null;
        age: string | null;
        genderFemale: boolean | null;
    }) => {
        setFormData({ ...formData, ...data }); // Merge with existing data
        setNextEnabled(true);
    };

    // Function to handle data from OnbBodytype
    const handleBodytypeData = (data: {
        bodyType: string | null;
        skinTone: string | null;
        ethnicity: string | null;
    }) => {
        setFormData({ ...formData, ...data }); // Merge with existing data
        setNextEnabled(true);
    };

    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Function to handle data from OnbConfirmation
  const handleImageAnalysisData = (data: {
    irisColor: string;
    hairColor: string;
    stylingSeason: string;
    seasonColors: string[];
  }) => {
    setFormData({ ...formData, ...data }); // Add image analysis data to formData
  };

    // Components for each step
    const steps = [
        <OnbLanding key="landing" setNextEnabled={setNextEnabled} dbUser={dbUser} user={user} />,
        <OnbMeasurements key="measurements" setNextEnabled={setNextEnabled} onMeasurementsData={handleMeasurementsData} dbUser={dbUser} user={user} />,
        <OnbBodytype key="bodytype" onBodytypeData={handleBodytypeData} setNextEnabled={setNextEnabled} dbUser={dbUser} user={user} />,
        <OnbConfirmation key="confirmation" apiStatus={apiStatus} dbUser={dbUser} />,
    ];

    // Progress bar calculation
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Effect to reset nextEnabled when the step changes
    useEffect(() => {
        setNextEnabled(false); // Reset nextEnabled at each new step
    }, [currentStep]);
    const toast = useToast();

    const handleNext = async () => {
        if (nextEnabled) {
          if (currentStep === steps.length - 2) {
            setApiStatus("loading");
            setCurrentStep(currentStep + 1); // Move to confirmation immediately
      
            try {
              // Fetch image from backend
              const imageResponse = await fetch(
                `/api/user/images/${encodeURIComponent(
                  dbUser?.baseImageURL.split("/").pop() ?? ""
                )}`
              );
      
              if (!imageResponse.ok) {
                throw new Error("Failed to fetch user image.");
              }
      
              const imageBlob = await imageResponse.blob();
              const formImageData = new FormData();
              formImageData.append("file", imageBlob, "profile_image.jpg");
      
              // Send image for analysis
              const analysisResponse = await fetch(
                "http://16.16.115.11/app/season_profiler/detect_season_from_image_openai/",
                {
                  method: "POST",
                  body: formImageData,
                }
              );
      
              if (!analysisResponse.ok) {
                throw new Error("Failed to analyze user image.");
              }
      
              const imageAnalysisData = await analysisResponse.json();
      
              // Map API response keys to database field names
              const convertedData = {
                irisColor: imageAnalysisData.response.iris_color,
                hairColor: imageAnalysisData.response.hair_color,
                stylingSeason: imageAnalysisData.response.season,
                seasonColors: imageAnalysisData.response.season_colors,
              };
      
              // Combine user data, image analysis data, and converted data
              const dataToSend = {
                id: uuidv4(),
                ...formData,
                ...convertedData, // Include the converted data
              };
      
              // Submit user meta (including image analysis data)
              const metaResponse = await fetch("/api/user/metas", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
              });
      
      
              if (metaResponse.ok) {
                // Update isOnboarded to true after successful submission
                await fetch("/api/user/onboarded", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ isOnboarded: true }),
                });
      
                setApiStatus("success");
                toast({
                  title: "User preferences saved successfully.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                setApiStatus("error");
                const errorData = await metaResponse.json(); // Get error details
                throw new Error(`Failed to save user preferences: ${errorData.error || 'Unknown error'}`);
              }
            } catch (error) {
              setApiStatus("error");
              console.error("Error saving user preferences:", error);
              toast({
                title: "Error saving user preferences.",
                description: (error as Error).message, 
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } 
          } else {
            // Proceed to the next step for other steps
            setCurrentStep(currentStep + 1);
          }
        }
      };
      

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };


    return (
        <div>
            {steps[currentStep]}
            <div style={{
                marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "20px", paddingLeft: "20px"
            }}>
                {currentStep > 0 && currentStep < steps.length - 1 && (
                    <Link // Wrap the button with Chakra UI Link to use the "back" functionality.
                        href="#" // Or your preferred link functionality
                        onClick={handleBack}
                        top="20px" // Adjust as needed
                        left="20px"
                    >
                        <Button bgColor="#C4EB5F"
                            rounded="full" leftIcon={<ChevronLeftIcon />}>Back</Button>
                    </Link>
                )}
                {currentStep < steps.length - 1 && (
                    <Button
                        key={currentStep.toString()}
                        onClick={handleNext}
                        isDisabled={!nextEnabled}
                        bgColor="#C4EB5F"
                        rounded="full"
                        rightIcon={<ChevronRightIcon />} // Add the arrow icon
                    >
                        Next
                    </Button>
                )}
            </div>
            {currentStep < steps.length - 1 && ( // Only render if NOT on last step
            <Box mt={4} display="flex" justifyContent="center">
                {Array.from({ length: steps.length - 1 }, (_, index) => (
                    <Box
                        key={index}
                        borderRadius="full"
                        width="10px"
                        height="10px"
                        border="2px solid #7E43AB"
                        backgroundColor={currentStep == index ? "#7E43AB" : "transparent"}
                        mr={2}
                    />
                ))}
            </Box>
        )}
        </div>
    );
};

export default OnboardingPage;
