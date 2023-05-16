import { joinDiscussionQueue, leaveDiscussionQueue } from "../../functions/controllers";
import React, { useState, useContext, useEffect } from "react";
import styles from '../../styles/Join.module.css'
import { AppContext } from "../../hooks/context";

const Join = () => {
    const [isAgreeing, setIsAgreeing] = useState(false);
    const [isOpposing, setIsOpposing] = useState(false);
    const { userDetail } = useContext(AppContext);

    function chooseSide(side){
        const queryParams = new URLSearchParams(window.location.search)
        let prompt_id = queryParams.get('prompt_id')
        // Join Queue
        // Wait until there is someone on the oppossite queue
        // Create a new room (only on one of the sides so it's not duplicated)
        // Forward address to that room with a query param for what side their on
        joinDiscussionQueue(prompt_id, side, userDetail.id)
        .then(r => window.location=`/stream/participant?discussion_id=${r}&side=${side}`)
        .catch(e => console.error(e))

    }

    const handleAgreeClick = (e) => {
        e.preventDefault();
        setIsAgreeing(true);
        // perform agree action here
        chooseSide('agreeing')
    };
    
    const handleOpposeClick = (e) => {
        e.preventDefault();
        setIsOpposing(true);
        // perform oppose action here
        chooseSide('opposing')
    };

    
        
    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const prompt_id = queryParams.get('prompt_id');
                await leaveDiscussionQueue(prompt_id, isAgreeing ? 'agreeing' : 'opposing' , userDetail.id);
            } catch (error) {
                console.log('Error leaving queue:', error);
            }
        }
        
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isAgreeing, userDetail])
      
    return (
        <div>
            <div className={styles.background}>
                <div className={styles.video}></div>
                <div className={styles.video}></div>
            </div>
            <div className={styles.overlay}>
            <div className={styles.content}>
                <h1>Choose a side</h1>
                <div className={styles.buttons}>
                <button
                    className="btn btn-primary"
                    onClick={handleAgreeClick}
                    disabled={isAgreeing || isOpposing || userDetail === null}
                >
                    {isAgreeing ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                    "Democrat"
                    )}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleOpposeClick}
                    disabled={isAgreeing || isOpposing || userDetail === null}
                >
                    {isOpposing ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                    "Republican"
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
      );
}
 
export default Join;