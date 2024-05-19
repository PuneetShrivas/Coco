// components/WhyAIStyling.js
import Image from 'next/image';
import { Glass_Antiqua, Work_Sans } from "next/font/google";

const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] });
const workSansFont = Work_Sans({ weight: '400', subsets: ['latin'] });

const WhyAIStyling = () => {
    return (
        <div className="bg-yellow-200 p-8">
            <div className={glassAntiquaFont.className}>
                <h2 className="text-3xl font-bold mb-4">AI-Powered Styling Assistant</h2>
            </div>
            <div className={workSansFont.className}>
                <p className="mb-8">
                    Imagine having a personal stylist who already knows your tastes, your preferences, your dislikes.
                    Now imagine that stylist being available 24/7, at your fingertips, anytime and anywhere. Well,
                    no need to imagine, welcome to Coco AI :)
                </p>
            </div>
            <div className="flex flex-col md:flex-row items-left md:justify-between">
                <div className="flex flex-row items-center mb-4 md:mb-0 md:mr-4">
                    <div className={glassAntiquaFont.className}>
                        <p className="text-3xl font-bold">250+</p>
                    </div>
                    <div className={workSansFont.className}>
                        <p className="ml-2">Waitlisted Clients</p>
                    </div>
                </div>
                <div className="flex flex-row items-center mb-4 md:mb-0 md:mr-4">
                    <div className={glassAntiquaFont.className}>
                        <p className="text-3xl font-bold">10+</p>
                    </div>
                    <div className={workSansFont.className}>
                        <p className="ml-2">Interested Brands & Marketplaces</p>
                    </div>
                </div>
                <div className="flex justify-center md:justify-end">
                    <Image src={"/illustration.svg"} alt="Illustration" width={100} height={100} />
                </div>
            </div>
        </div>
    );
};

export default WhyAIStyling;
