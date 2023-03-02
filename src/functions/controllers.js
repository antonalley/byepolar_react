import { db } from './fb_init';
// import { getDocs, where, query, limit, orderBy, updateDoc, arrayUnion, collection, doc as doclite } from 'firebase/firestore/lite';
import {getDocs, getDoc, setDoc, where, query, limit, orderBy, updateDoc, arrayUnion, collection, Timestamp, arrayRemove} from 'firebase/firestore'
import { doc, onSnapshot } from 'firebase/firestore'
import { uuidv4 } from '@firebase/util';
export async function getCurrentPrompts() {
    var prompts = [];
    try{
        let prompt_col = collection(db, 'Prompts')
        let qq = query(prompt_col, where("is_current", "==", true))
        let prompts_snapshot = await getDocs(qq)
        prompts = prompts_snapshot.docs.map(doc => Object.assign(doc.data(), {id:doc.id}))
    } catch(error) {
        console.log("Failed to get prompts: \n", error)
    }
    return Array.from(prompts);
}

export async function getCurrentDiscussions(prompts) {
    const prompt_ids = prompts.map(p => p.id)
    var discussions = [];
    try{
        let dis_col = collection(db, 'Discussions')
        for (const prompt of prompt_ids) {
            let discussions_snapshot = await getDocs(query(dis_col, where("prompt", "==", prompt)))
            discussions.push(discussions_snapshot.docs.map(doc => Object.assign(doc.data(), {url:`discussion-${doc.id}`})))
        };       
    } catch(error) {
        console.log("Failed to get discussions: \n", error)
    }
    return discussions;
}

export async function getFeaturedDiscussion() {
    let featured = []
    try {
        let featured_col = collection(db, 'Discussions')
        let featured_query = query(featured_col, orderBy("num_viewers"), limit(1))
        let featured_snapshot = await getDocs(featured_query);
        featured = featured_snapshot.docs.map(doc => doc.data())
        return featured[0]
    } catch(error) {
        console.log("Failed to get featured discussion", error)
        return null;
    }
}

/**
 * 
 * @param {string} prompt_id 
 * @param {string} position agreeing|opposing
 * @returns a promise when there is a match that will return a discussion id
 */
export async function joinDiscussionQueue(prompt_id, position, uid) {
    try {
        let q = doc(db, "Prompts", prompt_id)

        if (position=="agreeing"){
            await updateDoc(q, {
                agreeing_queue: arrayUnion(uid)
            })
            return new Promise((resolve, reject) => {
                var stopSnapshot = onSnapshot(q, async (snapshot) => {
                    let aq = snapshot.get("agreeing_queue")
                    let oq = snapshot.get("opposing_queue")
                    console.log("Got Snapshot", oq)
                    // Wait until there is someone in the opposing queue
                    if (oq.length > 0 && aq.length > 0){
                        // create new discussion, remove self and opposing from queues, resolve()
                        let uid_opposing = oq[0];
                        let new_discussion_id = uuidv4()
                        await setDoc(doc(db, "Discussions", new_discussion_id), {
                            agreeing: uid,
                            opposing: uid_opposing,
                            audience_rating: 0,
                            num_viewers: 0,
                            prompt: prompt_id,
                            start_time: Timestamp.now(),
                            status: "missing_1",
                            topic: "",
                        })
                        // await setDoc(doc(db, "Discussions", new_discussion_id, "call_info", "1"), {})
                        // await setDoc(doc(db, "Discussions", new_discussion_id, "answer_info", "1"), {})
                        await setDoc(doc(db, "Discussions", new_discussion_id, "collections", "offer"), {})
                        await setDoc(doc(db, "Discussions", new_discussion_id, "collections", "answer"), {})
                        await setDoc(doc(db, "Discussions", new_discussion_id, "collections", "callerIce"), {data:[]})
                        await setDoc(doc(db, "Discussions", new_discussion_id, "collections", "answerIce"), {data:[]})
                        await updateDoc(q, {
                            agreeing_queue: arrayRemove(uid),
                            opposing_queue: arrayRemove(uid_opposing),
                        })
                        resolve(new_discussion_id);
                        stopSnapshot();
                    }
                    
                })
            })
        } else{
            await updateDoc(q, {
                opposing_queue: arrayUnion(uid)
            })
            let discussions = query(collection(db, "Discussions"), where("opposing", "==", uid))
            return new Promise((resolve, reject) => {
                onSnapshot(discussions, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            resolve(change.doc.id)
                        }
                    })
                })
            })
        }
        
        
    } catch(error) {
        console.log("Error Joining the Discussion queue", error)
        return null;
    }
}

/**
 * Get the information about a user from their id
 * @param {string} user_id 
 */
export async function getUserInfo(user_id){
    let user_doc = await getDoc(doc(db, "Users", user_id))

    return user_doc.data()
}