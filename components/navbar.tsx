import NavbarChild from "./nav-child";
import { getSession } from "@/lib/lib";

export default async function Navbar(){

    const session = await getSession()

    return(
        <NavbarChild session={session}/>
    )
}