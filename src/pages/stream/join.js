import Navbar from "../../components/navbar";
import { joinDiscussionQueue } from "../../functions/controllers";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../functions/fb_init";

const Join = () => {
    const [user, setUser] = useState(null);
    const queryParams = new URLSearchParams(window.location.search)
    let prompt_id = queryParams.get('prompt_id')
    useEffect(()=>{
        console.log(prompt_id)
    }, [])
    

    // Check Auth
    let auth = getAuth(app)
    onAuthStateChanged(auth, (user) => {
        if (user){
            // console.log("USER", user.uid)
            setUser(user)
        } else if (process.browser) {
            console.log("User is signed out")
            try {
                window.location = "/auth/login"
            } catch {
                {}
            }
        }
    })

    function chooseSide(side){
        // Join Queue
        // Wait until there is someone on the oppossite queue
        // Create a new room (only on one of the sides so it's not duplicated)
        // Forward address to that room with a query param for what side their on
        joinDiscussionQueue(prompt_id, side, user.uid)
        .then(r => window.location=`/stream/participant?discussion_id=${r}&side=${side}`)
        .catch(e => console.error(e))

    }
    return ( 
        <div>
            <div className="main-content">
                Choose side of the argument to join
                <button onClick={e => {e.preventDefault();chooseSide('agreeing')}}>Agreeing</button>
                <button onClick={e => {e.preventDefault();chooseSide('opposing')}}>Opposing</button>
            </div>
            
        </div>
     );
}
 
export default Join;