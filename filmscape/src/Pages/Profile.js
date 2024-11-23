import React, {useState, useEffect} from "react";
import "../css/Profile.css";
import logo from "../images/logo.png";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = ({ user }) => {
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

  return (
    <div className="profile-div">
      <h2>Profile</h2>
      <img src={logo} alt="User Profile" />
      <div className="profile-sub">
        <div className="info-row">
          <h3>Name:</h3>
          <h4>{userData.name}</h4>
        </div>
        <div className="info-row">
          <h3>Email:</h3>
          <h4>{userData.email}</h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;
