import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


async function removeCartItem(userId, itemId, itemDiv, origPrice, priceText, itemAmount) {
    //decrease the amount in databvase and on page
    const userCartRef = doc(db, "Users", userId);
    const userCartSnap = await getDoc(userCartRef);
    if (userCartSnap) {
        const itemsArray = userCartSnap.data().itemList || [];
        const updatedArray = itemsArray.map(item => {
            if (item.itemId === itemId) {
                return {
                    ...item,
                    amount: item.amount - 1
                }
            }
            return item;
        })
            .filter(item => item.amount > 0);

        //update user cart with new item
        await updateDoc(userCartRef, { userId: auth.currentUser.uid, itemList: updatedArray });
        console.log("Item removed from cart");

        //decrease the amount on page -- remove if amount is 0
        let currentAmount = parseInt(itemAmount.innerHTML.slice(1), 10);
        currentAmount -= 1;
        if (currentAmount == 0) {
            itemDiv.remove();
        } else {
            itemAmount.innerHTML = ("x" + currentAmount);
            priceText.innerHTML = ("$" + origPrice * currentAmount);
        }
        //Update cart total
        const cartTotalText = document.querySelector(".Total")
        let previousTotal = parseInt(cartTotalText.innerHTML.slice(8), 10);
        let newTotal = previousTotal -= origPrice;
        cartTotalText.innerHTML = ("Total: $" + newTotal)


    }
}
function createCartItem(userId, itemId, data, amount) {
    const cartContainer = document.querySelector(".CartContainer");
    if (data) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "CartItem";

        //set up img
        const img = document.createElement("img");
        if (data.itemImagePath) {
            img.src = "./ShopItemImages/" + data.itemImagePath;
        }
        img.alt = data.itemName;
        img.className = "CartImg"
        img.onclick = (e) => { window.location.href = `ItemDetails.html?docId=${itemId}` };

        //setup title
        const title = document.createElement("h1");
        title.className = "ItemTitle";
        title.innerHTML = (data.itemName);

        //setup amount text
        const amountOfItem = document.createElement("h1");
        amountOfItem.className = "ItemAmount";
        amountOfItem.innerHTML = ("x" + amount);

        const deleteItemButton = document.createElement("h1");
        deleteItemButton.className = "RemoveItemText";
        deleteItemButton.innerHTML = "X"
        deleteItemButton.onclick = (e) => { removeCartItem(userId, itemId, itemDiv, data.itemPrice, itemPriceText, amountOfItem) }

        //setup price
        const itemPriceText = document.createElement("h1");
        itemPriceText.className = "PriceText";
        itemPriceText.innerHTML = ("$" + data.itemPrice * amount);


        itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(itemPriceText);
        itemDiv.appendChild(amountOfItem);
        itemDiv.appendChild(deleteItemButton);


        cartContainer.appendChild(itemDiv);


    }
}

async function createCheckoutTab(cartTotal) {
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

async function getItemData(userId, itemInCart) {
    const itemRef = doc(db, "Items", itemInCart.itemId);
    const itemSnap = await getDoc(itemRef);
    if (itemRef) {
        console.log("amount in cart: " + itemInCart.amount);
        console.log(itemSnap.data());

        createCartItem(userId, itemInCart.itemId, itemSnap.data(), itemInCart.amount);
    }
}

// Function to retrieve a collection
async function getCartData(userId) {
    const userCartRef = doc(db, "Users", userId);
    const userCartSnap = await getDoc(userCartRef);
    if (userCartSnap) {
        console.log(userCartSnap.data());
        const itemList = userCartSnap.data().itemList;
        console.log(itemList);

        let cartTotal = 0;
        for (const item of itemList) {
            const itemsRef = doc(db, "Items", item.itemId);
            const itemsSnap = await getDoc(itemsRef);
            cartTotal += Number(itemsSnap.data().itemPrice) * item.amount;
        }
        createCheckoutTab(cartTotal);
        itemList.map((data, index) => getItemData(userId, data))
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


})

