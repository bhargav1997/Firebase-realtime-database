// Documentation
// https://firebase.google.com/docs/database/web/read-and-write

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, child, get, onValue, push, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDK3nBRQSo0Ei1gR6p9GvxQwaZH49RyJ9o",
   authDomain: "discussion-area.firebaseapp.com",
   databaseURL: "https://discussion-area.firebaseio.com",
   projectId: "discussion-area",
   storageBucket: "discussion-area.appspot.com",
   messagingSenderId: "911334090999",
   appId: "1:911334090999:web:b2a3c0ec5357e9283c4bf2",
   measurementId: "G-CYVLMTKPYC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase();

// Fetch messages
const messages = ref(database, "/comments");

// On data event
onValue(
   messages,
   (snapshot) => {
      // Create a reference to the ul element
      const ul = document.getElementById("messages");

      // Empty the ul emelemt
      ul.replaceChildren();

      // Loop through messages
      snapshot.forEach((childSnapshot) => {
         // Get key and children
         const childKey = childSnapshot.key;
         const childData = childSnapshot.val();

         console.log(childKey);
         console.log(childData);

         // Add message to list
         const text = document.createTextNode(`Name: ${childData.name} - Comment: ${childData.text}`);
         const li = document.createElement("li");

         // Add delete button to list
         const deleteBtn = document.createElement("button");
         deleteBtn.textContent = "Delete";
         deleteBtn.setAttribute("id", "delete-btn");
         deleteBtn.addEventListener("click", function () {
            const prompt = window.confirm("Are you sure you want to delete this comment?");
            if (prompt) {
               remove(childKey);
            } else {
               console.log("cancelled");
            }
         });

         li.appendChild(text);
         li.appendChild(deleteBtn);
         ul.appendChild(li);
      });
   },
   {
      onlyOnce: false,
   },
);

// Remove comment
function remove(childKey) {
   console.log("removing", childKey);
   const updates = {};
   updates["/comments/" + childKey] = null;
   update(ref(database), updates);
}

// Add event to button
const submit = document.getElementById("submit");
const name = document.getElementById("name");
const message = document.getElementById("message");

submit.addEventListener("click", function () {
   const messages = ref(database, "comments");
   push(messages, {
      text: message.value,
      name: name.value,
      createdAt: new Date().getTime(),
   });
});
