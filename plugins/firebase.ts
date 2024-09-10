import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    console.log("Initializing Firebase...");

    const config = useRuntimeConfig().public;
    let auth = null;

    const firebaseConfig: FirebaseConfig = {
      apiKey: config.apiKey as string as string,
      authDomain: config.authDomain as string,
      projectId: config.projectId as string,
      storageBucket: config.storageBucket as string,
      messagingSenderId: config.messagingSenderId as string,
      appId: config.appId as string,
      measurementId: config.measurementId as string,
    };

    if (!getApps().length) {
      try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("Firebase initialized");
        nuxtApp.provide("auth", auth);
      } catch (error) {
        console.error(`Firebase init error: ${JSON.stringify(error, null, 2)}`);
      }
    }
  }
});
