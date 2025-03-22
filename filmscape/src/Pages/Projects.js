import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Userscenesscripts.css";
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Projects = ({ user }) => {
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
    <div className="scene-div">
      <div className="scene-head">
        <h2>Scripts</h2>
        <div className="scene-container">
          {scripts.map((script, index) => (
            <div key={index} className="scene-item">
              <h4>{index + 1}.</h4>
              <h3>{script.scriptName}</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleLoadScript(script)} 
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1'
                  }}
                >
                  Load Script
                </button>
                <button 
                  onClick={() => handleDeleteScript(script)} 
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1'
                  }}
                >
                  Delete Script
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;