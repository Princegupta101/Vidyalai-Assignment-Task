import { createContext } from "react";
import { useState, useEffect } from "react";

export const WindowWidthContext = createContext();

const WindowWidthContextProvider = ({children})=>{
    const [isSmallerDevice, setIsSmallerDevice] = useState(false);
    useEffect(() => {
        const handleResize = () => {
          const width = window.innerWidth;
          setIsSmallerDevice(width < 500);
        };
    
        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const value = {
        isSmallerDevice
    }
    return <WindowWidthContext.Provider value={value}>
        {children}
    </WindowWidthContext.Provider>
}

export  {WindowWidthContextProvider};