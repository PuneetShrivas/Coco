import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { buttonVariants } from "./ui/button"
import localFont from 'next/font/local'
import { Young_Serif } from 'next/font/google'
import { LoginLink, RegisterLink, } from "@kinde-oss/kinde-auth-nextjs/components"
import { ArrowRight } from "lucide-react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
// import UserAccountNav from "./UserAccountNav"
import MobileNav from "./MobileNav"
import { cn } from "@/lib/utils"
const ahsingFont = localFont({ src: '../fonts/Ahsing-Regular.otf' })
const youngSerifFont = Young_Serif({ weight: '400', subsets: ['latin'] })
const Navbar = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()


    return (
        <nav className="absolute h-14 inset-x-0 top-0 z-30 w-full  transition-all pt-2">
            <MaxWidthWrapper className="fixed">
                <div className="flex h-14 items-center justify-between ">
                    <Link href='/' className="flex z-40 text-[12px] w-12 h-12 rounded-full items-center tracking-wider justify-center bg-white text-center">
                        <span className={cn(ahsingFont.className)}>
                            COCO
                        </span>
                    </Link>

                    {/* <Link href='/' className="flex z-40">
                        <span>
                        <Image src="/logo_head.webp" width={85} height={40} quality={100} alt="logo"/> 
                        </span>
                    </Link> */}

                    <MobileNav user={user} isAuth={!!user} />

                    <div className='hidden items-center space-x-4 sm:flex'>
                        {!user ? (
                            <>
                                <Link
                                    href='/features'
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                    })}>
                                    <span className={youngSerifFont.className}>
                                        Features
                                    </span>
                                </Link>
                                <LoginLink
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                    })}>
                                    <span className={youngSerifFont.className}>
                                        Sign In
                                    </span>
                                </LoginLink>
                                <RegisterLink
                                    className={buttonVariants({
                                        size: 'sm',
                                    })}>
                                    <span className={youngSerifFont.className}>
                                        Get started
                                    </span>
                                    {' '}
                                    <ArrowRight className='ml-1.5 h-5 w-5' />
                                </RegisterLink>
                            </>
                        ) : (
                            <>
                                <Link
                                    href='/dashboard'
                                    className={buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                    })}>
                                    <span className={youngSerifFont.className}>
                                        Dashboard
                                    </span>
                                </Link>

                                {/* <UserAccountNav
                                    name={
                                        !user.given_name || !user.family_name
                                            ? 'Your Account'
                                            : `${user.given_name} ${user.family_name}`
                                    }
                                    email={user.email ?? ''}
                                    imageUrl={user.picture ?? ''}
                                /> */}
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar