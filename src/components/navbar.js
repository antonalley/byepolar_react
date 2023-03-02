import styles from '../styles/Navbar.module.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../functions/fb_init';
import { useState } from 'react';
import { getUserInfo } from '../functions/controllers';

const Navbar = () => {
    const [user, setUser] = useState(null);
    onAuthStateChanged(auth, async (user) => {
        if (user){
            let info = await getUserInfo(user.uid);
            setUser(info)
        } 
    })

    return ( 
            <div id={styles.heading}>
                <div id={styles.logos}>
                    <a href="/">
                        <img src="/bear.png" width="70px" height="80px" />
                        <img src="/bye-polar-logo.png" width="140px" />
                    </a>
                </div>
                <div id={styles.search_container}>
                    <a href="/ongoing/">
                        <div className={styles.search_bar}>
                            {/* <!-- <input type="text"> --> */}
                            <span>Watch Live Discussions</span>
                        </div>
                    </a>
                </div>
                <div id={styles.profile_link}>
                    <a href="/auth/login" id={styles.username}>
                        {user ? <strong >{user.first_name}</strong> : "Sign In"}
                    </a>
                    {/* <a href="/auth/login" title="login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                    </svg>
                    </a> */}
                </div>
            </div>
     );
}
 
export default Navbar;