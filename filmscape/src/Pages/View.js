import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Userscenesscripts.css";
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UScripts = ({ user }) => {
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScripts = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const projects = userData.projects || [];
            const allScripts = projects.flatMap(project => project.scripts || []);
            setScripts(allScripts);
          }
        } catch (error) {
          console.error("Error fetching scripts:", error);
        }
      }
    };

    fetchScripts();
  }, [user]);

  const handleLoadScript = (script) => {
    navigate('/scripteditor', { state: { selectedScript: script } });
  };

  const handleDeleteScript = async (scriptToDelete) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedProjects = userData.projects.map(project => {
            if (project.scripts) {
              return {
                ...project,
                scripts: project.scripts.filter(script => script.scriptName !== scriptToDelete.scriptName)
              };
            }
            return project;
          });

          await updateDoc(userDocRef, { projects: updatedProjects });
          setScripts(prevScripts => prevScripts.filter(script => script.scriptName !== scriptToDelete.scriptName));
        }
      } catch (error) {
        console.error("Error deleting script:", error);
      }
    }
  };

  return (
    <div className="script-div">
      <div className="script-head">
        <h2>Scripts</h2>
        <div className="script-container">
          {scripts.map((script, index) => (
            <div key={index} className="script-item">
              <h4>{index + 1}.</h4>
              <h3>{script.scriptName}</h3>
              <button onClick={() => handleLoadScript(script)}>Load Script</button>
              <button onClick={() => handleDeleteScript(script)}>Delete Script</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UScripts;