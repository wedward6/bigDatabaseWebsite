import {auth} from './App.js'
import { signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const submit = document.getElementById('submit');
submit.addEventListener("click", function(event){
    event.preventDefault();

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Signing In...");
    window.location.href = "ClothingStoreHomePage.html";
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
        document.querySelector("#image2").style.visibility = 'hidden';
        document.querySelector("#logout").remove();

    
})