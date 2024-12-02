import { auth, db } from './App.js'
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

var userId = "";
var orderItemsSnap;
const stateSalesTax = { "Alabama": 1.04, "Alaska": 1.00, "Arizona": 1.056, "Arkansas": 1.065, "California": 1.0725, "Colorado": 1.029, "Connecticut": 1.0635, "Delaware": 1.00, "Florida": 1.06, "Georgia": 1.04, "Hawaii": 1.04, "Idaho": 1.06,
     "Illinois": 1.0625, "Indiana": 1.07, "Iowa": 1.06, "Kansas": 1.065, "Kentucky": 1.06, "Louisiana": 1.0445, "Maine": 1.055, "Maryland": 1.06, "Massachusetts": 1.0625, "Michigan": 1.06, "Minnesota": 1.06875, "Mississippi": 1.07, "Missouri": 1.0423, 
     "Montana": 1.00, "Nebraska": 1.055, "Nevada": 1.0685, "New Hampshire": 1.00, "New Jersey": 1.0625, "New Mexico": 1.0513, "New York": 1.04, "North Carolina": 1.0475, "North Dakota": 1.05, "Ohio": 1.0575, "Oklahoma": 1.045, "Oregon": 1.00,
     "Pennsylvania": 1.06, "Rhode Island": 1.07, "South Carolina": 1.06, "South Dakota": 1.045, "Tennessee": 1.07, "Texas": 1.0625, "Utah": 1.0485, "Vermont": 1.06, "Virginia": 1.053, "Washington": 1.065, "West Virginia": 1.06, "Wisconsin": 1.05, "Wyoming": 1.04 };


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

async function createCheckoutTab(cartTotal, userCartSnap) {
    const checkoutInfo = document.querySelector(".CheckoutInfo");

    var divTotal = document.createElement("div");
    divTotal.className = "TotalInfo";

    var itemPriceText = document.createElement("h1");
    itemPriceText.className = "Total";
    itemPriceText.innerHTML = ("Total: $" + cartTotal);


    itemPriceText.style.color = "white";
    itemPriceText.style.position = "bottom";
    itemPriceText.style.bottom = "10px";


    const form = document.createElement('form');
    form.id = 'paymentForm';

    // Create name input
    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Full Name:';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'name');
    nameInput.setAttribute('name', 'name');
    nameInput.setAttribute('required', true);

    // Create email input
    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email Address:';
    const emailInput = document.createElement('input');
    emailInput.setAttribute('type', 'text');
    emailInput.setAttribute('id', 'email');
    emailInput.setAttribute('name', 'email');
    emailInput.setAttribute('required', true);

    // Create phone number input
    const phoneLabel = document.createElement('label');
    phoneLabel.innerText = 'Phone Number:';
    const phoneInput = document.createElement('input');
    phoneInput.setAttribute('type', 'tel');
    phoneInput.setAttribute('id', 'phone');
    phoneInput.setAttribute('name', 'phone');
    phoneInput.setAttribute('required', true);

    // Create address input
    const addressLabel = document.createElement('label');
    addressLabel.innerText = 'Shipping Address:';
    const addressInput = document.createElement('input');
    addressInput.setAttribute('type', 'text');
    addressInput.setAttribute('id', 'address');
    addressInput.setAttribute('name', 'address');
    addressInput.setAttribute('required', true);

    // Create city input
    const cityLabel = document.createElement('label');
    cityLabel.innerText = 'City:';
    const cityInput = document.createElement('input');
    cityInput.setAttribute('type', 'text');
    cityInput.setAttribute('id', 'city');
    cityInput.setAttribute('name', 'city');
    cityInput.setAttribute('required', true);

    // Create state dropdown
    const stateLabel = document.createElement('label');
    stateLabel.innerText = 'State:';
    const stateSelect = document.createElement('select');
    stateSelect.setAttribute('id', 'state');
    stateSelect.setAttribute('name', 'state');
    const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
                    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
                    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
                    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    states.forEach(state => {
        const option = document.createElement('option');
        option.setAttribute('value', state);
        option.innerText = state;
        stateSelect.appendChild(option);
    });

    // Create zip code input
    const zipLabel = document.createElement('label');
    zipLabel.innerText = 'ZIP Code:';
    const zipInput = document.createElement('input');
    zipInput.setAttribute('type', 'text');
    zipInput.setAttribute('id', 'zip');
    zipInput.setAttribute('name', 'zip');
    zipInput.setAttribute('required', true);

    // Create submit button
    const submitShipButton = document.createElement('button');
    submitShipButton.setAttribute('type', 'submit');
    submitShipButton.innerText = 'Submit';

    // Append all form elements to the form
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(phoneLabel);
    form.appendChild(phoneInput);
    form.appendChild(addressLabel);
    form.appendChild(addressInput);
    form.appendChild(cityLabel);
    form.appendChild(cityInput);
    form.appendChild(stateLabel);
    form.appendChild(stateSelect);
    form.appendChild(zipLabel);
    form.appendChild(zipInput);

    // Append the form to the container
    checkoutInfo.appendChild(form);

    const cardNumberLabel = document.createElement('label');
    cardNumberLabel.setAttribute('for', 'cardNumber');
    cardNumberLabel.textContent = 'Card Number';
    form.appendChild(cardNumberLabel);
    
    const cardNumberInput = document.createElement('input');
    cardNumberInput.type = 'text';
    cardNumberInput.id = 'cardNumber';
    cardNumberInput.name = 'cardNumber';
    cardNumberInput.placeholder = '1234 5678 9012 3456';
    cardNumberInput.required = true;
    form.appendChild(cardNumberInput);

    const expiryDateLabel = document.createElement('label');
    expiryDateLabel.setAttribute('for', 'expiryDate');
    expiryDateLabel.textContent = 'Expiry Date';
    form.appendChild(expiryDateLabel);
    
    const expiryDateInput = document.createElement('input');
    expiryDateInput.type = 'text';
    expiryDateInput.id = 'expiryDate';
    expiryDateInput.name = 'expiryDate';
    expiryDateInput.placeholder = 'MM/YY';
    expiryDateInput.required = true;
    form.appendChild(expiryDateInput);

    const cvvLabel = document.createElement('label');
    cvvLabel.setAttribute('for', 'cvv');
    cvvLabel.textContent = 'CVV';
    form.appendChild(cvvLabel);
    
    const cvvInput = document.createElement('input');
    cvvInput.type = 'text';
    cvvInput.id = 'cvv';
    cvvInput.name = 'cvv';
    cvvInput.placeholder = '123';
    cvvInput.required = true;
    form.appendChild(cvvInput);

    const cardHolderLabel = document.createElement('label');
    cardHolderLabel.setAttribute('for', 'cardHolder');
    cardHolderLabel.textContent = 'Cardholder Name';
    form.appendChild(cardHolderLabel);
    
    const cardHolderInput = document.createElement('input');
    cardHolderInput.type = 'text';
    cardHolderInput.id = 'cardHolder';
    cardHolderInput.name = 'cardHolder';
    cardHolderInput.placeholder = 'John Doe';
    cardHolderInput.required = true;
    form.appendChild(cardHolderInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Pay Now';
    submitButton.id = 'payButton';
    form.appendChild(submitButton);

    divTotal.appendChild(form);

    divTotal.appendChild(itemPriceText);
    checkoutInfo.appendChild(divTotal);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          address: addressInput.value,
          city: cityInput.value,
          state: stateSelect.value,
          zip: zipInput.value,
          cardNumber: cardNumberInput.value,
          expiryDate: expiryDateInput.value,
          cvv: cvvInput.value,
          cardHolder: cardHolderInput.value,
        };
        
//        console.log('Form Data:', formData);
        document.querySelector("#payButton").addEventListener("click", purchaseItem(userId, formData, cartTotal, userCartSnap));
        form.reset();
      });

      stateSelect.addEventListener('change', function() {
        const selectedState = stateSelect.value;
        const taxMultiplier = stateSalesTax[selectedState] || 1; // Default to 1 if state is not found
        var newCartTotal = cartTotal * taxMultiplier;
        itemPriceText.innerHTML = ("Total: $" + newCartTotal);
        console.log(cartTotal);
    //    cartTotalElement.innerText = updatedTotal.toFixed(2);
    });

}

async function purchaseItem(userId, formData, cartTotal, userCartSnap){
    const orderCollection = collection(db,"UserOrders");

    const docRef = doc(orderCollection);
    const autoGeneratedID = docRef.id;

    await setDoc(doc(db, "UserOrders", autoGeneratedID),{
        ItemList: userCartSnap.data().itemList,
        orderID: autoGeneratedID,
        UserID: userCartSnap.data().userId,
        paymentData: formData,
        totalPrice: cartTotal
    });
    
    var newOrderIds = userCartSnap.data().orders;
    newOrderIds.push(autoGeneratedID);
    console.log(newOrderIds)

    await updateDoc(doc(db, "Users", userId),{
        orders: newOrderIds,
        itemList : []
    });

    const currCartItems = document.querySelectorAll(".CartItem");
    currCartItems.forEach(element => {
        element.remove();
    });
    const cartTotalText = document.querySelector(".Total").innerHTML = "Total: $0"

    alert("Order " + autoGeneratedID + " Complete");

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
    orderItemsSnap = userCartSnap;
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
        createCheckoutTab(cartTotal, userCartSnap);
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
        userId = user.uid;
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
