import styles from '../styles/Home.module.css'
import { getCurrentPrompts, getFeaturedDiscussion, getUserInfo } from '../functions/controllers'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../hooks/context'


export default function Home() {
  const { userDetail } = useContext(AppContext);
  const [prompts, setPrompts] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    async function fetchData(){
      let current_prompts = await getCurrentPrompts();
      setPrompts(current_prompts)
      let got_featured = await getFeaturedDiscussion();
      let agreeing_user_featured = await getUserInfo(got_featured.agreeing)
      let opposing_user_featured = await getUserInfo(got_featured.opposing)
      setFeatured({
        agreeing: `${agreeing_user_featured.first_name} ${agreeing_user_featured.last_name}`, 
        opposing: `${opposing_user_featured.first_name} ${opposing_user_featured.last_name}`,
        num_viewers: got_featured.num_viewers,
      });
    }
    if (userDetail){
      fetchData();
    }
  }, [userDetail])



  return (
      <div id={styles.body_container}>
        <div id={styles.main_body}> 
            <div id={styles.top_section}>
                <div id={styles.main_text}>
                    Watch or Join Live Discussions Now
                </div>
    
                <div id={styles.featured_discussion}>
                {featured && 
                  <>
                  <span>{featured.agreeing} vs {featured.opposing}</span>
                  <span>{featured.num_viewers} watching</span>
                  <button className={`${styles.watch_live_button} btn btn-outline-primary`}>Watch Live</button>
                  </>
                }
                </div> 
                
            </div>   
            <div id={styles.featured_container}>
                {/* <h3>Featured Discussions of the week</h3> */}
                <div id={styles.topics_list} className={styles.side_list}>
                  {prompts.map(prompt => {
                    return (
                      <div id={`topic-${prompt.id}`} className={styles.side_list_item}>
                        <span className={styles.promptName}>{prompt.prompt}</span>
                        &nbsp;
                        <div>
                          <a href="/ongoing">
                            <button className='btn btn-outline-primary'>Watch Live with {prompt.total_viewers} others</button>
                          </a>
                          &nbsp;
                          <a href={`/stream/join/?prompt_id=${prompt.id}`}>
                            <button className='btn btn-outline-primary'>Join the Discussion</button>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
        </div>
      </div>
  )
}
