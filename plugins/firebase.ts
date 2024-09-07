import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  let auth = null;

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
    try {
      initializeApp(firebaseConfig as any);
      auth = getAuth();
    } catch (error) {
      console.log(`firebase init error： ${error}`);
    }
  }

  return {
    provide: {
      auth,
    },
  };
});
