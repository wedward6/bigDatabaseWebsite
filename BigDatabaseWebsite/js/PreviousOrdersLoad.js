import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

async function getPreviousOrders(userId) {
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);
    console.log(userSnap.data().orders);
    for(const order of userSnap.data().orders){
        const orderRef = doc(db,"UserOrders",order)
        const orderSnap = await getDoc(orderRef)
        console.log(orderSnap.data())
    }
 
 //   const ordersSnap = doc(db, "UserOrders",)


}

auth.onAuthStateChanged((user) => {
    if (user) {
      document.querySelector("#image2").remove();
      document.querySelector("#logout").style.visibility = "visible";
      getPreviousOrders(user.uid);
    } else {
      document.querySelector("#logout").remove();
      document.querySelector("#image2").style.visibility = "visible";
    }
  });
  
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