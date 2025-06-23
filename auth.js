// import { database } from '../public/firebase-config.js';
// import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// export class Auth {
//   constructor() {
//     this.currentUser = null;
//     this.generateUserId();
//   }

//   generateUserId() {
//     // Generate a random user ID
//     this.currentUser = {
//       id: Math.random().toString(36).substring(7),
//       name: `User-${Math.random().toString(36).substring(2, 6)}`,
//       joinedAt: Date.now()
//     };
    
//     // Store in sessionStorage for persistence during session
//     if (typeof Storage !== "undefined") {
//       sessionStorage.setItem('whiteboardUser', JSON.stringify(this.currentUser));
//     }
//   }

//   getCurrentUser() {
//     // Try to get user from sessionStorage first
//     if (typeof Storage !== "undefined") {
//       const storedUser = sessionStorage.getItem('whiteboardUser');
//       if (storedUser) {
//         this.currentUser = JSON.parse(storedUser);
//       }
//     }
    
//     if (!this.currentUser) {
//       this.generateUserId();
//     }
    
//     return this.currentUser;
//   }

//   async joinRoom(roomId) {
//     const user = this.getCurrentUser();
//     const userRef = ref(database, `rooms/${roomId}/users/${user.id}`);
    
//     try {
//       await set(userRef, {
//         name: user.name,
//         joinedAt: Date.now(),
//         isActive: true
//       });
//       return user;
//     } catch (error) {
//       console.error("Error joining room:", error);
//       throw error;
//     }
//   }

//   async leaveRoom(roomId) {
//     const user = this.getCurrentUser();
//     const userRef = ref(database, `rooms/${roomId}/users/${user.id}`);
    
//     try {
//       await set(userRef, null);
//     } catch (error) {
//       console.error("Error leaving room:", error);
//     }
//   }

//   async checkRoomExists(roomId) {
//     const roomRef = ref(database, `rooms/${roomId}`);
//     try {
//       const snapshot = await get(roomRef);
//       return snapshot.exists();
//     } catch (error) {
//       console.error("Error checking room:", error);
//       return false;
//     }
//   }

//   setUserName(name) {
//     if (this.currentUser) {
//       this.currentUser.name = name;
//       if (typeof Storage !== "undefined") {
//         sessionStorage.setItem('whiteboardUser', JSON.stringify(this.currentUser));
//       }
//     }
//   }
// }