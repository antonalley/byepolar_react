import {  } from './index';
import {  } from './index';
import { getAuth, EmailAuthProvider, FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth'
// import firebaseui from "firebaseui"
import { useCallback, useEffect } from "react";
import { app } from '../../functions/fb_init'


const Login = (props) => {

    const loadfirebaseui = useCallback(async () => {
        const firebaseui = await import("firebaseui");
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(app));
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                EmailAuthProvider.PROVIDER_ID,
                // FacebookAuthProvider.PROVIDER_ID,
                // GoogleAuthProvider.PROVIDER_ID,
            ],
            signInSuccessUrl:"/"
            // Other config options...
        });
    })

    useEffect(() => {
        loadfirebaseui();
    }, [])
    
    return ( 
        <div>
            <h1>Login</h1>
            <div id="firebaseui-auth-container">

            </div>
        </div> 
    );
}
 
export default Login;