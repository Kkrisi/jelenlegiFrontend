import React, { createContext, useContext } from "react";
import { myAxios } from "../api/axios";

// Az AsyncRequestContext meghatározása callback-ek nélkül
const AsyncRequestContext = createContext();

export const AsyncRequestProvider = ({ children }) => {
  // GET kérés
  const get = (url) => {
    return myAxios.get(url)
      .then(response => response.data)
      .catch(error => {
        console.error("Hiba GET kérés közben:", error);
        throw error;
      });
  };

  // POST kérés
  const post = (url, data) => {
    return myAxios.post(url, data)
      .then(response => response.data)
      .catch(error => {
        console.error("Hiba POST kérés közben:", error);
        throw error;
      });
  };

  // PUT kérés
  const put = (url, data) => {
    return myAxios.put(url, data)
      .then(response => response.data)
      .catch(error => {
        console.error("Hiba PUT kérés közben:", error);
        throw error;
      });
  };

  // DELETE kérés
  const del = (url) => {
    return myAxios.delete(url)
      .then(response => response.data)
      .catch(error => {
        console.error("Hiba DELETE kérés közben:", error);
        throw error;
      });
  };

  return (
    <AsyncRequestContext.Provider value={{ get, post, put, delete: del }}>
      {children}
    </AsyncRequestContext.Provider>
  );
};

// A hook a context eléréséhez
export const useAsyncRequest = () => {
  const context = useContext(AsyncRequestContext);
  if (!context) {
    throw new Error("useAsyncRequest must be used within an AsyncRequestProvider");
  }
  return context;
};
