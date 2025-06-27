import { initializeApp, type FirebaseOptions } from '@dbbs/firebase/app'
import { initializeApp as initializeAdminApp } from '@dbbs/firebase/admin'
import { getFirestore } from '@dbbs/firebase/admin-firestore'
import { getAuth } from '@dbbs/firebase/admin-auth'

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

initializeApp(firebaseConfig)
const app = initializeAdminApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
