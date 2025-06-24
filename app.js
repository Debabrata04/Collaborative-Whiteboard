// const API_BASE_URL = process.env.NODE_ENV === 'development' 
//   ? 'http://localhost:3001' 
//   : 'https://your-render-backend-url.onrender.com';
// Application State
let API_BASE_URL;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  API_BASE_URL = 'http://localhost:3001';
} else {
  // Use your Vercel backend URL here
  API_BASE_URL = 'https://backendcolab-production-f82d.up.railway.app';
}

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

// async function createRoom() {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/rooms`, {
//       method: 'POST',
//       mode: 'cors', // ← Critical
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) throw new Error(`HTTP ${response.status}`);
//     const data = await response.json();
//     navigateToWhiteboard(data.roomId, data.secret);
//   } catch (error) {
//     console.error('Fetch Error:', error);
//     alert(`Failed to connect: ${error.message}`);
//   }
// }

async function createRoom() {
  try {
    createRoomBtn.style.display = 'none';
    secretCodeInput.parentElement.style.display = 'none';
    loading.style.display = 'block';
    loadingText.textContent = "Creating your whiteboard room...";

    const response = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Room created:", data); // Add this for debugging
    
    if (data.roomId && data.secret) {
      navigateToWhiteboard(data.roomId, data.secret);
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Create Room Error:', error);
    alert(`Failed to create room: ${error.message}`);
    
    // Reset UI
    createRoomBtn.style.display = 'block';
    secretCodeInput.parentElement.style.display = 'flex';
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
// Add this at the end of your app.js file
createRoomBtn.addEventListener('click', createRoom);
joinRoomBtn.addEventListener('click', joinRoom);
