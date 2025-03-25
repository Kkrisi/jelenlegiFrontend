import React, { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/axios";


const LogsContext = createContext();

export const LogsProvider = ({ children }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

// LogsContext
  useEffect(() => { 
    myAxios.get("/api/levelek")
      .then(response => { 
          setLetters(response.data);  
          setLoading(false);
      })
      .catch(hiba => {
        console.error('Hiba az adatok betöltésekor:', hiba);
        setLoading(false);
      });
  }, []);  

  
  const LegutoljaraKuldott = () => {
    setLoading(true);  
    myAxios.get("/api/ki-mikor-kapott-legutoljara-penzugyi-dokumentumot")
      .then(response => {
          setLetters(response.data);  
          setLoading(false);
      })
      .catch(hiba => {
        console.error('Hiba az adatok betöltésekor', hiba);
        setLoading(false);
      });
  };

  return (
    <LogsContext.Provider value={{ letters, loading, LegutoljaraKuldott }}>
      {children}
    </LogsContext.Provider>
  );
};

// A hook a context eléréséhez
export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error("useLogs must be used within an AsyncRequestProvider");
  }
  return context;
};
