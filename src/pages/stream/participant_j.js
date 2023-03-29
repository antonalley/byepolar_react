// import { Jutsu } from 'react-jitsi';

import { JitsiMeeting } from "@jitsi/react-sdk";

export function VideoCall() {
  const roomName = 'room-test';

  return (
    <JitsiMeeting
    roomName = {roomName}
    configOverwrite = {{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false
    }}
    interfaceConfigOverwrite = {{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    }}
    userInfo = {{
        displayName: 'YOUR_USERNAME'
    }}
    onApiReady = { (externalApi) => {
        // here you can attach custom event listeners to the Jitsi Meet External API
        // you can also store it locally to execute commands
    } }
    getIFrameRef = { (iframeRef) => { iframeRef.style.height = '400px'; } }
/>
  );
}