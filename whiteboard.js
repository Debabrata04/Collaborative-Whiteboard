

import { database } from './firebase-config.js';
import { ref, onChildAdded, push, set, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
// Application State
let currentRoomId = null;
let currentRoomSecret = null;
let currentUserId = null;
let whiteboard = null;
let users = {};

// DOM Elements
const whiteboardPage = document.getElementById('whiteboard-page');
const backHomeBtn = document.getElementById('back-home');
const shareLink = document.getElementById('share-link');
const secretCodeDisplay = document.getElementById('secret-code-display');
const copyLinkBtn = document.getElementById('copy-link');
const copyRoomLinkBtn = document.getElementById('copy-room-link');
const notification = document.getElementById('notification');
const usersList = document.getElementById('users');

// Show notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Initialize whiteboard
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room');
  const secret = urlParams.get('secret');
  
  if (roomId && secret) {
    // Make whiteboard visible
    whiteboardPage.classList.add('active');
    
    currentRoomId = roomId;
    currentRoomSecret = secret;
    
    // Generate shareable link
    const roomLink = `${window.location.origin}${window.location.pathname}?room=${roomId}&secret=${secret}`;
    shareLink.value = roomLink;
    
    // Display secret code
    secretCodeDisplay.textContent = `${roomId}:${secret}`;
    
    // Initialize whiteboard
    whiteboard = new Whiteboard('whiteboard', roomId);
    
    // Setup user tracking
    setupUserTracking(roomId);
  } else {
    // Redirect to home if no room info
    window.location.href = 'index.html';
  }
});

// Setup user tracking
function setupUserTracking(roomId) {
  currentUserId = Math.random().toString(36).substring(7);

   // Add Firebase real-time updates
  const roomRef = ref(database, `rooms/${roomId}`);
  const usersRef = ref(database, `rooms/${roomId}/users`);
  
  // Add current user to Firebase
  const userName = `User-${currentUserId.substring(0, 4)}`;
  set(ref(database, `rooms/${roomId}/users/${currentUserId}`), userName);
  users[currentUserId] = userName;
  updateUserList();

  onChildAdded(usersRef, (snapshot) => {
    users[snapshot.key] = snapshot.val();
    updateUserList();
  });
  
  onChildRemoved(usersRef, (snapshot) => {
    delete users[snapshot.key];
    updateUserList();
  }); 
  // Add current user
  // const userName = `User-${currentUserId.substring(0, 4)}`;
  
  // Simulate other users joining
  setTimeout(() => {
    const fakeUserId = Math.random().toString(36).substring(7);
    users[fakeUserId] = `User-${fakeUserId.substring(0, 4)}`;
    updateUserList();
  }, 2000);
  
  setTimeout(() => {
    const fakeUserId = Math.random().toString(36).substring(7);
    users[fakeUserId] = `User-${fakeUserId.substring(0, 4)}`;
    updateUserList();
  }, 4000);
}

function updateUserList() {
  usersList.innerHTML = '';
  for (const [id, name] of Object.entries(users)) {
    if (name) {
      const li = document.createElement('li');
      li.textContent = name;
      usersList.appendChild(li);
    }
  }
}

// Event Listeners
backHomeBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

copyLinkBtn.addEventListener('click', () => {
  shareLink.select();
  document.execCommand('copy');
  showNotification('Link copied to clipboard!');
});

copyRoomLinkBtn.addEventListener('click', () => {
  shareLink.select();
  document.execCommand('copy');
  showNotification('Link copied to clipboard!');
});

// Whiteboard Class
class Whiteboard {
  constructor(canvasId, roomId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.roomId = roomId;
    this.isDrawing = false;
    this.currentTool = 'pen';
    this.color = '#000000';
    this.brushSize = 5;
    this.startX = 0;
    this.startY = 0;
    this.actions = [];
    this.undoneActions = [];
    this.drawingPath = [];
    this.drawingsRef = ref(database, `rooms/${roomId}/drawings`);
    this.setupCanvas();
    this.setupEventListeners();
    this.setupToolbar();
    onChildAdded(this.drawingsRef, (snapshot) => {
      const action = snapshot.val();
      if (action.userId !== currentUserId) {
        this.executeAction(action);
      }
    });
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const container = document.getElementById('canvas-container');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.redrawCanvas();
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  }

  setupToolbar() {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const toolId = e.currentTarget.id;
        if (['pen', 'eraser', 'rectangle', 'circle', 'text'].includes(toolId)) {
          this.setTool(toolId);
        } else {
          this.handleToolAction(toolId);
        }
      });
    });

    // Color picker
    document.getElementById('color-picker').addEventListener('change', (e) => {
      this.color = e.target.value;
    });

    // Brush size
    const brushSlider = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    
    brushSlider.addEventListener('input', (e) => {
      this.brushSize = parseInt(e.target.value);
      sizeDisplay.textContent = `${this.brushSize}px`;
    });
  }

  setTool(tool) {
    this.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active-tool');
    });
    document.getElementById(tool).classList.add('active-tool');
    this.updateCursor();
  }

  updateCursor() {
    switch (this.currentTool) {
      case 'pen':
        this.canvas.style.cursor = 'crosshair';
        break;
      case 'eraser':
        this.canvas.style.cursor = 'grab';
        break;
      case 'text':
        this.canvas.style.cursor = 'text';
        break;
      default:
        this.canvas.style.cursor = 'crosshair';
    }
  }

  handleToolAction(action) {
  switch (action) {
    case 'undo':
      this.undo();
      break;
    case 'redo':
      this.redo();
      break;
    case 'clear':
      this.clear();
      break;
    case 'save':
      this.save();
      break;
    // Add this case for the copy-room-link button
    case 'copy-room-link':
      this.copyRoomLink();
      break;
    }
  }

  copyRoomLink() {
  const shareLink = document.getElementById('share-link');
  shareLink.select();
  document.execCommand('copy');
  this.showNotification('Link copied to clipboard!');
}

// Add this method to show notifications
showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    this.startX = pos.x;
    this.startY = pos.y;
    this.drawingPath = [pos];

    if (this.currentTool === 'pen' || this.currentTool === 'eraser') {
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    } else if (this.currentTool === 'text') {
      this.addText(pos.x, pos.y);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const pos = this.getMousePos(e);
    
    if (this.currentTool === 'pen') {
      this.drawLine(this.drawingPath[this.drawingPath.length - 1], pos);
      this.drawingPath.push(pos);
    } else if (this.currentTool === 'eraser') {
      this.erase(pos);
      this.drawingPath.push(pos);
    } else if (this.currentTool === 'rectangle') {
      this.redrawCanvas();
      this.drawRectangle(this.startX, this.startY, pos.x, pos.y);
    } else if (this.currentTool === 'circle') {
      this.redrawCanvas();
      this.drawCircle(this.startX, this.startY, pos.x, pos.y);
    }
  }

  stopDrawing(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const pos = this.getMousePos(e);

    if (this.currentTool === 'pen' && this.drawingPath.length > 1) {
      const action = {
        tool: 'pen',
        color: this.color,
        size: this.brushSize,
        path: this.drawingPath,
        timestamp: Date.now()
      };
      this.saveAction(action);
    } else if (this.currentTool === 'eraser' && this.drawingPath.length > 1) {
      const action = {
        tool: 'eraser',
        size: this.brushSize,
        path: this.drawingPath,
        timestamp: Date.now()
      };
      this.saveAction(action);
    } else if (this.currentTool === 'rectangle') {
      this.drawRectangle(this.startX, this.startY, pos.x, pos.y, true);
    } else if (this.currentTool === 'circle') {
      this.drawCircle(this.startX, this.startY, pos.x, pos.y, true);
    }

    this.drawingPath = [];
  }

  drawLine(from, to) {
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }

  erase(pos) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, this.brushSize, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  drawRectangle(startX, startY, endX, endY, save = false) {
    const width = endX - startX;
    const height = endY - startY;
    
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.color;
    this.ctx.strokeRect(startX, startY, width, height);
    
    if (save) {
      const action = {
        tool: 'rectangle',
        color: this.color,
        size: this.brushSize,
        x: startX,
        y: startY,
        width,
        height,
        timestamp: Date.now()
      };
      this.saveAction(action);
    }
  }

  drawCircle(startX, startY, endX, endY, save = false) {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    if (save) {
      const action = {
        tool: 'circle',
        color: this.color,
        size: this.brushSize,
        x: startX,
        y: startY,
        radius,
        timestamp: Date.now()
      };
      this.saveAction(action);
    }
  }

  addText(x, y) {
    const text = prompt('Enter text:');
    if (text) {
      this.ctx.font = `${this.brushSize * 4}px Arial`;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(text, x, y);
      
      const action = {
        tool: 'text',
        color: this.color,
        size: this.brushSize * 4,
        text,
        x,
        y,
        timestamp: Date.now()
      };
      this.saveAction(action);
    }
  }

  saveAction(action) {
    this.actions.push(action);
    this.undoneActions = [];
    
    // Push to Firebase
    action.userId = currentUserId;
    const newActionRef = push(this.drawingsRef);
    set(newActionRef, action);
  }

  executeAction(action) {
    if (!action) return;

    this.ctx.lineWidth = action.size || this.brushSize;
    this.ctx.strokeStyle = action.color || this.color;
    this.ctx.fillStyle = action.color || this.color;

    switch (action.tool) {
      case 'pen':
        if (action.path && action.path.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(action.path[0].x, action.path[0].y);
          for (let i = 1; i < action.path.length; i++) {
            this.ctx.lineTo(action.path[i].x, action.path[i].y);
          }
          this.ctx.stroke();
        }
        break;
      case 'eraser':
        if (action.path && action.path.length > 0) {
          this.ctx.globalCompositeOperation = 'destination-out';
          action.path.forEach(pos => {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, action.size, 0, 2 * Math.PI);
            this.ctx.fill();
          });
          this.ctx.globalCompositeOperation = 'source-over';
        }
        break;
      case 'rectangle':
        this.ctx.strokeRect(action.x, action.y, action.width, action.height);
        break;
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(action.x, action.y, action.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
      case 'text':
        this.ctx.font = `${action.size}px Arial`;
        this.ctx.fillText(action.text, action.x, action.y);
        break;
      case 'clear':
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        break;
    }
  }

  undo() {
    if (this.actions.length > 0) {
      const lastAction = this.actions.pop();
      this.undoneActions.push(lastAction);
      this.redrawCanvas();
    }
  }

  redo() {
    if (this.undoneActions.length > 0) {
      const actionToRedo = this.undoneActions.pop();
      this.actions.push(actionToRedo);
      this.executeAction(actionToRedo);
    }
  }

  clear() {
  if (confirm('Are you sure you want to clear the whiteboard?')) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actions = [];
    this.undoneActions = [];
    
    // Add this to force a redraw
    this.redrawCanvas();
  }
}

  save() {
  const link = document.createElement('a');
  link.download = `whiteboard-${this.roomId}-${Date.now()}.png`;
  link.href = this.canvas.toDataURL();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actions.forEach(action => {
      this.executeAction(action);
    });
  }
}
