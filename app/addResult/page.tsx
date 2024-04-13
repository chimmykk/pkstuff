import { redirect } from "next/navigation";
import Add from "./add";

import { getSession } from "@/lib/lib";

export default async function AddResult(){

    const session = await getSession()

    if(!session){
        redirect('/')
    }

    return(
        <main>
            <Add />
        </main>
    )
}