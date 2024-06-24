// pages/_app.js

import { useEffect } from 'react';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const checkAuthToken = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {});

      if (!cookies.authToken) {
        const password = window.prompt("Please enter the password:");
        if (password) {
          document.cookie = `authToken=${password}; path=/; max-age=86400000; secure; samesite=strict`;
        }
      }
    };

    checkAuthToken();
  }, []);

  return <Component {...pageProps} />;
}