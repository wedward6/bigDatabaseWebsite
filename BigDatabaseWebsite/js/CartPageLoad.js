import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

function createCartItem(itemId, data, amount) {
    const cartContainer = document.querySelector(".CartContainer");
    if (data) {
        const div = document.createElement("div");
        div.className = "CartItem";

        //set up img
        const img = document.createElement("img");
        if (data.itemImagePath) {
            img.src = "./ShopItemImages/" + data.itemImagePath;
        }
        img.alt = data.itemName;
        img.className = "CartImg"
        div.onclick = (e) => { window.location.href = `ItemDetails.html?docId=${itemId}` };

        //setup price
        const itemPriceText = document.createElement("h1");
        itemPriceText.className = "PriceText";
        itemPriceText.innerHTML = ("$" + data.itemPrice * amount);


        div.appendChild(img);
        div.appendChild(itemPriceText);
        

        cartContainer.appendChild(div);


    }
}

async function createCheckoutTab(cartTotal){
    const checkoutInfo = document.querySelector(".CheckoutInfo");

    var divTotal = document.createElement("div");
    divTotal.className = "TotalInfo";

    var itemPriceText = document.createElement("h1");
    itemPriceText.className = "Total";
    itemPriceText.innerHTML = ("Total: $" + cartTotal);

    itemPriceText.style.color = "white";
    itemPriceText.style.position = "absolute";
    itemPriceText.style.bottom = "10px";  
    
    divTotal.appendChild(itemPriceText);
    checkoutInfo.appendChild(divTotal);
}

async function getItemData(itemInCart){
    const itemRef  = doc(db, "Items", itemInCart.itemId);
    const itemSnap = await getDoc(itemRef);
    if(itemRef){
        console.log("amount in cart: " + itemInCart.amount);
        console.log(itemSnap.data());

        createCartItem(itemInCart.itemId, itemSnap.data(), itemInCart.amount);
    }
}

// Function to retrieve a collection
async function getCartData(userId) {
    const userCartRef = doc(db, "UserCart", userId); 
      const userCartSnap = await getDoc(userCartRef);
      if(userCartSnap){
        console.log(userCartSnap.data());
        const itemList = userCartSnap.data().itemList;
        console.log(itemList);
        for(const item of itemList){
            const itemsRef = doc(db, "Items", item.itemId);
                const itemsSnap = await getDoc(itemsRef);
                cartTotal += Number(itemsSnap.data().itemPrice) * item.amount;
        }
        createCheckoutTab(cartTotal);
        itemList.map((data, index) => getItemData(data))
      }
    
    //dataList.map((data, index) => createItem(data));

    //console.log(dataList);  // Output the data list
    //return dataList;
}


auth.onAuthStateChanged(user => {
    if (user) {
        document.querySelector("#image2").remove();
        document.querySelector("#logout").style.visibility = 'visible';

        // Call the function
        getCartData(user.uid);
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

