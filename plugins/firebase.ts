import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  if (!getApps().length) {
    const {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      appId,
      measurementId,
    } = config.public;
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      appId,
      measurementId,
    };
    initializeApp(firebaseConfig);
  }

  const auth = getAuth();
  const db = getFirestore();

  return {
    provide: {
      auth,
      db,
    },
  };
});
