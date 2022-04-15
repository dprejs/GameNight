import React, {
  createContext, useContext, useEffect, useMemo, useState, FC,
} from 'react';
import { mobileCheck, tabletCheck } from '../components/deviceCheck';

export const DeviceContext = createContext({isMobile: false,
isTablet: false,
});

const DeviceContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    setIsMobile(mobileCheck())
    setIsTablet(tabletCheck());
  }, []);

  const value = useMemo(() => ({ isMobile, isTablet }), [isMobile, isTablet]);
  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContextProvider;
