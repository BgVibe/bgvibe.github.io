// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Your Firebase config (DO NOT share your keys publicly)
const firebaseConfig = {
  apiKey: "AIzaSyBSrLYNapjv2fj6NlVjOSknGPdp1ORlC_o",
  authDomain: "social-media-test-ae2ce.firebaseapp.com",
  projectId: "social-media-test-ae2ce",
  storageBucket: "social-media-test-ae2ce.firebasestorage.app",
  messagingSenderId: "471274525996",
  appId: "1:471274525996:web:11ac8d287a75c689d4c889",
  measurementId: "G-F1RZM00JSN"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const appEl = document.getElementById('app');
const authEl = document.getElementById('auth');
const userEmailEl = document.getElementById('userEmail');
const postTextEl = document.getElementById('postText');
const feedEl = document.getElementById('feed');

// 🔐 Register new user
window.register = async () => {
  const email = emailEl.value;
  const password = passwordEl.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};

// 🔓 Login
window.login = async () => {
  const email = emailEl.value;
  const password = passwordEl.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};

// 🚪 Logout
window.logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error.message);
  }
};

// 🔁 Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    authEl.style.display = 'none';
    appEl.style.display = 'block';
    userEmailEl.textContent = user.email;
    loadFeed();
  } else {
    authEl.style.display = 'block';
    appEl.style.display = 'none';
    feedEl.innerHTML = '';
  }
});

// ✏️ Submit a post
window.submitPost = async () => {
  const text = postTextEl.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "posts"), {
      text: text,
      email: auth.currentUser.email,
      timestamp: new Date()
    });
    postTextEl.value = '';
  } catch (error) {
    alert("Failed to post: " + error.message);
  }
};

// 📰 Load feed from Firestore in real-time
function loadFeed() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    feedEl.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      postDiv.innerHTML = `
        <b>${data.email}</b><br>
        ${data.text}
      `;
      feedEl.appendChild(postDiv);
    });
  });
}
