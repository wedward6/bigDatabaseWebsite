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
        createOrderBlock(orderSnap.data());
    }
 

}

async function createOrderBlock(orderSnapData){

  const orderContainer = document.querySelector(".OrderContainer")

  const orderDiv = document.createElement("div");
  orderDiv.className = "OrderItem";
  orderDiv.innerHTML = "bruh";
  for(const itemId of orderSnapData.ItemList){
//   const itemRef = doc(db, "Items", itemId);
//   const itemSnap = await getDoc(itemRef);
//    console.log(itemSnap.data().itemImagePath);
    const img = document.createElement("img");
//    img.src = "./ShopItemImages/" + itempSnap.data().itemImagePath;
    orderDiv.appendChild(img);
  }  

  orderContainer.appendChild(orderDiv);

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