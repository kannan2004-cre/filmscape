import "../css/Userscenesscripts.css";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig"; // Ensure this path is correct
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const UScripts = () => {
  const [projects, setProjects] = useState([]); // Assume this is populated with project data
  const [selectedProject, setSelectedProject] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showLoadScriptsModal, setShowLoadScriptsModal] = useState(false);
  const [selectedLoadProject, setSelectedLoadProject] = useState("");
  const [scriptsInProject, setScriptsInProject] = useState([]);
  const [currentScript, setCurrentScript] = useState(null);
  const user = auth.currentUser;
  let userId;
  if (user != null) {
    userId = user.uid;
  }

  const checkProject = () => {
    if (projects.length > 0) {
      setShowProjectModal(true); // Show project selection modal
    } else {
      alert("no projects");
    }
  };

  const loadScript = async () => {
    setShowLoadScriptsModal(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectModal(false);
    // Load scripts for the selected project here
    // Example: fetchScriptsForProject(project);
  };

  return (
    <div className="scene-div">
      <div className="scene-head">
        <h2>Scripts</h2>
        <button onClick={checkProject}>Select Project</button>
        
        {showProjectModal && (
          <div className="project-modal">
            <h3>Select a Project</h3>
            {projects.map((project, index) => (
              <button key={index} onClick={() => handleProjectSelect(project)}>
                {project.name}
              </button>
            ))}
            <button onClick={() => setShowProjectModal(false)}>Cancel</button>
          </div>
        )}

        {selectedProject && (
          <div className="scene-container">
            {/* Display scripts for the selected project */}
            {scriptsInProject.map((script, index) => (
              <div className="scene-item" key={index}>
                <h4>{index + 1}.</h4>
                <h3>{script.name}</h3> {/* Assuming script has a name property */}
                <button onClick={() => loadScript(script)}>Load Scene</button>
                <button>Delete Scene</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UScripts;
