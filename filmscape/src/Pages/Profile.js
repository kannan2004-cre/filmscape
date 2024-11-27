import React, {useState, useEffect} from "react";
import "../css/Profile.css";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = ({ user , location }) => {
  const { name, email, photoURL } = location?.state || {};
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
            console.error("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
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

  console.log("Photo URL:", photoURL);

  return (
    <div className="profile-div">
      <h2 className="profile-head">Profile</h2>
      {photoURL ? (
        <img src={photoURL} alt="User Profile" />
      ) : (
        <img src={require("../images/logo1.png")} alt="Placeholder" />

      )}
      <div className="profile-sub">
        <div className="info-row">
          <h3>Name:</h3>
          <h4>{name || userData?.name}</h4>
        </div>
        <div className="info-row">
          <h3>Email:</h3>
          <h4>{email || userData?.email}</h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;
