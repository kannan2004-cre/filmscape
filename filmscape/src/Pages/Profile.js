import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            console.error("No user document found!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="profile-div">
      <h2 className="profile-head">Profile</h2>
      <img
        src={userData.photoURL || "../images/placeholderImage.webp"} // Use the photoURL or a placeholder
        alt="User Profile"
        className="profile-img"
      />
      <div className="profile-sub">
        <div className="info-row">
          <h3>Name:</h3>
          <h4>{userData.name || "Unknown"}</h4>
        </div>
        <div className="info-row">
          <h3>Email:</h3>
          <h4>{userData.email || "Unknown"}</h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;
