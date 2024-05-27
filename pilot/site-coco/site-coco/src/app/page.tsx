import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Glass_Antiqua, Work_Sans, Inter, Montserrat } from "next/font/google";
import { buttonVariants } from "@/components/ui/button";
import WhyAIStyling from "@/components/WhyAIStyling";
import { Box, Flex } from "@chakra-ui/react";
import { cn } from "@/lib/utils";
const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] })
const interFontBold = Inter({ weight: '700', subsets: ['latin'] })
const interFont = Inter({ weight: '500', subsets: ['latin'] })
const interFontfour = Inter({ weight: '400', subsets: ['latin'] })
const interFontseven = Inter({ weight: '700', subsets: ['latin'] })
const monsterratFont = Montserrat({ weight: '700', subsets: ['latin'] })
const workSansFont = Work_Sans({ weight: '400', subsets: ['latin'] })
var htmlcontent = '<form action="https://submit-form.com/EXPDo1BX9"><label for="email">Email</label><input type="email" id="email" name="email" placeholder="Email" required="" /></textarea><button type="submit">Send</button></form>';

export default function Home() {
  return (
    <>
      <div className="mt-[90px]">
        <div className="sm:flex lg:flex lg:flex-row sm:flex-col">
          <div className="lg:w-1/2 sm:w-full lg:h-[875px] h-[400px] overflow-hidden">
            <img src="/banner_hero.jpeg" alt="hero" width="100%" style={{}} />
          </div>
          <div className="bg-[#7E43AB] lg:w-1/2 lg:h-[875px] sm:w-full sm:h-[400px] md:p-40 p-[20px] items-center align-middle justify-center ">
            <Flex flexDir="column" gap="20px">
              <h1 className={cn(interFontBold.className, " text-wrap text-white font-normal text-[50px] text-left leading-[60px] tracking-[-2px] mr-10")}>
                Behind every <span className="text-[#C4EB5F]"> confident person </span> is … <br />
                knowing they look <span className="text-[#C4EB5F]" >GREAT.</span>
              </h1>
              <h2 className={cn(interFont.className, "text-[#88878B] text-[24px] leading-[36px]")}>
                Dress for success every day with Coco.
              </h2>
              <h1 className={cn(monsterratFont.className, "text-[41px] text-[#C4EB5F] text-left leading-[49.2px]")}>
                JOIN THE WAITLIST!
              </h1>
              <div>
              <form action="https://submit-form.com/EXPDo1BX9" className="h-[50px] w-full">
                <input className="h-[50px] rounded-md p-3 w-7/12" type="email" id="email" name="email" placeholder="Your email ID" required={true} />
                <button className="h-[50px] bg-[#DE0E0B] w-1/3 text-[14px] text-white px-5 py-auto align-middle items-center rounded-md mx-2" type="submit">Join Waitlist</button>
              </form>
              </div>
            </Flex>
          </div>
        </div>
        <div className=" bg-[#C4EB5F] flex flex-col gap-[60px] lg:py-[80px] lg:px-[40px] py-[60px] px-[20px]">
          <div className="text-left lg:text-center ">
            <h2 className={cn(interFontseven.className,"text-[25px] leading-[37.5px]")}>
              Imagine having someone who knows your tastes, <br /> likes, dislikes & is available 24/7!
            </h2>
            <h3 className={cn(interFontfour.className,"text-[26px] leading-[39px]")}>
              Well, no need to imagine, welcome to Coco AI :)
            </h3>
          </div>
          <div>
            <div className="flex flex-col gap-[20px] align-middle items-center justify-center lg:flex-row">
              <Box rounded="2xl" className="h-[360px] w-[320px] bg-white object-cover overflow-hidden">
                <Flex flexDir="column" className="object-cover">
                  <div className="h-[250px] object-cover"><img src="/feature-1.webp" alt="feature-1" /></div>
                  <div className={cn(monsterratFont.className,"text-[25px] leading-[30px] bg-white font-bold text-wrap p-[30px]")}>Understand Your Unique Style</div>
                </Flex>
              </Box>
              <Box rounded="2xl" className="h-[360px] w-[320px] bg-white object-cover overflow-hidden">
              <Flex flexDir="column" className="object-cover">
                  <div className="h-[250px] object-cover"><img src="/feature-2.webp" alt="feature-2" /></div>
                  <div className={cn(monsterratFont.className,"text-[25px] leading-[30px] bg-white font-bold text-wrap p-[30px]")}>Outfit Calendar &  Digital Wardrobe</div>
                </Flex>
              </Box>
              <Box rounded="2xl" className="h-[360px] w-[320px] bg-white object-cover overflow-hidden">
              <Flex flexDir="column" className="object-cover">
                  <div className="h-[250px] object-cover"><img src="/feature-3.webp" alt="feature-3" /></div>
                  <div className={cn(monsterratFont.className,"text-[25px] leading-[30px] bg-white font-bold text-wrap p-[30px]")}>AI-Powered Personal Shopper</div>
                </Flex>
              </Box>
            </div>
          </div>
          <div className=" text-left lg:text-center">
            <h2 className={cn(interFontseven.className,"leading-[37.5px] text-[25px]")}>JOIN THE  <span className="text-[#F20C0C]">300+</span> PEOPLE IN THE <span className="text-[#F20C0C]"> FASHION REVOLUTION! </span></h2>
          </div>
        </div>
        <div className=" bg-[#7E43AB] py-[40px] px-[20px] text-center align-middle justify-center">
          <h3 className={cn(workSansFont.className,"text-[#FFD6E0]")}>©2024 COCO AI</h3>
        </div>
      </div>


    </>
  )
}
