Here is a detailed `README.md` file for your **Collaborative Whiteboard** project:

---

```markdown
# 🖊️ Collaborative Whiteboard App

A real-time collaborative whiteboard that allows multiple users to draw, write, and interact on a shared canvas over the internet. It supports live updates via Firebase Realtime Database and room-based access to ensure secure sessions.

---

## 🚀 Features

- ✅ **Create or Join Rooms** with unique secret codes
- ✏️ **Freehand Drawing**, Eraser, Text Tool, Rectangle, and Circle
- 🎨 **Color Picker** and Adjustable Brush Size
- 🧻 **Undo, Redo, and Clear Canvas**
- 💾 **Download Whiteboard** as PNG
- 🔗 **Shareable Link** for real-time collaboration
- 👥 **Live User Presence Tracking**
- 🔒 **Room Validation** using secrets for access control

---

## 🧰 Tech Stack

### 🔹 Frontend
- HTML, CSS, JavaScript
- [Font Awesome](https://fontawesome.com) for icons
- Firebase Realtime Database for real-time sync
- Vanilla JS modules for tool control and drawing logic

### 🔹 Backend
- Node.js with Express.js
- Firebase Admin SDK via Firebase JS SDK (client side)
- Deployed on [Railway](https://railway.app/) (can be changed to Render, Heroku, etc.)

---



---

## 🔧 Local Setup Instructions

### 1. 📦 Clone the Repo

```bash
git clone https://github.com/yourusername/collaborative-whiteboard.git
cd collaborative-whiteboard
````

---

### 2. 🧪 Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. In **Realtime Database** tab → create a database (start in test mode)
4. Copy your Firebase config and replace in `firebase-config.js`
5. Also copy the same config keys to `.env` in the backend:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_DATABASE_URL=your-database-url
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

### 3. 🚀 Start Backend Server

```bash
cd backend
npm install
node index.js
```

* The backend runs by default on `http://localhost:8000`
* It serves the `/api/rooms` and `/api/rooms/:roomId` endpoints

---

### 4. 🌐 Serve Frontend (Basic)

Use **Live Server Extension** in VSCode or run:

```bash
cd public
python -m http.server 3000
```

Then visit:
👉 `http://localhost:3000`

---

## 🌍 Deployment Tips

* Frontend: Use [Netlify](https://netlify.com/) or [Vercel](https://vercel.com/)
* Backend: Use [Railway](https://railway.app/), [Render](https://render.com/), or [Heroku](https://heroku.com/)
* Update `API_BASE_URL` in `app.js` to point to your hosted backend

---

## 📸 Screenshots

![Create Room](https://your-screenshot-url/create.png)
![Whiteboard Drawing](https://your-screenshot-url/draw.png)

---

## 📃 License

MIT License © [Your Name](https://github.com/yourusername)

```

---

### ✅ After This

- Replace placeholder Firebase values with your real config
- Add screenshots to a `/screenshots` folder and embed URLs
- Optionally link the live site if deployed

Let me know if you'd like a version tailored for **Vercel + Railway deployment**.
```
