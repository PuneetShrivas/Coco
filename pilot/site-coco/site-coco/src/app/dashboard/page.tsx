import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function Page() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const isLoggedIn = !!user;

    const dbUser = isLoggedIn
        ? await db.user.findFirst({ where: { id: user?.id } })
        : null;

    if (isLoggedIn && (!dbUser || !dbUser.isOnboarded)) {
        return Response.redirect(dbUser ? "/dashboard/onboarding" : "/auth-callback?origin=dashboard");
    }

    return (
        <div aria-hidden="true" style={{ minHeight: "100vh" }}>
            <div className="min-h-screen font-sans antialias bg-[#FFFFFF] flex flex-col">
                <Dashboard
                    user={user}
                    dbUser={dbUser}
                    isLoggedIn={isLoggedIn} 
                />
            </div>
        </div>
    );
}

export default Page;
