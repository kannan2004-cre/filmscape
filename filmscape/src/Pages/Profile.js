import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Default placeholder image URL (consider using a public URL that's guaranteed to work)
  const defaultImage = "https://puremagnetik.com/cdn/shop/products/Filmscape_1024x1024.jpg?v=1604328464";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            if (!data.photoURL) {
              // If photoURL is not set, update it with the default image
              await updateDoc(userDocRef, { photoURL: defaultImage });
              data.photoURL = defaultImage;
            }
            setUserData(data);
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
        src={imageError ? defaultImage : userData.photoURL}
        alt="User Profile"
        className="profile-img"
        onError={() => setImageError(true)}
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