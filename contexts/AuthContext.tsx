import React, {
  createContext, useContext, useState
} from 'react';
export interface adminContextType {
  adminMode: boolean;
  setAdminMode: React.Dispatch<React.SetStateAction<boolean>>
}
export const AuthContext = createContext<adminContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [adminMode, setAdminMode] = useState(false)

  return (
    <AuthContext.Provider value={{ adminMode, setAdminMode }}>
      {children}
    </AuthContext.Provider>
  );
};
