import {auth, db} from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Parse URL to get the document ID
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get('docId');

function updateItemPage(data){
    if(data){
        document.querySelector("#title").innerHTML = data.itemName;
        document.querySelector("#price").innerHTML = "$" + data.itemPrice;
        document.querySelector("#description").innerHTML = data.itemDescription;
    }
}

async function fetchDocumentDetails() {
    if (docId) {
      const docRef = doc(db, "Items", docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const docData = docSnap.data();
        console.log("Document data:", docData);
        // Render your document details on the page
        updateItemPage(docData);
      } else {
        console.log("No such document!");
      }
    }
  }

  
  fetchDocumentDetails();

  auth.onAuthStateChanged(user => {
    if (user) {
        document.querySelector("#image2").remove();
        document.querySelector("#logout").style.visibility = 'visible';
    }else{
        document.querySelector("#logout").remove();
        document.querySelector("#image2").style.visibility = 'visible';
    }
})

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#logout").addEventListener("click", (e) => {
        signOut(auth)
            .then(() => {
                console.log("User signed out successfully");
                location.reload(true);
                // Optional: Redirect to login page or show logout confirmation
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    });


})