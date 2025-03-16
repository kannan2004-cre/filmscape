import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Index.css";
import Navbar from "../Components/Navbar";
import { FaRocket, FaFilm, FaUserAstronaut, FaRegLightbulb, FaCloudDownloadAlt } from "react-icons/fa";

function Index() {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(0);
  const filmFrames = [
    "Crafting the Future of Storytelling",
    "Where Imagination Meets Technology",
    "Script to Screen, Reimagined",
    "Elevate Your Cinematic Vision",
    "The Next Generation of Filmmaking"
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % filmFrames.length);
    }, 3000);

    return () => clearInterval(intervalId);
  },[]);

  return (
    <div className="index-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">FILMSCAPE</h1>
          <div className="film-frames">
            <p className="hero-subtitle">{filmFrames[currentFrame]}</p>
          </div>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate("/storyboard")}>
              Launch Storyboard
            </button>
            <button className="secondary-button" onClick={() => navigate("/scripts")}>
              Create New Script
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="film-reel"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Revolutionary Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaFilm />
            </div>
            <h3>Storyboard Generator</h3>
            <p>Visualize your script with our automated storyboard tool, bringing your scenes to life instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserAstronaut />
            </div>
            <h3>Character Development</h3>
            <p>Create deep, complex characters with our advanced character profiling and arc management system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaRegLightbulb />
            </div>
            <h3>Collaborative Editing</h3>
            <p>Work seamlessly with your team in real-time, from anywhere in the universe.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaCloudDownloadAlt />
            </div>
            <h3>Industry-Standard Export</h3>
            <p>Export your work in any format the industry demands, from PDF to Final Draft.</p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <h2 className="section-title">Showcase</h2>
        <div className="showcase-content">
          <div className="showcase-text">
            <h3>Revolutionize Your Workflow</h3>
            <p>See how filmmakers around the world are transforming their creative process using our platform.</p>
           {/*  <button className="accent-button" onClick={() => navigate("/case-studies")}>
              View Case Studies
            </button> */}
          </div>
          <div className="showcase-visual">
            <div className="showcase-screen"></div>
          </div>
        </div>
      </section>

     {/*  {/* Testimonials Section */}
      {/* <section className="testimonials-section">
        <h2 className="section-title">Voices From The Future</h2>
        <div className="testimonials-carousel">
          <div className="testimonial-card">
            <p>"Cinematrix has completely transformed how I approach screenwriting. The interface is intuitive and the AI suggestions are surprisingly insightful."</p>
            <div className="testimonial-author">
              <h4>Alex Rodriguez</h4>
              <p>Director, "Nebula Dreams"</p>
            </div>
          </div>
          <div className="testimonial-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>  */}

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Begin Your Cinematic Journey</h2>
          <p>Join thousands of filmmakers who are already crafting the next generation of storytelling.</p>
          <button className="glow-button" onClick={() => navigate("/dashboard")}>
            Start Creating Now
          </button>
        </div>
        <div className="orbital-elements">
          <div className="orbit"></div>
          <div className="orbit"></div>
          <div className="orbit"></div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="futuristic-footer">
        <p>© 2025 Filmscape | Where Imagination Meets Reality</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
          <a href="/support">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default Index;