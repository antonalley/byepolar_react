import styles from '../../styles/Auth.module.css'
import { auth } from '../../functions/fb_init';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';


const Register = () => {
    const [failed, setFailed] = useState(false);

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
                window.location.href = "/";
            })
            .catch((error) => {
                // Failed to login
                console.error(error);
                setFailed(true);
            })
        }
    }

    return ( 
        <div id={styles.register_main}>
            <div id={styles.register_sub}>
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
            </div>
        </div>
     ); 
}
 
export default Register;