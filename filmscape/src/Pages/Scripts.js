import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Ensure this path is correct
import { arrayUnion, arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { initializeApp } from "firebase/app"; // Import Firebase app initialization
import "../css/ScriptEditor.css";

function Scripts() {
  const [text, setText] = useState("");
  const [alignment, setAlignment] = useState("left");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newScriptName, setNewScriptName] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const userId = "currentUserId"; // Replace with actual user ID logic

  useEffect(() => {
    const fetchProjects = async () => {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setProjects(userDoc.data().projects || []);
      }
    };
    fetchProjects();
  }, [userId]);

  const handleSaveScript = () => {
    if (projects.length > 0) {
      setShowProjectModal(true); // Show project selection modal
    } else {
      setShowNewProjectModal(true); // Show new project creation modal
    }
  };

  const createProject = async () => {
    if (!newProjectName) return; // Prevent empty project names
    const projectData = {
      projectName: newProjectName,
      scenes: [],
      scripts: [],
    };
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      projects: arrayUnion(projectData), // Use arrayUnion from Firestore
    });
    setNewProjectName(""); // Reset input
    setShowNewProjectModal(false); // Close modal
  };

  const saveScriptToProject = async () => {
    if (!selectedProject || !newScriptName) return; // Prevent empty selections
    const projectIndex = projects.findIndex(p => p.projectName === selectedProject);
    if (projectIndex !== -1) {
      const updatedProject = { ...projects[projectIndex] };
      updatedProject.scripts.push({ scriptName: newScriptName, content: text });
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        projects: arrayRemove(projects[projectIndex]), // Use arrayRemove from Firestore
      });
      await updateDoc(userDocRef, {
        projects: arrayUnion(updatedProject), // Use arrayUnion from Firestore
      });
      setNewScriptName(""); // Reset input
      setSelectedProject(""); // Reset selected project
      setShowProjectModal(false); // Close modal
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const applyAlignment = (align) => {
    document.execCommand("justifyLeft", false, null);
    document.execCommand("justifyCenter", false, null);
    document.execCommand("justifyRight", false, null);
    document.execCommand("justifyFull", false, null);
    document.execCommand(align, false, null);
  };

  return (
    <div className="scripts-main">
      <div className="scripts-head">
        <div className="head-first">
          <ul>
            <li className="file" onClick={handleSaveScript}>Save Script</li>
            <li className="edit">Download .doc</li>
            <li className="view">Download .pdf</li>
          </ul>
        </div>
        <div className="head-second">
          <button onClick={() => { /* Load scripts logic */ }}>Load Scripts</button>
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectModal && (
        <div className="modal">
          <h2>Select Project</h2>
          <select onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
            <option value="">Select a project</option>
            {projects.map((project, index) => (
              <option key={index} value={project.projectName}>{project.projectName}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter script name"
            value={newScriptName}
            onChange={(e) => setNewScriptName(e.target.value)}
          />
          <button onClick={saveScriptToProject}>Save Script</button>
          <button onClick={() => setShowProjectModal(false)}>Cancel</button>
        </div>
      )}

      {/* New Project Creation Modal */}
      {showNewProjectModal && (
        <div className="modal">
          <h2>Create New Project</h2>
          <input
            type="text"
            placeholder="Enter project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button onClick={createProject}>Create Project</button>
          <button onClick={() => setShowNewProjectModal(false)}>Cancel</button>
        </div>
      )}

      <div className="script-write">
        <div className="scripts-canvas" style={{ textAlign: alignment }}>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div className="scripts-console">
          <div className="console-text">
            <h2>Toolbar</h2>
            <p>Add a new script using this toolbar more efficiently.</p>
            <select name="tools" id="tools">
              <option value="heading">Heading</option>
              <option value="Setting">Setting</option>
              <option value="Character">Character</option>
              <option value="Action">Action</option>
              <option value="Dialogue">Dialogue</option>
              <option value="Transition">Transition</option>
              <option value="description">Description</option>
            </select>
            <div
              className="text-editor"
              contentEditable
              onInput={(e) => setText(e.target.innerHTML)}
              style={{ textAlign: alignment }}
              placeholder="Write your selected script here..."
            ></div>
            <div className="text-formatting">
              <button onClick={() => formatText("bold")}>B</button>
              <button onClick={() => formatText("italic")}>I</button>
              <button onClick={() => formatText("strikeThrough")}>S</button>
              <button onClick={() => applyAlignment("justifyLeft")}>Left</button>
              <button onClick={() => applyAlignment("justifyCenter")}>Center</button>
              <button onClick={() => applyAlignment("justifyRight")}>Right</button>
              <button onClick={() => applyAlignment("justifyFull")}>Justify</button>
            </div>
            <button>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scripts;
