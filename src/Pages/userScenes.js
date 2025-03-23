import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Userscenesscripts.css";
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UScenes = ({ user }) => {
  const [scenes, setScenes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenes = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const projects = userData.projects || [];
            const allScenes = projects.flatMap(project => project.scenes || []);
            setScenes(allScenes);
          }
        } catch (error) {
          console.error("Error fetching scenes:", error);
        }
      }
    };

    fetchScenes();
  }, [user]);

  const handleLoadScene = (scene) => {
    navigate('/storyboard', { state: { selectedScene: scene } });
  };

  const handleDeleteScene = async (sceneToDelete) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const updatedProjects = userData.projects.map(project => {
            if (project.scenes) {
              return {
                ...project,
                scenes: project.scenes.filter(scene => scene.sceneName !== sceneToDelete.sceneName)
              };
            }
            return project;
          });

          await updateDoc(userDocRef, { projects: updatedProjects });
          setScenes(prevScenes => prevScenes.filter(scene => scene.sceneName !== sceneToDelete.sceneName));
        }
      } catch (error) {
        console.error("Error deleting scene:", error);
      }
    }
  };

  return (
    <div className="scene-div">
      <div className="scene-head">
        <h2>Scenes</h2>
        <div className="scene-container">
          {scenes.map((scene, index) => (
            <div key={index} className="scene-item">
              <h4>{index + 1}.</h4>
              <h3>{scene.sceneName}</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleLoadScene(scene)} 
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
                  Load Scene
                </button>
                <button 
                  onClick={() => handleDeleteScene(scene)} 
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
                  Delete Scene
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UScenes;