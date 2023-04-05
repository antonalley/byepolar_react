import styles from '../../styles/Auth.module.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from 'react';
import { setUserInfo } from '../../functions/controllers';
import { AppContext } from '../../hooks/context';


const Register = () => {
    const [failed, setFailed] = useState(false);
    const [uid, setUid] = useState(null);
    const { auth } = useContext(AppContext);

    function registerUser(e){
        e.preventDefault()
        let email = e.target.userEmail.value;
        let password = e.target.userPassword.value;
        let verifyPassword = e.target.verifyPassword.value;
        if (verifyPassword !== password){
            setFailed(true);
            return;
        }
        if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in and subscribed
                const user = userCredential.user;
                setUid(user.uid);
                // window.location.href = "/";
            })
            .catch((error) => {
                // Failed to login
                console.error(error);
                setFailed(true);
            })
        }
    }

    async function handleSetNames(e){
        e.preventDefault();
        let first_name = e.target.firstname.value;
        let last_name = e.target.lastname.value;
        await setUserInfo(uid, first_name, last_name);
        window.location.href = "/";
    }

    return ( 
        <div id={styles.register_main}>
            <div id={styles.register_sub}>
                {!uid ?
                    <>
                    <h1>Register</h1>
                    <form onSubmit={registerUser}>
                    <div className="mb-3">
                        <label htmlFor="userEmail" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="userEmail" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userPassword" className="form-label">Password</label>
                        <input type="password" className="form-control" id="userPassword" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="verifyPassword" className="form-label"><em>Verify Password</em></label>
                        <input type="password" className="form-control" id="verifyPassword" />
                    </div>
                    {failed && <div className={styles.failed}>Failed to Sign up, try again</div>}
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    </>
                : 
                    <>
                    <h3>Tell us about yourself</h3>
                        <form onSubmit={handleSetNames}>
                            <div className="mb-3">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstname" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label"><em>Last Name</em></label>
                                <input type="text" className="form-control" id="lastname" />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </>}
                     
                     
                     
            <div><p style={{maxWidth:'400px'}}><strong>DISCLAIMER</strong>
                By signing and making an account you are agreeing to participate in an early Alpha of the product.
                Please not that it is janky and probably wont work most of the time, but it is free and a great way to practice for you debates.
                Please know that you are using the cite at your own risk and are agreeing by signing up to take responsibility for anything that 
                may happen while using the cite. If you feel uncomfortable while video calling anyone you are responsible for leaving that page 
                immediately, and please let us know the user name and we will review the profile. The number to text for that is in the discussion prompts.
            </p></div>
            </div>
        </div>
     ); 
}
 
export default Register;
