import React from 'react'
import axios from "axios";
import Cookies from "js-cookie";




// Létrehozunk egy új Axios példányt a create metódus segítségével.
export const myAxios = axios.create({
  baseURL: 'http://localhost:8000',
  // Beállítjuk, hogy a kérések azonosítása cookie-k segítségével történik.
  withCredentials: true,
});



/*
// Tokenek hozzáadása minden kéréshez
myAxios.interceptors.request.use(
  (config) => {
    // CSRF token lekérése a cookie-ból
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
    }

    // Hozzáadjuk az Authorization fejlécet, ha van tárolt authToken
    const authToken = Cookies.get("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

//  401-es válasz esetén automatikus kijelentkeztetés
myAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Hitelesítési hiba! Automatikus kijelentkeztetés...");
      Cookies.remove("authToken"); // Token törlése
      window.location.href = "/bejelentkezes"; // Átirányítás a bejelentkezési oldalra
    }
    return Promise.reject(error);
  }
);*/








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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);
