import { redirect } from "next/navigation";
import List from "./ist";
import { getSession } from "@/lib/lib";

export default async function StudentList(){

    const session = await getSession()

    if(!session) {
        redirect('/')
    }

    return(
        <List />
    )
}