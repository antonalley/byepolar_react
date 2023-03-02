import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import { getCurrentDiscussions, getCurrentPrompts, getFeaturedDiscussion, getUserInfo } from '../functions/controllers'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '../functions/fb_init'


export default function Home(props) {
  const [user, setUser] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [chooseSideOn, setChooseSideOn] = useState(false);
  // Check Auth
  let auth = getAuth(app)
  onAuthStateChanged(auth, (user) => {
    if (user){
      setUser(user)
    } else {
      if (process.browser){
        console.log("User is signed out")
        try {
          window.location = "/auth/login"
        } catch {
          {}
        }
      }
      
    }
  })

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
    fetchData();
  }, [])



  return (
    <div>
      <div id={styles.body_container}>
        <div id={styles.main_body}> 
            <div id={styles.top_section}>
                <div id={styles.main_text}>
                    Watch Discussions Live Now
                </div>
                {featured ? 
                <div id={styles.featured_discussion}>
                  <span>{featured.agreeing} vs {featured.opposing}</span>
                  <span>{featured.num_viewers} watching</span>
                  <button className={`${styles.watch_live_button} btn btn-outline-primary`}>Watch Live</button>
                </div> 
                
                : <></>}
            </div>   
            <div id={styles.featured_container}>
                <h3>Featured Discussions of the week</h3>
                <div id={styles.topics_list} className={styles.side_list}>
                  {prompts.map(prompt => {
                    return (
                      <div id={`topic-${prompt.id}`} className={styles.side_list_item}>
                        <h3>{prompt.prompt}</h3>
                        <div>
                          <a href="/ongoing">
                            <button className='btn btn-outline-primary'>Watch Live with {prompt.total_viewers} others</button>
                          </a>
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
    </div>
  )
}
