// import { database } from 'firebase-config.js';
// import { ref, push, set, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// export async function createRoom(isPublic = true) {
//   try {
//     const roomRef = ref(database, 'rooms');
//     const newRoomRef = push(roomRef);
//     await set(newRoomRef, {
//       isPublic,
//       createdAt: Date.now(),
//       users: {},
//       drawings: {}
//     });
//     return newRoomRef.key;
//   } catch (error) {
//     console.error("Error in createRoom:", error);
//     throw error;
//   }
// }

// export function listenToRoom(roomId, callback) {
//   const drawingsRef = ref(database, `rooms/${roomId}/drawings`);
//   onChildAdded(drawingsRef, (snapshot) => {
//     callback(snapshot.val());
//   });
// }

// export function sendDrawing(roomId, drawingData) {
//   const drawingsRef = ref(database, `rooms/${roomId}/drawings`);
//   push(drawingsRef, drawingData);
// }

// export function clearRoomDrawings(roomId) {
//   const drawingsRef = ref(database, `rooms/${roomId}/drawings`);
//   remove(drawingsRef);
// }



// / Add this at the top of your app.js
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : 'https://your-render-backend-url.onrender.com';
// Application State
let currentRoomId = null;
let currentRoomSecret = null;

// DOM Elements
const createRoomBtn = document.getElementById('create-room');
const joinRoomBtn = document.getElementById('join-room');
const secretCodeInput = document.getElementById('secret-code');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');

// Generate random secret
function generateSecret() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Navigate to whiteboard
function navigateToWhiteboard(roomId, secret) {
  window.location.href = `whiteboard.html?room=${roomId}&secret=${secret}`;
}

// Parse secret code
function parseSecretCode(secretCode) {
  try {
    const [roomId, secret] = secretCode.split(':');
    return { roomId, secret };
  } catch (e) {
    return null;
  }
}

// Create a new room
// Replace createRoom and joinRoom functions with API calls

async function createRoom() {
  try {
    createRoomBtn.style.display = 'none';
    secretCodeInput.parentElement.style.display = 'none';
    loading.style.display = 'block';
    
    const response = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST'
    });
    
    const data = await response.json();
    navigateToWhiteboard(data.roomId, data.secret);
  } catch (error) {
    console.error("Failed to create room:", error);
    alert("Error creating room. Please try again.");
    createRoomBtn.style.display = 'flex';
    loading.style.display = 'none';
  }
}

async function joinRoom() {
  const secretCode = secretCodeInput.value.trim();
  if (!secretCode) {
    alert('Please enter a secret code');
    return;
  }
  
  const [roomId, secret] = secretCode.split(':');
  if (!roomId || !secret) {
    alert('Invalid secret code format');
    return;
  }
  
  try {
    createRoomBtn.style.display = 'none';
    secretCodeInput.parentElement.style.display = 'none';
    loading.style.display = 'block';
    loadingText.textContent = "Joining whiteboard room...";
    
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}?secret=${secret}`);
    const data = await response.json();
    
    if (data.valid) {
      navigateToWhiteboard(roomId, secret);
    } else {
      throw new Error('Invalid secret code');
    }
  } catch (error) {
    alert('Invalid room or secret code');
    loading.style.display = 'none';
    secretCodeInput.parentElement.style.display = 'flex';
  }
}

