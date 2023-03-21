import React, { useRef, useContext } from "react";
import { doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { AppContext } from "../../hooks/context";
import styles from "../../styles/Participant.module.css"

const Participant = () => {
    const queryParams = new URLSearchParams(window.location.search)
    const DISCUSSION_ID = queryParams.get('discussion_id')
    const SIDE = queryParams.get('side')
    const { db } = useContext(AppContext);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
        
    const servers = {
        iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
        ],
        iceCandidatePoolSize: 10,
    };
    

    async function setupStream(){
        const pc = new RTCPeerConnection(servers);

        let localStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        })

        localVideoRef.current.srcObject = localStream;
        
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        })

        pc.addEventListener('track', event => {
            console.log("Set Remote Video")
            remoteVideoRef.current.srcObject = event.streams[0];
        })

    if (SIDE==="agreeing"){
        console.log("Caller init")

        // Create offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            type: offerDescription.type,
            sdp: offerDescription.sdp,
        };
        
        updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "offer"), {
            offer: offer
        })
        console.log("Offer updated")

        // Get candidates for caller, save to db
        pc.onicecandidate = (event) => {
            if(event.candidate){
                console.log('Adding callerIceCandidate', event.candidate.toJSON())
                updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "callerIce"), {data:arrayUnion(event.candidate.toJSON())})
                
            }  
        }

        function qq(answer){
            try {
                pc.setRemoteDescription(answer)
                console.log('succesfull remote description')
                return true;
            } catch {
                return false
            }
        }

        // listen for answer
        onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "answer"), async snapshot => {
            const data = snapshot.data()
            if (data?.answer && pc.remoteDescription === null){
                console.log('attempt to set remote description')
                let done = false;
                while (!done){
                    done = qq(data.answer)
                }
            }
        })

        // listen for ice candidates
        onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "answerIce"), snapshot => {
            snapshot.data().data.forEach((c) => {
                const ic = new RTCIceCandidate(c)
                pc.addIceCandidate(ic)
                
            })
        })
    }

    else {
        console.log("Answer Init");

        pc.onicecandidate = (event) => {
            if(event.candidate) {
                console.log("Adding AnswerCandidate")
                console.log(event.candidate.toJSON())
                updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "answerIce"), {'data':arrayUnion(event.candidate.toJSON())})
            }
        };

        // Listen for offer
        onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "offer"), async snapshot => {
            const data = snapshot.data()
            if (data?.offer && pc.remoteDescription === null){
                console.log('Received offer')
                await pc.setRemoteDescription(data.offer);


                // Create offer
                const answerOfferDescription = await pc.createAnswer();
                await pc.setLocalDescription(answerOfferDescription);

                const answerOffer = {
                    type: answerOfferDescription.type,
                    sdp: answerOfferDescription.sdp,
                };
                
                await updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "answer"), {
                    answer: answerOffer
                })
                console.log("answer updated")             
            }
        })

        // Listen for ice candidates
        onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "callerIce"), snapshot => {
            snapshot.data().data.forEach((c) => {
                const ic = new RTCIceCandidate(c)
                pc.addIceCandidate(ic)
                
            })
        })
        

    }
}
    return ( 
        <>
            <button onClick={()=>setupStream()}>Start Session</button>
            <div id={styles.videos_container}>
                <div id={styles.video_left_container}>
                    <video id="local-video" ref={localVideoRef} muted autoPlay></video>
                    <h6 className={styles.video_caption}>Your Video</h6>
                </div>
                <div id={styles.video_right_container}>
                    <video id="remote-video" ref={remoteVideoRef} autoPlay></video>
                    <h6 className={styles.video_caption}>Their Video</h6>
                </div>
            </div>
            

        </>
     );
}
 
export default Participant;