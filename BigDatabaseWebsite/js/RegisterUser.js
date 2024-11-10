import {auth, db} from './App.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


async function createUserCart(userId) {
  try {
    await setDoc(doc(db, "UserCart", userId),{
      userId: userId,
      itemList: []
    });
      
    console.log("userCart succesfully initlized");
    window.location.href = "SignInPage.html";
  } catch (error) {
    console.error("Error creating userCart")
  }
}

const submit = document.getElementById('submit');
submit.addEventListener("click", function(event){
    event.preventDefault();

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Creating Account...");

    createUserCart(user.uid);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
})

document.addEventListener("DOMContentLoaded", () =>{
  document.querySelector("#image2");
  document.querySelector("#logout").remove();

})