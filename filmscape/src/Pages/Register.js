import { auth ,db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React , { useState } from "react";
import {setDoc , doc} from "firebase/firestore";

function Register() {
    const [formData , setFormData] = useState({name:"",email:"",password:""})
    const handlechange = (e) => {
        setFormData({...formData , [e.target.name]:e.target.value})
    }
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,formData.email,formData.password);
            const user = userCredential.user;
            await setDoc(doc(db,"users",user.uid),{
                name:formData.name,
                email:formData.email,
                createdat:new Date()
            })
            alert("User created successfully");
        }
        catch(error){
            alert("Registration failed!");
        }
    };
    return (
        <form onSubmit={handlesubmit}>
            <input type="text" placeholder="username" onChange={handlechange} name="name" required></input>
            <input type="email" placeholder="Email" onChange={handlechange} name="email" required></input>
            <input type="password" placeholder="password" onChange={handlechange} name="password" required></input>
            <button type="submit">Sign-Up</button>
        </form>
    );
}
export default Register;

