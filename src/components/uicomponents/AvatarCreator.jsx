import React from 'react';
import { useState } from 'react';
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { Avatar } from "@readyplayerme/visage";
import './AvatarCreator.css';

const config = {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: true,
  language: 'en',
};

const style = { width: '100%', height: '80vh', border: 'none', borderRadius: 10 };

export default function App() {
  // const [avatarUrl, setAvatarUrl] = useState('');
  // setAvatarUrl(event.data.url);

  const handleOnAvatarExported = (event) => {
    console.log(`Avatar URL is: ${event.data.url}`);
    // sessionStorage.setItem('avatarUrl', event.data.url);
    try {
      sessionStorage.setItem('avatarUrl', event.data.url);
      console.log('Avatar URL successfully stored in sessionStorage.');
    } catch (e) {
      console.error('Error storing the Avatar URL in sessionStorage:', e);
    }
  };

  return (
    <div className='frame-container'>
      <AvatarCreator
        subdomain="opulon"
        config={config}
        style={style}
        onAvatarExported={handleOnAvatarExported}
      />
      {/* {avatarUrl && <Avatar modelSrc={avatarUrl} />} */}
      {console.log(sessionStorage)}
    </div>
  );
}




// import React, { useEffect } from 'react';
// import './AvatarCreator.css';

// const AvatarCreator = () => {
//   const subdomain = 'opulon';

//   useEffect(() => {
//     const frame = document.getElementById('frame');
//     frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;

//     function subscribe(event) {
//       const json = parse(event);

//       if (json?.source !== 'readyplayerme') {
//         return;
//       }

//       // Subscribe to all events sent from Ready Player Me once frame is ready
//       if (json.eventName === 'v1.frame.ready') {
//         frame.contentWindow.postMessage(
//           JSON.stringify({
//             target: 'readyplayerme',
//             type: 'subscribe',
//             eventName: 'v1.**',
//           }),
//           '*'
//         );
//       }

//       // Get avatar GLB URL
//       if (json.eventName === 'v1.avatar.exported') {
//         console.log(`Avatar URL: ${json.data.url}`);
//         document.getElementById('avatarUrl').innerHTML = `Avatar URL: ${json.data.url}`;
//         document.getElementById('frame').hidden = true;
//       }

//       // Get user id
//       if (json.eventName === 'v1.user.set') {
//         console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
//       }
//     }

//     function parse(event) {
//       try {
//         return JSON.parse(event.data);
//       } catch (error) {
//         return null;
//       }
//     }

//     window.addEventListener('message', subscribe);
//     document.addEventListener('message', subscribe);

//     return () => {
//       window.removeEventListener('message', subscribe);
//       document.removeEventListener('message', subscribe);
//     };
//   }, [subdomain]);

//   return (
//     <div className='frame-container'>
//       {/* <iframe className='frame' id="frame" title="Avatar Frame" style={{ width: '100%', height: '500px' }} /> */}
//       <iframe className='frame' id="frame" title="Avatar Frame" />
//       <p id="avatarUrl"></p>
//     </div>
//   );
// };

// export default AvatarCreator;

