import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Parse URL to get the document ID
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get('docId');

function updateItemPage(data) {
  if (data) {
    document.querySelector("#title").innerHTML = data.itemName;
    document.querySelector("#price").innerHTML = "$" + data.itemPrice;
    document.querySelector("#description").innerHTML = data.itemDescription;
    document.querySelector("#main").setAttribute("src", "./ShopItemImages/" + data.itemImagePath);
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

//function to add item to user cart collection
async function addItemToCart() {
  try {
    if (docId && auth.currentUser) {
    const docRef = doc(db, "Items", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      console.log("Document data:", docData);
      const itemId = docId;

      //get the current users cart
      const userCartRef = doc(db, "Users", auth.currentUser.uid);
      const userCartSnap = await getDoc(userCartRef);

      //check if item is already in cart, if it is, increment amount, if not, push item to cart array
      let itemExist = false;
      if(userCartSnap){
        const itemsArray = userCartSnap.data().itemList || [];
        const updatedArray = itemsArray.map(item =>{
          if(item.itemId === itemId){
            itemExist = true;
            return{
              ...item,
              amount: item.amount + 1
            }
          }
          return item;
        });

        //if item isnt found, make a new map and add to array
        if (!itemExist){
          updatedArray.push({itemId: itemId, amount: 1});
        }

        //update user cart with new item
        await updateDoc(userCartRef, {userId: auth.currentUser.uid, itemList: updatedArray});
        console.log("Item added to cart");
        alert("Item Added to cart")
      }

    } else {
      console.log("No such document!");
    }
  }else{
    alert("Must Be Signed in to purchase items");
  }
  } catch (error) {
    console.error("Error occured when adding to cart", error);
  }
  
}

fetchDocumentDetails();

auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector("#image2").remove();
    document.querySelector("#logout").style.visibility = 'visible';
  } else {
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


  document.querySelector("#purchaseButton").addEventListener("click", addItemToCart);

})