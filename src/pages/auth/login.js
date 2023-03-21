import { signInWithEmailAndPassword } from 'firebase/auth'
// import firebaseui from "firebaseui"
import React, { useContext, useState } from "react";
import styles from '../../styles/Auth.module.css'
import { AppContext } from '../../hooks/context';

const Login = () => {
    const [failed, setFailed] = useState(false);
    const { auth } = useContext(AppContext);

    function handleLogin(e){
        e.preventDefault()
        let email = e.target.userEmail.value;
        let password = e.target.userPassword.value;
        if (email && password) {
            signInWithEmailAndPassword (auth, email, password)
            .then((userCredential) => {
                // Signed in and subscribed
                // const user = userCredential.user;
                window.location.href = "/";
            })
            .catch((error) => {
                // Failed to login
                console.error(error);
                setFailed(true);
            })
        }
    }
    // const loadfirebaseui = useCallback(async () => {
    //     const firebaseui = await import("firebaseui");
    //     // Initialize the FirebaseUI Widget using Firebase.
    //     var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(app));
    //     ui.start('#firebaseui-auth-container', {
    //         signInOptions: [
    //             EmailAuthProvider.PROVIDER_ID,
    //             // FacebookAuthProvider.PROVIDER_ID,
    //             // GoogleAuthProvider.PROVIDER_ID,
    //         ],
    //         signInSuccessUrl:"/"
    //         // Other config options...
    //     });
    // })

    // useEffect(() => {
    //     loadfirebaseui();
    // }, [])
    
    return ( 
        <div id={styles.login_main}>
            <div id={styles.login_sub}>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="userEmail" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="userPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="userPassword" />
                </div>
                {failed && <span>Failed to Sign up, try again</span>}
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                &nbsp;
                <a href="/auth/register">Create an account</a>
            </div>
        </div>
    );
}
 
export default Login;