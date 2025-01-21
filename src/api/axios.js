import React from 'react'
import axios from "axios";




// Létrehozunk egy új Axios példányt a create metódus segítségével.
export const myAxios = axios.create({
  baseURL: 'http://localhost:8000',
  // Beállítjuk, hogy a kérések azonosítása cookie-k segítségével történik.
  withCredentials: true,
});




myAxios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => {
    // Hiba esetén írjuk ki a hibát, vagy végezzünk hibakezelést
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);
