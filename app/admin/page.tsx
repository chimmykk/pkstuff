import { getSession, logout } from "@/lib/lib";
import { redirect } from "next/navigation";
import Admin from "./main";

export default async function  AdminPage(){
    const session = await getSession()

    if (session){
        return(
            <Admin />
        )
    } else {
        redirect('/authentication')
    }
}