/* eslint-disable */
import React,{useEffect, useState} from 'react'
import Draggable from 'react-draggable';
import { MeetingMediator } from '../../../riff-dashboard-page/src/components/Chat/Meeting/MeetingSidebar/MeetingMediator';

export default ({ displayName, webRtcPeers }) => {
  const size = useWindowSize();
  const bounds = { left: -200, top: -250, right: size.width - 26, bottom: size.height - 26 };

  return (
    <Draggable bounds={bounds}>
        <div
            id = 'meeting-mediator-wrapper'>
            <MeetingMediator
                displayName = { displayName }
                isEnabled = { true }
                webRtcPeers = { webRtcPeers } />
        </div>
    </Draggable>
  )
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}