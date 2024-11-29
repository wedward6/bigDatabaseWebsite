import { auth, db } from "./App.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
    div.onclick = (e) => {
      window.location.href = `ItemDetails.html?docId=${data.id}`;
    };

    //setup price
    const itemPriceText = document.createElement("h1");
    itemPriceText.className = "itemPrice";
    itemPriceText.innerHTML = "$" + data.itemPrice;

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
async function getCollectionData(clothingTypeFilter, priceSortDirection) {
  let itemsQuery = null;
  
  // Create a query with a 'where' clause to filter by clothingType\
  if (clothingTypeFilter != "All") {
    itemsQuery = query(
      collection(db, "Items"),
      where("clothingType", "==", clothingTypeFilter),
      orderBy("itemPrice", priceSortDirection),
    );
  }else{
    itemsQuery = query(
        collection(db, "Items"),
        orderBy("itemPrice", priceSortDirection),
      );
  }

   // Add sorting by price


  // Fetch the filtered data
  const querySnapshot = await getDocs(itemsQuery);

  // Map through the querySnapshot to build the dataList
  const dataList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Perform any operations with the filtered data
  dataList.map((data, index) => createItem(data));

  console.log(dataList); // Output the data list
  return dataList;
}

function filterItems(e) {
    const items = document.querySelectorAll(".purchasableItem");
    items.forEach((element) => {
      element.remove();
    });
  
        const filterType = document.querySelector("#clothingFilter");
        const priceSortDirection = document.querySelector("#priceFilter");
        getCollectionData(filterType.options[filterType.selectedIndex].value, priceSortDirection.options[priceSortDirection.selectedIndex].value)
 
}

// Call the function
getCollectionData('All', 'asc');


auth.onAuthStateChanged((user) => {
  if (user) {
    document.querySelector("#image2").remove();
    document.querySelector("#logout").style.visibility = "visible";
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

  const clothingFilter = document.querySelector("#clothingFilter");
  clothingFilter.addEventListener("change", (e) => filterItems(e, "NA"));
  const priceFilter = document.querySelector("#priceFilter");
  priceFilter.addEventListener("change", (e) => filterItems("NA", e));
});
