import { useLayoutEffect, useState } from "react";
// import { collection, doc, getDoc } from 'firebase/firestore/lite';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../functions/fb_init';
import { useEffect } from "react";

const Participant = () => {
    const queryParams = new URLSearchParams(window.location.search)
    let DISCUSSION_ID = queryParams.get('discussion_id')
    let SIDE = queryParams.get('side')

    console.log(
        "Discussion_id", DISCUSSION_ID
    )
        
    const servers = {
        iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
        ],
        iceCandidatePoolSize: 10,
    };
    
    // Global State
    // const [pc, setPC] = useState(null);
    // if (process.browser){
    //     setPC(new window.RTCPeerConnection(servers));
    // }
    // const [localStream, setLocalStream] = useState(null);
    // const [remoteStream, setRemoteStream] = useState(null);
    // const [Caller, setCaller] = useState(null);
    // const [Offer, setOffer] = useState(null)

    // const [answerCandidate, setAnswerCandidate] = useState(null);
    // const [answer, setAnswer] = useState(null);


    async function setupStream(pc){
        let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        let remoteStream = new MediaStream();
        

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        })

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track)
            })
            console.log("Set Remote Stream")
        }

        document.getElementById("local-video").srcObject = localStream;
        document.getElementById("remote-video").srcObject = remoteStream;

        if (SIDE==="agreeing"){
            caller_init(pc);
        } else {
            answer_init(pc);
        }
    }

    async function caller_init(pc){
        console.log("Caller init")
        // Agreeing users always call opposing users
        // TODO add a timeout function in case the document didn't finish being created yet
        var discussionDoc = null;
        // let interval = setInterval(() =>{
        //     try{
        //         discussionDoc = doc(db, "Discussions", DISCUSSION_ID);
        //         console.log("Got DiscussionDoc")
        //     } catch(error){
        //         console.error("Failed to get doc for this discussion", error)
        //     } finally {
        //         clearInterval(interval)
        //     }
        // }, 1000)
        // let discussionDoc = doc(db, "Discussions", DISCUSSION_ID);
        while(discussionDoc == null){
            try{
                // console.log(db)
                // console.log(DISCUSSION_ID)
                discussionDoc = doc(db, "Discussions", DISCUSSION_ID);
            } catch {
                discussionDoc = null;
            }
        }

        // Get candidates for caller, save to db
        pc.onicecandidate = (event) => {
            // event.candidate && callingCandidates.add(event.candidate.toJSON())
            console.log('On Ice Candidate update caller')
            event.candidate && updateDoc(discussionDoc, {
                caller: event.candidate.toJSON()
            })
        }

        // Create offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };
        
        // await callDoc.set({ offer });
        await updateDoc(discussionDoc, {
            offer: offer
        })
        console.log("Offer updated")

        // Listen for remote answer
        let answer = null;
        let answerCandidate = null;

        var stopSnapshot = onSnapshot(discussionDoc, (snapshot) => {
            console.log("snapshot")
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer && answer == null) {
                console.log("Answer found")
                const answerDescription = new window.RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
                // setAnswer(answerDescription);
                answer = answerDescription;
            }
            if (data?.answerCandidate && answerCandidate == null){
                console.log("Answer Candidate found")
                const candidate = new window.RTCIceCandidate(data.answerCandidate);
                pc.addIceCandidate(candidate);
                // setAnswerCandidate(candidate);
                answerCandidate = candidate;
            }
            if (!pc.currentRemoteDescription && data?.answer && data?.answerCandidate) {
                console.log("Stopping snapsot")
                stopSnapshot();
            }
        });
    }

    async function answer_init(pc){
        console.log("Answer Init")

        // TODO add a timeout function in case the document didn't finish being created yet
        var discussionDoc = null;
        // let interval = setInterval(() =>{
        //     try{
        //         discussionDoc = doc(db, "Discussions", DISCUSSION_ID);
        //         console.log("Got DiscussionDoc")
        //     } catch(error){
        //         console.error("Failed to get doc for this discussion", error)
        //     } finally {
        //         clearInterval(interval)
        //     }
        // }, 1000)
        while(discussionDoc == null){
            try{
                // console.log(db)
                // console.log(DISCUSSION_ID)
                discussionDoc = doc(db, "Discussions", DISCUSSION_ID);
            } catch {
                discussionDoc = null;
            }
        }
        // let discussionDoc = doc(db, "Discussions", DISCUSSION_ID);

        pc.onicecandidate = (event) => {
            // event.candidate && answerCandidates.add(event.candidate.toJSON());
            console.log("On ice candidate AnswerCandidate")
            event.candidate && updateDoc(discussionDoc, {
                answerCandidate: event.candidate.toJSON()
            })
        };

        let Caller = null;
        let Offer = null;

        var stopSnapshot = onSnapshot(discussionDoc, async (snapshot) => {
            const data = snapshot.data();
            console.log("Snapshot")
            if (data?.caller && data?.offer) {
                console.log("Won't snapshot again A")
                stopSnapshot();
                console.log("Won't snapshot again B")

                Offer = data.offer;
                console.log("Found Offer",Offer)
                await pc.setRemoteDescription(new window.RTCSessionDescription(Offer));
        
                const answerDescription = await pc.createAnswer();
                await pc.setLocalDescription(answerDescription);
        
                const answer = {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                };
                
                // await updateDoc
                updateDoc(discussionDoc, {
                    answer: answer
                })

                Caller = data.caller;
                console.log("Found Caller", data.caller)
                pc.addIceCandidate(new window.RTCIceCandidate(data.caller));
                // setCaller(data.caller)
                
            // }
            // if (data?.offer && Offer == null){
                
                // setOffer(data.offer)
                
            }
            // if (data?.caller && Caller == null && data?.offer && Offer == null) {
            //     console.log("Stopping Snapshot C")
            //     stopSnapshot();
            // }
        })

    }

        
    useEffect(() => {
        console.log('a', DISCUSSION_ID)
        const pc = new window.RTCPeerConnection(servers);
        setupStream(pc);
        
        // if (SIDE==="agreeing"){
        //     caller_init(pc);
        // } else {
        //     answer_init(pc);
        // }
        // if agreeing
        //
        // if opposing
        // answer_init();
    }, [])
        

    return ( 
        <div>
            <h1>My Video</h1>
            <video id="local-video" autoPlay playsInline></video>

            
            <h1>Their Video</h1>
            <video id="remote-video" autoPlay playsInline></video>
            

        </div>
     );
}
 
export default Participant;