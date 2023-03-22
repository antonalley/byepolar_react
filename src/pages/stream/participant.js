import React, { useCallback, useState, useRef, useContext, useEffect } from "react";
import { doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { AppContext } from "../../hooks/context";
import styles from "../../styles/Participant.module.css"
import { endDiscussion, startDiscussion } from "../../functions/controllers";

const Participant = () => {
    const queryParams = new URLSearchParams(window.location.search)
    const [DISCUSSION_ID] = useState(queryParams.get('discussion_id'))
    const [SIDE] = useState(queryParams.get('side'))
    const { db } = useContext(AppContext);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [loadingRemote, setLoadingRemote] = useState(true);

    const setupStream = useCallback( async() => {
        const servers = {
            iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
            ],
            iceCandidatePoolSize: 10,
        };

        const peerConnection = new RTCPeerConnection(servers);

        let localStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        })

        localVideoRef.current.srcObject = localStream;
        
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        })

        peerConnection.addEventListener('track', event => {
            // console.log("Set Remote Video")
            remoteVideoRef.current.srcObject = event.streams[0];
            setLoadingRemote(false);
        })

        if (SIDE==="agreeing"){
            // console.log("Caller init")

            // Create offer
            const offerDescription = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offerDescription);

            const offer = {
                type: offerDescription.type,
                sdp: offerDescription.sdp,
            };
            
            updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "offer"), {
                offer: offer
            })
            // console.log("Offer updated")

            // Get candidates for caller, save to db
            peerConnection.onicecandidate = (event) => {
                if(event.candidate){
                    // console.log('Adding callerIceCandidate', event.candidate.toJSON())
                    updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "callerIce"), {data:arrayUnion(event.candidate.toJSON())})
                    
                }  
            }

            function qq(answer){
                try {
                    peerConnection.setRemoteDescription(answer)
                    // console.log('succesfull remote description')
                    startDiscussion(DISCUSSION_ID);
                    return true;
                } catch {
                    return false
                }
            }

            // listen for answer
            onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "answer"), async snapshot => {
                const data = snapshot.data()
                // console.log("Received Answer: ", data)
                if (data?.answer && peerConnection.remoteDescription === null){
                    // console.log('attempt to set remote description')
                    let done = false;
                    while (!done){
                        done = qq(data.answer)
                    }
                }
            })

            // listen for ice candidates
            onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "answerIce"), snapshot => {
                // console.log("Received AnswerIce", snapshot.data())
                snapshot.data().data.forEach((c) => {
                    const ic = new RTCIceCandidate(c)
                    peerConnection.addIceCandidate(ic)
                    
                })
            })
        }

        else {
            // console.log("Answer Init");

            peerConnection.onicecandidate = (event) => {
                if(event.candidate) {
                    // console.log("Adding AnswerCandidate")
                    // console.log(event.candidate.toJSON())
                    updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "answerIce"), {'data':arrayUnion(event.candidate.toJSON())})
                }
            };

            // Listen for offer
            onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "offer"), async snapshot => {
                const data = snapshot.data()
                if (data?.offer && peerConnection.remoteDescription === null){
                    // console.log('Received offer')
                    await peerConnection.setRemoteDescription(data.offer);


                    // Create offer
                    const answerOfferDescription = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answerOfferDescription);

                    const answerOffer = {
                        type: answerOfferDescription.type,
                        sdp: answerOfferDescription.sdp,
                    };
                    // console.log("Updating Answer: ", answerOffer)
                    await updateDoc(doc(db, "Discussions", DISCUSSION_ID, "collections", "answer"), {
                        answer: answerOffer
                    })
                }
            })

            // Listen for ice candidates
            onSnapshot(doc(db, "Discussions", DISCUSSION_ID, "collections", "callerIce"), snapshot => {
                // console.log("Received Caller Ice: ", snapshot.data())
                snapshot.data().data.forEach((c) => {
                    const ic = new RTCIceCandidate(c)
                    peerConnection.addIceCandidate(ic)
                    
                })
            })
            

        }
    }, [DISCUSSION_ID, SIDE, db])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            endDiscussion(DISCUSSION_ID)
            // const confirmationMessage = 'Are you sure you want to leave?';
            // e.returnValue = confirmationMessage;
            // return confirmationMessage;
          };
        window.addEventListener('beforeunload', handleBeforeUnload);

        setupStream();

        return () => {
            endDiscussion(DISCUSSION_ID)
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };
    }, [DISCUSSION_ID, setupStream])

    return ( 
        <>
            {/* <button onClick={()=>setupStream()}>Start Session</button> */}
            <div id={styles.videos_container}>
                <div id={styles.video_left_container} className={styles.video}>
                    <video id="local-video" ref={localVideoRef} muted autoPlay></video>
                    <h6 className={styles.video_caption}>Your Video</h6>
                </div>
                <div id={styles.video_right_container} className={styles.video}>
                    {loadingRemote && 
                        <div className="spinner-grow" role="status" style={{position:'absolute'}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>}
                    <video id="remote-video" ref={remoteVideoRef} autoPlay></video>
                    <h6 className={styles.video_caption}>Their Video</h6>
                </div>
            </div>
            

        </>
     );
}
 
export default Participant;