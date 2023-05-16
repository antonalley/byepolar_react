import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
// import FlvJsPlayer from 'flv.js';
import flvjs from 'flv.js';

const LiveStream = () => {
  const [streamKey, setStreamKey] = useState('');
  const [flvPlayer, setFlvPlayer] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startPublishing = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      const rtmpConfig = {
        url: `rtmp://localhost:1935/live/${streamKey}`,
      };

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      const mediaStream = new MediaStream([videoTrack, audioTrack]);
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
    
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const url = URL.createObjectURL(blob);
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url,
        });
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
    
        const socket = io('http://localhost:3001');
        socket.emit('publish', streamKey);
        socket.on('connect', () => {
          const socketStream = socket.io.engine.transport.socket.stream;
          socketStream.write(Buffer.from([0x02, ...rtmpConfig.url]));
          const header = Buffer.from([
            0x40,
            0x0f,
            0x00,
            0x00,
            0x00,
            0x00,
          ]);
          const data = Buffer.from([
            0x00,
            0x00,
            0x00,
            0x07,
            0x01,
            ...rtmpConfig.url,
            0x00,
          ]);
          socketStream.write(header);
          socketStream.write(data);
          const timestamp = Date.now();
          setInterval(() => {
            const header = Buffer.from([0x40, 0x16, 0x00, 0x00, 0x00, 0x00]);
            const data = Buffer.from([
              0x00,
              0x00,
              0x00,
              0x00,
              ...bytes,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
              0x00,
            ]);
            const currentTime = Date.now();
            const diff = currentTime - timestamp;
            timestamp = currentTime;
            header.writeUInt32BE(diff, 2);
            socketStream.write(header);
            socketStream.write(data);
          }, 10);
        });

        // TODO: would save video to firebase here file
        // const storageRef = firebase.storage().ref();
        // const filename = `${streamKey}-${Date.now()}.webm`;
        // const fileRef = storageRef.child(filename);
        // const snapshot = await fileRef.put(blob);

        // console.log('Uploaded file', snapshot.metadata.name);
      };
    
      mediaRecorder.start();
    } catch (error) {
      console.error(error);
    }
    };

    const startWatching = () => {
        const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: `http://localhost:8000/live/${streamKey}.flv`,
        });
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();

        const socket = io('http://localhost:3001');
        socket.emit('subscribe', streamKey);
    };

    return (
        <div>
            <input
                type="text"
                value={streamKey}
                onChange={(event) => setStreamKey(event.target.value)}
                />
            <button onClick={startPublishing}>Start publishing</button>
            <button onClick={startWatching}>Start watching</button>
            <video ref={videoRef} autoPlay  crossOrigin="anonymous"/>
        </div>
    );
};

export default LiveStream;
    
