// Firebase Authentication for BitcoinZ Admin CMS

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvkAmFSvGx57gCMuXoZ_9ZZT3DUV69ya4",
  authDomain: "bitcoinz-home-page.firebaseapp.com",
  projectId: "bitcoinz-home-page",
  storageBucket: "bitcoinz-home-page.appspot.com",
  messagingSenderId: "78841991032",
  appId: "1:78841991032:web:8b06fd51c835389206028d"
};

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login function
export async function handleLogin() {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('Logged in as:', user.email);
    showCMS();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please contact the site administrator.');
  }
}

// Show CMS after successful login
function showCMS() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('nc-root').style.display = 'block';
  // Initialize CMS after successful login
  window.CMS.init();
}

// Check authentication state
export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user.email);
      showCMS();
    }
  });
}