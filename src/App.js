// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import ArticleList from './pages/ArticleList';
// import ArticleDetail from './pages/ArticleDetail';
// import ServiceDetail from './pages/ServiceDetail';
// import AboutUs from './pages/AboutUs';
// import ProjectDetail from './pages/ProjectDetail';
// import ContactUs from './pages/ContactUs';
// import Projects from './pages/Projects';
// import BusinessServiceDetail from './pages/BusinessServiceDetail';





// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home/>} />
//         <Route path="/articles" element={<ArticleList />} />
//         <Route path="/articles/:slug" element={<ArticleDetail />} />
//         <Route path="/services/:slug" element={<ServiceDetail />} />
//         <Route path="/AboutUs" element={<AboutUs />} />
//         {/* <Route path="/projects" element={<ProjectDetail />} /> */}
//         <Route path="/projects/:slug" element={<ProjectDetail />} />
//         <Route path="/ContactUs" element={<ContactUs />} />
//         <Route path="/Projects" element={<Projects />} />
//         <Route path="/business-services/:slug" element={<BusinessServiceDetail />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;








// import './responsive.css';
import './cources.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ServiceDetail from './pages/ServiceDetail';
import AboutUs from './pages/AboutUs';
import ProjectDetail from './pages/ProjectDetail';
import ContactUs from './pages/ContactUs';
import Projects from './pages/Projects';
import BusinessServiceDetail from './pages/BusinessServiceDetail';
import HelpCenter from './pages/HelpCenter';
import Forum from './pages/Forum';
import Expert from './pages/Expert';
import Webinar from './pages/Webinar';
import WebinarDetail from './pages/WebinarDetail';


function App() {
  const cursorRef = useRef();
  const positionRef = useRef({ x: 0, y: 0 });
  // 'active' class ki zaroorat nahi jab hum sirf CSS hover istemal kar rahe hain.
  // Lekin agar aapko button ya link par koi aur class lagani hai, toh yeh code zaroori hai.
  // Is code mein, hum mouse events ko directly custom-cursor par lagayenge.
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${positionRef.current.x}px`;
        cursorRef.current.style.top = `${positionRef.current.y}px`;
      }
      requestAnimationFrame(updateCursor);
    };

    // --- New: Hover event listeners to detect interactive elements ---
    const handleMouseEnter = (e) => {
      const targetTag = e.target.tagName;
      const isInteractive = targetTag === 'BUTTON' || targetTag === 'IMG' || targetTag === 'A';
      
      // Check if target is interactive, or has a specific attribute like 'data-cursor-expand'
      if (isInteractive || e.target.classList.contains('expand-cursor')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    // Add event listeners to detect when mouse is over or out of any element
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mousemove', mouseMove);
    requestAnimationFrame(updateCursor);

    return () => {
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  return (
    <Router>
      {/* Conditionally add 'is-hovering' class based on state */}
      <div 
        ref={cursorRef} 
        className={`custom-cursor ${isHovering ? 'is-hovering' : ''}`} 
      /> 
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        {/* <Route path="/projects" element={<ProjectDetail />} /> */}
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/business-services/:slug" element={<BusinessServiceDetail />} />
        <Route path="/HelpCenter" element={<HelpCenter />} />
        <Route path="/Forum" element={<Forum />} />
        <Route path="/Expert" element={<Expert />} />
        <Route path="/Webinar" element={<Webinar />} />
        <Route path="/webinar/:slug" element={<WebinarDetail />} />
      </Routes>
    </Router>
  );
}

export default App;