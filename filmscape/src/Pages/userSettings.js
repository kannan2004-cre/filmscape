import React from 'react';
import { useState } from 'react';
import { getAuth , sendPasswordResetEmail } from 'firebase/auth';
import '../css/Usettings.css';

const USettings = ({ user }) => {
  const [formData, setFormData] = useState({email:''});
  const auth = getAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const triggerEmail = async() => {
    try{
    await sendPasswordResetEmail( auth , formData.email).then(() => {
      alert('Password reset email sent!');
      console.log('Password reset email sent!');
    })
  }
  catch(error){
    alert(error.message);
  }
  }
  return (
    <div className="edit">
      <form onSubmit={triggerEmail}>
        <h2>Change Password</h2>
        <div className="form-edit">
          <label htmlFor="email">Enter Your Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            required
          />
           <button type="submit" className='edit-button'>Reset Password</button>
          </div>
          </form>
    </div>
  );
};

export default USettings;
