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

    // Components for each step
    const steps = [
        <OnbLanding key="landing" setNextEnabled={setNextEnabled} dbUser={dbUser} user={user} />,
        <OnbMeasurements key="measurements" setNextEnabled={setNextEnabled} onMeasurementsData={handleMeasurementsData} dbUser={dbUser} user={user} />,
        <OnbBodytype key="bodytype" onBodytypeData={handleBodytypeData} setNextEnabled={setNextEnabled} dbUser={dbUser} user={user} />,
        <OnbConfirmation key="confirmation" apiStatus={apiStatus}/>,
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
            setApiStatus('loading');
            setCurrentStep(currentStep + 1);

            try {
              // Add a unique ID to formData
              const dataToSend = {
                id: uuidv4(), // Generate a UUID for the id field
                ...formData,
              };
    
              const response = await fetch("/api/user/metas", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
              });
                    if (response.ok) {
                        await fetch('/api/user/onboarded', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ isOnboarded: true }), 
                        });
              
                        setApiStatus('success');
                        toast({
                            title: "User preferences saved successfully.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                    } else {
                        setApiStatus('error');
                        throw new Error("Failed to save user preferences.");
                    }

                } catch (error) {
                    setApiStatus('error');
                    console.error("Error saving user preferences:", error);
                    toast({
                        title: "Error saving user preferences.",
                        description: (error as Error).message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }

            setCurrentStep(currentStep + 1);
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
