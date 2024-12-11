import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In Function
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    // Redirect to CMS panel after successful login
    window.location.href = '/admin/cms.html';
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    alert('Login failed. Please try again.');
  }
}

// Authentication State Observer
export function initAuthListener() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, redirect to CMS panel
      window.location.href = '/admin/cms.html';
    } else {
      // No user is signed in, stay on login page
      console.log('No user signed in');
    }
  });
}

// Logout Function
export function logout() {
  auth.signOut().then(() => {
    // Sign-out successful, redirect to login page
    window.location.href = '/admin/index.html';
  }).catch((error) => {
    console.error('Logout Error:', error);
  });
}