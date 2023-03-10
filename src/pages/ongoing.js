import styles from '../styles/Ongoing.module.css'
import React, { useEffect, useState } from 'react';
import { getCurrentDiscussions, getCurrentPrompts } from '../functions/controllers';
import { DebatePreview } from '../components/ongoing_snippet';

export default function Ongoing() {
    const [prompts, setPrompts] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    useEffect(() => {
        async function getData(){
            let current_prompts = await getCurrentPrompts();
            
            let discussions = await getCurrentDiscussions(current_prompts);
            setDiscussions(discussions);
            setPrompts(current_prompts)
        }
        getData()
    }, [])
    return (
        <div>
            <div id={styles.body_container}>
                {prompts.length > 0 ? prompts.map((prompt, i) => {
                    return (
                        <div className={styles.prompt_column}>
                            <h3 className={styles.prompt_title}>{prompt.prompt}</h3>
                            {discussions[i].map(discussion => {
                                return (
                                    <DebatePreview key={discussion.id} discussion={discussion} />
                                )
                            })}
                        </div>
                    )
                })
            :<></>}
            </div>
        </div>
    )
}