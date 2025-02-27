import { initializeApp, type FirebaseOptions } from '@dbbs/firebase/app'

const test = process.env.WEB_SPA_FIREBASE_API_KEY
console.log(test)
const firebaseOptions: FirebaseOptions = {
  apiKey: process.env.WEB_SPA_FIREBASE_API_KEY,
  authDomain: process.env.WEB_SPA_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.WEB_SPA_FIREBASE_PROJECT_ID,
  storageBucket: process.env.WEB_SPA_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.WEB_SPA_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.WEB_SPA_FIREBASE_APP_ID
}

const firebaseApp = initializeApp(firebaseOptions)

export { firebaseApp }
