import { useEffect, useState } from 'react';

export function useInput() {
  const [input, setInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      updateInput(event.code, true);
    };

    const handleKeyUp = (event) => {
      updateInput(event.code, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateInput = (key, value) => {
    setInput((prev) => {
      const keyMapping = {
        ArrowUp: 'forward',
        KeyW: 'forward',
        ArrowDown: 'backward',
        KeyS: 'backward',
        ArrowLeft: 'left',
        KeyA: 'left',
        ArrowRight: 'right',
        KeyD: 'right',
        ShiftLeft: 'shift',
        ShiftRight: 'shift',
        Space: 'jump',
      };

      const action = keyMapping[key];

      // Ensure other key states are not overwritten and maintain simultaneous key presses
      if (action && prev[action] !== value) {
        return { ...prev, [action]: value };
      }

      return prev;
    });
  };

  return input;
}













// import { useEffect, useState } from 'react';

// export function useInput() {
//   const [input, setInput] = useState({
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     shift: false,
//     jump: false,
//   });

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       updateInput(event.code, true);
//     };

//     const handleKeyUp = (event) => {
//       updateInput(event.code, false);
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   const updateInput = (key, value) => {
//     setInput((prev) => {
//       const keyMapping = {
//         ArrowUp: 'forward',
//         KeyW: 'forward',
//         ArrowDown: 'backward',
//         KeyS: 'backward',
//         ArrowLeft: 'left',
//         KeyA: 'left',
//         ArrowRight: 'right',
//         KeyD: 'right',
//         ShiftLeft: 'shift',
//         ShiftRight: 'shift',
//         Space: 'jump',
//       };

//       const action = keyMapping[key];

//       // Only update the state if the value is different from the current state
//       if (action && prev[action] !== value) {
//         return { ...prev, [action]: value };
//       }

//       return prev; // Return the current state if no change
//     });
//   };

//   return input;
// }










// import { useEffect, useState } from 'react';

// export function useInput() {
//   const [input, setInput] = useState({
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     shift: false,
//     jump: false,
//   });

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       updateInput(event.code, true);
//     };

//     const handleKeyUp = (event) => {
//       updateInput(event.code, false);
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   const updateInput = (key, value) => {
//     switch (key) {
//       case 'ArrowUp':
//       case 'KeyW':
//         setInput((prev) => ({ ...prev, forward: value }));
//         break;
//       case 'ArrowDown':
//       case 'KeyS':
//         setInput((prev) => ({ ...prev, backward: value }));
//         break;
//       case 'ArrowLeft':
//       case 'KeyA':
//         setInput((prev) => ({ ...prev, left: value }));
//         break;
//       case 'ArrowRight':
//       case 'KeyD':
//         setInput((prev) => ({ ...prev, right: value }));
//         break;
//       case 'ShiftLeft':
//       case 'ShiftRight':
//         setInput((prev) => ({ ...prev, shift: value }));
//         break;
//       case 'Space':
//         setInput((prev) => ({ ...prev, jump: value }));
//         break;
//       default:
//         break;
//     }
//   };

//   return input;
// }




















// import { useEffect, useState } from "react";

// export const useInput = () => {
//   const [input, setInput] = useState({
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     shift: false,
//     jump: false,
//   });

//   const keys = {
//     ArrowUp: "forward",
//     ArrowDown: "backward",
//     ArrowLeft: "left",
//     ArrowRight: "right",
//     ShiftLeft: "shift",
//     Space: "jump",
//   };

//   const findKey = (key) => keys[key];
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       setInput((prevInput) => ({ ...prevInput, [findKey(e.code)]: true }));
//     };

//     const handleKeyUp = (e) => {
//       setInput((prevInput) => ({ ...prevInput, [findKey(e.code)]: false }));
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("keyup", handleKeyUp);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   return input;
// };
