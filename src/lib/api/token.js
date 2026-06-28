import { headers } from "next/headers"
import { auth } from "../auth"

const getUserSession = async() =>{
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session?.user || null;
}


export const getUserToken = async()=>{
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session?.session?.token || null;
}

export const authHeader = async() =>{
    const token = await getUserToken();
    const header = token?{
        authorization:`Bearer ${token}`
    } : {};
    return header;
}