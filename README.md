#🚀 Space Explorer 


**What is Space Explorer?**
Space Explorer is an interactive, browser-based 3D solar system web app. It lets you explore all 8 planets of our solar system with realistic visuals, orbital animations, detailed planet info, and a space quiz — all running directly in your browser with no app installation needed.

**🌟 Key Features**
1. 🌍 Animated Solar System (Home Screen)
All 8 planets orbit the Sun in real-time 3D
Planets move at realistic relative speeds (Mercury fastest, Neptune slowest)
The Sun glows with a multi-layer corona effect
Orbital path rings show each planet's trajectory
An asteroid belt floats between Mars and Jupiter
4,000-star background creates a deep-space atmosphere
Speed slider — control how fast planets orbit (0.2× to 5×)
Click any planet to explore it up close

 🔭 Planet Detail Screen (Close-up 3D View)
Full-screen 3D rotating planet with procedural texture
Drag to rotate the planet (mouse or touch)
Pinch / scroll to zoom in and out
Planet selector tabs at the top — switch between all 8 planets instantly
Bottom info panel slides up showing:
Planet name, diameter, gravity, atmosphere, number of moons
3 fun space facts per planet
Smooth scale-in animation when a planet loads
Saturn & Uranus display their rings
4. 🧠 Space Quiz
10 random questions chosen from a pool of 20
Multiple-choice format with instant green/red answer feedback
Progress bar tracks how far through the quiz you are
Score reveal at the end with emoji and personalised message
Retry or go back to explore more planets


**🪐 Planets Included**
Planet	Colour	Special Feature
☿ Mercury	Grey	Cratered surface texture
♀ Venus	Yellow-orange	Swirling sulphuric cloud bands
🌍 Earth	Blue-green	Oceans, continents, polar ice caps, clouds
♂ Mars	Rust red	Terrain, Valles Marineris canyon, polar cap
♃ Jupiter	Orange-brown	Horizontal bands + Great Red Spot storm
♄ Saturn	Golden	Banded surface + visible ring system
⛢ Uranus	Pale cyan	Sideways tilt (98° axial tilt) + faint rings
♆ Neptune	Deep blue	Storm streaks + dark spot


**🗂️ File Structure**
space system/
├── index.html          ← App shell (3 screens in one page)
├── css/
│   └── styles.css      ← Dark space theme, all layouts
└── js/
    ├── data.js         ← Planet stats, orbital data, quiz questions
    ├── textures.js     ← Procedural canvas textures (no image files!)
    ├── solar.js        ← Animated solar system (Home screen)
    ├── planet3d.js     ← Close-up planet viewer + info panel
    ├── quiz.js         ← Quiz logic and scoring
    └── app.js          ← Screen switcher, wires everything together

    
**⚙️ Tech Stack**
Technology	Purpose
HTML5	App structure and 3 screen panels
CSS3	Dark glassmorphism theme, animations, responsive layout
JavaScript (ES6)	All app logic, screen management
Three.js (r128)	3D WebGL rendering (planets, stars, orbits)
Canvas 2D API	Procedural planet texture generation
No build tools, no npm, no Flutter — just open in a browser!


**▶️ How to Run**
Open a terminal in the space system folder
Run:
bash
python -m http.server 8000
Open your browser and go to:
http://localhost:8000
⚠️ Must use a local server (not file://) because Three.js uses WebGL which requires HTTP.
