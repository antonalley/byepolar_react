import React, {useState, useEffect, useRef} from 'react'
import styles from '../../styles/Watch.module.css'

export default function Watch(){
    const queryParams = new URLSearchParams(window.location.search)
    const [DISCUSSION_ID] = useState(queryParams.get('discussion_id'))
    const [loadingVideo, setLoadingVideo] = useState(true);

    const leftVideoRef = useRef(null);
    const rightVideoRef = useRef(null);

    useEffect(() => {
        // Get videos for both sides
        const servers = {
            iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
            ],
            iceCandidatePoolSize: 10,
        };

        const peerConnection = new RTCPeerConnection(servers);

        peerConnection.addEventListener('track', event => {
            console.log("Add Track: ", event)
            // remoteVideoRef.current.srcObject = event.streams[0];
            // setLoadingRemote(false);
        })

    }, [DISCUSSION_ID])


    return (
        <>
        <div id={styles.videos_container}>
            <div id={styles.video_left_container} className={styles.video}>
                {loadingVideo && 
                    <div className="spinner-grow" role="status" style={{position:'absolute'}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                <video id="left-video" ref={leftVideoRef} muted autoPlay></video>
                <h6 className={styles.video_caption}>Left Video</h6>
            </div>
            <div id={styles.video_right_container} className={styles.video}>
                {loadingVideo && 
                    <div className="spinner-grow" role="status" style={{position:'absolute'}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                <video id="right-video" ref={rightVideoRef} autoPlay></video>
                <h6 className={styles.video_caption}>Right Video</h6>
            </div>
        </div>
        </>
    )
}