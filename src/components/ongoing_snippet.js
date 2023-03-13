import React, { useEffect, useState } from "react"
import { getUserInfo } from "../functions/controllers"
import styles from "../styles/Ongoing.module.css"

export function DebatePreview({ discussion }){
    const [agreer, setAgreer] = useState(null);
    const [disagreer, setDisagreer] = useState(null);
    useEffect(() => {
        async function fetchData(){
            let d = await getUserInfo(discussion.opposing);
            let a = await getUserInfo(discussion.agreeing);
            setAgreer(a)
            setDisagreer(d)
        }
        fetchData();
    }, [discussion])

    return (
        <div className={styles.discussion_container}>
            <div className={styles.discussion_container_split}>
                <div className="agree-view">
                    <div><strong>{agreer && agreer.first_name}</strong></div>
                    <div>Agreeing</div>
                </div>
                <div className="opposed-view">
                    <div><strong>{disagreer && disagreer.first_name}</strong></div>
                    <div>Opposing</div>
                </div>
            </div>
            <span>{discussion.num_viewers} viewers</span>
            <div className={styles.watch_button_container}>
                <button className={styles.watch_live_button}>Watch Live</button>
            </div>
        </div>
    )
}