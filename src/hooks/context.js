import { createContext, useEffect, useState } from "react";
import { getUserInfo } from "../functions/controllers";
import React from "react";
import { auth, db, app } from "../functions/fb_init";
import { onAuthStateChanged } from "firebase/auth";


export const AppContext = createContext({userDetail:null, db:db, auth:auth, app:app})


export function AppContextProvider({ children }){
    const [userDetail, setUserDetail] = useState(null);

    useEffect(() => {
        // Check Auth
        onAuthStateChanged(auth, async (user) => {
            if (user){
                let detail = await getUserInfo(user.uid)
                setUserDetail(detail)
                // console.log("Set User Detail: ", detail)
            }  else if (!window.location.href.includes("/auth")) {
                window.location = "/auth/login"
            }
        })
    }, [])
    

    return (
        <AppContext.Provider value={{ userDetail, db, auth, app }}>
            {children}
        </AppContext.Provider>
    )
}