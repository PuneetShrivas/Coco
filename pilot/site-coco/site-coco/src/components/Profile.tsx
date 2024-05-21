"use client"

import { Box } from "@chakra-ui/react";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Profile = () => {
    return (
        <MaxWidthWrapper className="grainy">
            <div className="mt-[70px] h-screen">
                <div>
                    <Box className="bg-white">
                        Profile
                    </Box>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
export default Profile