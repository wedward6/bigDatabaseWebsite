import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

function createItem(data) {
    const itemContainer = document.querySelector(".ItemContainer");
    if (data) {
        const div = document.createElement("div");
        div.className = "purchasableItem";

        //set up img
        const img = document.createElement("img");
        if (data.itemImagePath) {
            img.src = "./ShopItemImages/" + data.itemImagePath;
        }
        img.alt = data.itemName;
        div.onclick = (e) => { window.location.href = `ItemDetails.html?docId=${data.id}` };

        //setup price
        const itemPriceText = document.createElement("h1");
        itemPriceText.className = "itemPrice";
        itemPriceText.innerHTML = ("$" + data.itemPrice);

        //setup outOfStockText
        const outOfStockText = document.createElement("h1");
        outOfStockText.className = "outOfStockText";
        outOfStockText.innerHTML = "OUT OF STOCK";

        div.appendChild(img);
        div.appendChild(itemPriceText);
        div.appendChild(outOfStockText);

        itemContainer.appendChild(div);


    }
}
// Function to retrieve a collection
async function getCollectionData() {
    const querySnapshot = await getDocs(collection(db, "Items"));
    const dataList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    dataList.map((data, index) => createItem(data));

    console.log(dataList);  // Output the data list
    return dataList;
}

// Call the function
getCollectionData();

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

