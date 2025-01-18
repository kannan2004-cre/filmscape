import React, { useState } from "react";
import "../css/ScriptEditor.css";

function Scripts() {
  const [text, setText] = useState("");
  const [alignment, setAlignment] = useState("left");

  function loadscripts() {}

  const handleTextChange = (e) => {
    setText(e.target.innerHTML);
  };

  const applyAlignment = (align) => {
    document.execCommand("justifyLeft", false, null);
    document.execCommand("justifyCenter", false, null);
    document.execCommand("justifyRight", false, null);
    document.execCommand("justifyFull", false, null);
    document.execCommand(align, false, null);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="scripts-main">
      <div className="scripts-head">
        <div className="head-first">
          <ul>
            <li className="file">File</li>
            <li className="edit">Edit</li>
            <li className="view">View</li>
          </ul>
        </div>
        <div className="head-second">
          <button onClick={loadscripts()}>Load Scripts</button>
        </div>
      </div>
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
              onInput={handleTextChange}
              style={{ textAlign: alignment }}
              placeholder="Write your selected script here..."
            ></div>
            <div className="text-formatting">
              <button onClick={() => formatText("bold")}>B</button>
              <button onClick={() => formatText("italic")}>I</button>
              <button onClick={() => formatText("strikeThrough")}>S</button>
              <button onClick={() => formatText("insertUnorderedList")}>
                • List
              </button>
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
