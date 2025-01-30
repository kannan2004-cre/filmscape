import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig"; // Ensure this path is correct
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Import Firestore functions
import "../css/ScriptEditor.css";
import Navbar from "../Components/Navbar";

function Scripts() {
  const [text, setText] = useState("");
  const [alignment, setAlignment] = useState("left");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newScriptName, setNewScriptName] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showLoadScriptsModal, setShowLoadScriptsModal] = useState(false);
  const [selectedLoadProject, setSelectedLoadProject] = useState("");
  const [scriptsInProject, setScriptsInProject] = useState([]);
  const [currentScript, setCurrentScript] = useState(null);
  const user = auth.currentUser;
  let userId;
  if (user != null) {
    userId = user.uid;
  }
  const handleSaveScript = () => {
    if (projects.length > 0) {
      setShowProjectModal(true); // Show project selection modal
    } else {
      setShowNewProjectModal(true); // Show new project creation modal
    }
  };

  const loadScript = async () => {
    setShowLoadScriptsModal(true);
  };

  const handleProjectSelection = (projectName) => {
    const project = projects.find(p => p.projectName === projectName);
    if (project) {
      setScriptsInProject(project.scripts || []);
    }
  };

  const handleLoadScript = (script) => {
    setText(script.content);
    setCurrentScript(script);
    setShowLoadScriptsModal(false);
    document.querySelector('.text-editor').innerHTML = script.content;
  };

  const createNewProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const userRef = doc(db, "users", userId);
      const newProject = {
        projectName: newProjectName,
        scripts: [],
        scenes: [],
      };
      await updateDoc(userRef, {
        projects: arrayUnion(newProject),
      });
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setShowNewProjectModal(false);
      setSelectedProject(newProjectName);
      setShowProjectModal(true);
    } catch (error) {
      console.log("error creating project:", error);
    }
  };

  const createNew = () => {
    setShowNewProjectModal(true);
    setShowProjectModal(false);
  }
  const saveScriptToProject = async () => {
    if (!selectedProject || !newScriptName.trim() || !text.trim()) return;
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedProjects = userData.projects.map((project) => {
          if (project.projectName === selectedProject) {
            const updatedScripts = (project.scripts || []).map((script) => {
              if (currentScript && script.scriptName === currentScript.scriptName) {
                return {
                  ...script,
                  content: text,
                  lastModified: new Date().toISOString(),
                };
              }
              return script;
            });

            if (!currentScript || !updatedScripts.some(script => script.scriptName === currentScript.scriptName)) {
              updatedScripts.push({
                scriptName: newScriptName,
                content: text,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
              });
            }

            return {
              ...project,
              scripts: updatedScripts,
            };
          }
          return project;
        });
        await updateDoc(userRef, {
          projects: updatedProjects,
        });
        setNewScriptName("");
        setSelectedProject(false);
        setShowProjectModal(false);
        setProjects(updatedProjects);
        setCurrentScript(null);
      }
    } catch (error) {
      console.log("error saving script:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProjects(userData.projects || []);
      }
    } catch (error) {
      console.log(error);
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
      <Navbar />
      <div className="scripts-head">
        <div className="head-first">
          <ul>
            <li className="file" onClick={handleSaveScript}>
              Save Script
            </li>
            <li className="edit">Download .doc</li>
            <li className="view">Download .pdf</li>
          </ul>
        </div>
        <div className="head-second">
          <button onClick={loadScript}>Load Scripts</button>
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectModal && (
        <div className="modal">
          <h2>Select Project</h2>
          <select
            onChange={(e) => setSelectedProject(e.target.value)}
            value={selectedProject}
          >
            <option value="" className="option">Select a project</option>
            {projects.map((project, index) => (
              <option key={index} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter script name"
            value={newScriptName}
            onChange={(e) => setNewScriptName(e.target.value)}
          />
          <button onClick={saveScriptToProject}>Save Script</button>
          <button onClick={createNew}>Create New Project</button>

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
          <button onClick={createNewProject}>Create</button>
          <button onClick={() => setShowNewProjectModal(false)}>Cancel</button>
        </div>
      )}

      {/* Load Scripts Modal */}
      {showLoadScriptsModal && (
        <div className="modal">
          <h2>Select Project to Load Scripts</h2>
          <select
            onChange={(e) => {
              setSelectedLoadProject(e.target.value);
              handleProjectSelection(e.target.value);
            }}
            value={selectedLoadProject}
          >
            <option value="" className="option">Select a project</option>
            {projects.map((project, index) => (
              <option key={index} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </select>
          {scriptsInProject.length > 0 && (
            <div>
              <h3>Select Script</h3>
              <ul>
                {scriptsInProject.map((script, index) => (
                  <li key={index}>
                    {script.scriptName}
                    <button onClick={() => handleLoadScript(script)}>Load</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setShowLoadScriptsModal(false)}>Cancel</button>
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
              <button onClick={() => applyAlignment("justifyLeft")}>
                Left
              </button>
              <button onClick={() => applyAlignment("justifyCenter")}>
                Center
              </button>
              <button onClick={() => applyAlignment("justifyRight")}>
                Right
              </button>
              <button onClick={() => applyAlignment("justifyFull")}>
                Justify
              </button>
            </div>
            <button>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scripts;
