# 🖊️ Collaborative Whiteboard App

A real-time collaborative whiteboard that allows multiple users to draw, write, and interact on a shared canvas over the internet. Built with Firebase Realtime Database and Express.js for live updates and secure room-based sessions.

---

## 🎥 Live Demo

![Live Demo](assets/Demo-video_colab.gif)

---

## 🚀 Features

- ✅ **Create or Join Rooms** using unique secret codes
- ✏️ **Freehand Drawing**, Eraser, Text Tool, Rectangle, and Circle support
- 🎨 **Color Picker** and Adjustable Brush Size
- 🔁 **Undo, Redo**, and ✨ **Clear Canvas**
- 💾 **Save Whiteboard** as PNG
- 🔗 **Shareable Room Link** for real-time collaboration
- 👥 **Live User Tracking** (see who's in the room)
- 🔐 **Room Access Control** using generated secrets

---

## 🧰 Tech Stack

### 🔹 Frontend
- HTML, CSS, JavaScript (Vanilla)
- [Font Awesome](https://fontawesome.com) for icons
- Firebase Realtime Database (for drawing data + user presence)

### 🔹 Backend
- Node.js with Express.js
- Firebase Admin SDK (via REST)
- Hosted on [Railway](https://railway.app)

---

## 🔧 Local Setup Instructions

### 1. 📦 Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/collaborative-whiteboard.git
cd collaborative-whiteboard
