import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCZ5vQpxh5U2RAKeo2TK50mCe9trs7hN9A',
  authDomain: 'chat-project-55555.firebaseapp.com',
  projectId: 'chat-project-55555',
  storageBucket: 'chat-project-55555.appspot.com',
  messagingSenderId: '66615029820',
  appId: '1:66615029820:web:6d28bda3cae2a893ed1339'
})

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp)

console.log(auth)
