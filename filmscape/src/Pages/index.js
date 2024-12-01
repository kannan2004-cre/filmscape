import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Index.css";
function Index(){
    const navigate = useNavigate();
    return(
        <div>
            <h1>this is Index</h1>
            <button onClick={() => navigate("/dashboard")}>dashboard</button>
        </div>
    );
}
export default Index;