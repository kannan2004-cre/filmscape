import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { db, auth } from "../firebaseConfig"; // Ensure this path is correct
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
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
  // Add language state
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const user = auth.currentUser;
  let userId;
  if (user != null) {
    userId = user.uid;
  }

  // List of available languages
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "it", name: "Italian" },
    { code: "ml", name: "Malayalam" } // Added Malayalam
  ];

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
    const project = projects.find((p) => p.projectName === projectName);
    if (project) {
      setScriptsInProject(project.scripts || []);
    }
  };

  const handleLoadScript = (script) => {
    setText(script.content);
    setCurrentScript(script);
    setShowLoadScriptsModal(false);
    const canvasElement = document.querySelector(".scripts-canvas");
    if (canvasElement) {
      canvasElement.innerHTML = script.content;
    }
    // Set language if it exists in the script
    if (script.language) {
      setSelectedLanguage(script.language);
    }
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
  };

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
              if (
                currentScript &&
                script.scriptName === currentScript.scriptName
              ) {
                return {
                  ...script,
                  content: text,
                  lastModified: new Date().toISOString(),
                  language: selectedLanguage // Add language info when updating
                };
              }
              return script;
            });

            if (
              !currentScript ||
              !updatedScripts.some(
                (script) => script.scriptName === currentScript.scriptName
              )
            ) {
              updatedScripts.push({
                scriptName: newScriptName,
                content: text,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                language: selectedLanguage // Add language info when creating
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

  // Effect to update spellcheck language
  useEffect(() => {
    const canvas = document.querySelector(".scripts-canvas");
    if (canvas) {
      canvas.lang = selectedLanguage;
      
      // Set appropriate font for Malayalam
      if (selectedLanguage === "ml") {
        canvas.style.fontFamily = "'Manjari', 'Noto Sans Malayalam', sans-serif";
      } else {
        canvas.style.fontFamily = ""; // Reset to default
      }
    }
  }, [selectedLanguage]);

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

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleDownloadDoc = async () => {
    try {
      // Get the content from the canvas
      const canvas = document.querySelector(".scripts-canvas");
      if (!canvas) {
        throw new Error("Canvas element not found");
      }
      
      // Get canvas content
      const content = canvas.innerText || canvas.textContent;
      
      // Create document with actual content
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(content),
                ]
              })
            ]
          }
        ]
      });
      
      // Generate blob and trigger download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "script.docx";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document: " + error.message);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      // Get the content from the canvas
      const canvas = document.querySelector(".scripts-canvas");
      if (!canvas) {
        console.log("Canvas element not found");
        return;
      }

      // Create a temporary container that exactly clones the canvas's content and styling
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "210mm"; // A4 width
      container.style.padding = "20mm"; // Margins
      container.style.background = "white";
      container.style.color = "black";

      // Copy all computed styles from the canvas
      const canvasStyles = window.getComputedStyle(canvas);
      const relevantStyles = [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "textAlign",
        "color",
        "letterSpacing",
        "wordSpacing",
      ];

      relevantStyles.forEach((style) => {
        container.style[style] = canvasStyles.getPropertyValue(style);
      });

      // Clone the canvas content exactly
      container.innerHTML = canvas.innerHTML;

      // Add to document to calculate dimensions
      document.body.appendChild(container);

      // Generate the PDF with html2canvas with higher quality settings
      const htmlCanvas = await html2canvas(container, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "white",
        allowTaint: true,
        letterRendering: true, // Better text rendering
      });

      // Remove the temporary element
      document.body.removeChild(container);

      // Create PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (htmlCanvas.height * imgWidth) / htmlCanvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > pageHeight ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      // Handle multi-page content if needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // Add first page
      pdf.addImage(
        htmlCanvas.toDataURL("image/jpeg", 1.0), // Use JPEG with highest quality
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pageNumber++;
        pdf.addImage(
          htmlCanvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      // Extract text content for searchability
      const textContent = canvas.textContent || canvas.innerText;

      // Make text content searchable in PDF
      for (let i = 1; i <= pageNumber; i++) {
        pdf.setPage(i);
        pdf.setFontSize(1); // Very small font (invisible)
        pdf.setTextColor(255, 255, 255, 0); // Transparent text

        // Add searchable text layer (invisible)
        const textContentPart = textContent.substring(
          (i - 1) * 3000, // Rough character count per page
          i * 3000
        );

        if (textContentPart.trim()) {
          const textLines = pdf.splitTextToSize(textContentPart, imgWidth - 20);
          pdf.text(10, 10, textLines);
        }
      }

      pdf.save("script.pdf");
    } catch (error) {
      console.error("Error in handleDownloadPdf:", error);
    }
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
            <li className="edit" onClick={handleDownloadDoc}>
              Download .doc
            </li>
            <li className="view" onClick={handleDownloadPdf}>
              Download .pdf
            </li>
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
            <option value="" className="option">
              Select a project
            </option>
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
            <option value="" className="option">
              Select a project
            </option>
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
                    {script.language && (
                      <span className="script-language">
                        ({languages.find(l => l.code === script.language)?.name || script.language})
                      </span>
                    )}
                    <button onClick={() => handleLoadScript(script)}>
                      Load
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setShowLoadScriptsModal(false)}>Cancel</button>
        </div>
      )}

      <div className="script-write">
        {/* Make the canvas itself the editable area */}
        <div 
          className="scripts-canvas" 
          contentEditable
          style={{ textAlign: alignment }}
          onInput={(e) => {
            // Store the exact HTML content
            setText(e.target.innerHTML);
            
            // Ensure cursor position is maintained
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const offset = range.startOffset;
              const node = range.startContainer;

              // After React updates, restore cursor position
              setTimeout(() => {
                if (document.contains(node)) {
                  try {
                    const newRange = document.createRange();
                    newRange.setStart(node, offset);
                    newRange.setEnd(node, offset);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                  } catch (e) {
                    // Handle any errors in restoring selection
                    console.log("Error restoring selection:", e);
                  }
                }
              }, 0);
            }
          }}
          onPaste={(e) => {
            // Get HTML content if available
            const htmlContent = e.clipboardData.getData("text/html");
            const plainText = e.clipboardData.getData("text/plain");

            e.preventDefault();

            // If HTML content is available and seems like formatted text
            if (
              htmlContent &&
              (htmlContent.includes("<b>") ||
                htmlContent.includes("<i>") ||
                htmlContent.includes("<p>") ||
                htmlContent.includes("<div>"))
            ) {
              // Create a temporary div to sanitize and process the HTML
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = htmlContent;

              // Clean up any unwanted elements or attributes
              const cleanHTML = tempDiv.innerHTML;

              // Insert the clean HTML at cursor position
              document.execCommand("insertHTML", false, cleanHTML);
            } else {
              // Fall back to plain text insertion
              document.execCommand("insertText", false, plainText);
            }
          }}
          placeholder="Write your script here..."
          spellCheck="true"
          lang={selectedLanguage}
        ></div>
        
        <div className="scripts-console">
          <div className="console-text">
            <h2>Toolbar</h2>
            <div className="toolbar-options">
              {/* Language selection dropdown */}
              <select 
                value={selectedLanguage} 
                onChange={handleLanguageChange}
                className="language-selector"
              >
                <option value="" disabled>Select Language</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              
              {/* Text formatting tools */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scripts;