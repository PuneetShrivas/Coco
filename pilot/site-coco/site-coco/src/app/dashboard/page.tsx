import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

const Page = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser();

    if (!user || !user.id) {
        console.log("couldn't get user")
        redirect('/auth-callback?origin=dashboard')
    }

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!dbUser) {
        console.log("user not in db")
        redirect('/auth-callback?origin=dashboard')
    }
    return (
        <div
            aria-hidden="true"
            style={{
                minHeight: "100vh",
            }}
        >
            <div className="min-h-screen font-sans antialias bg-[#F2F2F2] grainy flex flex-col">

                <Dashboard user={user} />
            </div>
            
        </div>
    )
}

export default Page