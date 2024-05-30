"use client"
import { useState, useEffect } from "react";
import OnbLanding from "@/components/onboarding/OnbLanding";
import OnbMeasurements from "@/components/onboarding/OnbMeasurements";
import OnbBodytype from "@/components/onboarding/OnbBodytype";
import OnbConfirmation from "@/components/onboarding/OnbConfirmation";
import { Box, Button, Progress, Link } from "@chakra-ui/react"; // Or your preferred UI library
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const OnboardingPage = ({ dbUser, user }: { dbUser: any, user: KindeUser | null }) => {
    // State for current step and button enablement
    const [currentStep, setCurrentStep] = useState(0);
    const [nextEnabled, setNextEnabled] = useState(false);

    // Components for each step
    const steps = [
        <OnbLanding key="landing" setNextEnabled={setNextEnabled} dbUser={dbUser} user={user}/>,
        <OnbMeasurements key="measurements" setNextEnabled={setNextEnabled} />,
        <OnbBodytype key="bodytype" setNextEnabled={setNextEnabled} />,
        <OnbConfirmation key="confirmation" />,
    ];

    // Progress bar calculation
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Effect to reset nextEnabled when the step changes
    useEffect(() => {
        setNextEnabled(false); // Reset nextEnabled at each new step
    }, [currentStep]);

    const handleNext = () => {
        if (nextEnabled) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };


    return (
        <div>
            {steps[currentStep]}
            {/* Back button only for steps after landing and before confirmation */}
            
            <div style={{ marginTop: "20px", display: "flex", justifyContent:"space-between", alignItems: "center", paddingRight: "20px", paddingLeft:"20px"
             }}>
            {currentStep > 0 && currentStep < steps.length - 1 && (
                <Link // Wrap the button with Chakra UI Link to use the "back" functionality.
                    key={currentStep.toString()}
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

        </div>
    );
};

export default OnboardingPage;
