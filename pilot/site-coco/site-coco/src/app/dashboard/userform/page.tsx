import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import UserPrefForm from "@/components/UserPrefForm";
import ImageUpload from "@/components/ImageUpload";

export default async function form() {
const { getUser } = getKindeServerSession()
const user = await getUser()

    return (
        <div>
        <UserPrefForm user={user} isAuth={!!user}/>
        <ImageUpload user={user} isAuth={!!user}/>
        
        </div>
    );


}