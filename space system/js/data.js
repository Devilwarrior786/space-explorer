// =====================================================
// data.js — All 8 planets + quiz questions
// =====================================================

const PLANETS = {
  mercury: {
    name: "Mercury",
    color: 0xA8A8A8, emissive: 0x111111,
    radius: 0.25,          // 3D mesh radius
    orbitRadius: 3.2,      // Distance from sun in home scene
    orbitSpeed:  2.4,      // Relative orbital speed (Mercury fastest)
    tilt: 0.034,
    ringColor: null,
    stats: { diameter:"4,879 km", gravity:"3.7 m/s²", atmosphere:"Minimal (Oxygen, Sodium)", moons:"0" },
    facts:[
      "☀️ Mercury is closest to the Sun yet NOT the hottest planet.",
      "🌡️ Temperatures swing from -180 °C (night) to 430 °C (day).",
      "🐢 A day on Mercury lasts 59 Earth days — longer than its year!"
    ]
  },
  venus: {
    name: "Venus",
    color: 0xE8C07A, emissive: 0x1a0d00,
    radius: 0.45,
    orbitRadius: 5.0,
    orbitSpeed:  1.6,
    tilt: 3.096,
    ringColor: null,
    stats: { diameter:"12,104 km", gravity:"8.87 m/s²", atmosphere:"Dense CO₂ & Sulfuric Acid", moons:"0" },
    facts:[
      "🔥 Venus is the HOTTEST planet at 465 °C — hotter than Mercury!",
      "🔄 Venus spins backwards (retrograde) compared to most planets.",
      "📆 A day on Venus is longer than its entire year."
    ]
  },
  earth: {
    name: "Earth",
    color: 0x2A7AC8, emissive: 0x051020,
    radius: 0.48,
    orbitRadius: 7.2,
    orbitSpeed:  1.0,        // Reference speed
    tilt: 0.4101,
    ringColor: null,
    stats: { diameter:"12,742 km", gravity:"9.8 m/s²", atmosphere:"Nitrogen 78% & Oxygen 21%", moons:"1 (The Moon)" },
    facts:[
      "🌊 71 % of Earth's surface is covered by water.",
      "🛡️ Earth's magnetic field shields us from harmful solar wind.",
      "🧬 Earth is the only known planet confirmed to harbour life."
    ]
  },
  mars: {
    name: "Mars",
    color: 0xC1440E, emissive: 0x1a0500,
    radius: 0.35,
    orbitRadius: 9.8,
    orbitSpeed:  0.53,
    tilt: 0.4398,
    ringColor: null,
    stats: { diameter:"6,779 km", gravity:"3.72 m/s²", atmosphere:"Thin CO₂ (95%)", moons:"2 (Phobos & Deimos)" },
    facts:[
      "🏔️ Olympus Mons is the tallest volcano in the entire solar system.",
      "🌪️ Mars can have global dust storms lasting several months.",
      "🚀 NASA's Perseverance rover is actively exploring Mars right now."
    ]
  },
  jupiter: {
    name: "Jupiter",
    color: 0xC88B3A, emissive: 0x100800,
    radius: 1.1,
    orbitRadius: 14.5,
    orbitSpeed:  0.084,
    tilt: 0.0546,
    ringColor: null,
    stats: { diameter:"139,820 km", gravity:"24.79 m/s²", atmosphere:"Hydrogen & Helium", moons:"95 known moons" },
    facts:[
      "🌀 The Great Red Spot is a storm raging for over 350 years.",
      "🪐 Jupiter is so massive all other planets would fit inside it.",
      "🛡️ Jupiter acts as a cosmic shield, deflecting asteroids from Earth."
    ]
  },
  saturn: {
    name: "Saturn",
    color: 0xD4A855, emissive: 0x100900,
    radius: 0.95,
    orbitRadius: 19.5,
    orbitSpeed:  0.034,
    tilt: 0.4665,
    ringColor: 0xC8A060,    // Has rings!
    stats: { diameter:"116,460 km", gravity:"10.44 m/s²", atmosphere:"Hydrogen & Helium", moons:"146 confirmed moons" },
    facts:[
      "💍 Saturn's rings are mostly ice — thinner than a sheet of paper proportionally.",
      "🏊 Saturn is the least dense planet; it would float in water!",
      "⚡ Winds on Saturn reach 1,800 km/h — faster than a bullet."
    ]
  },
  uranus: {
    name: "Uranus",
    color: 0x7DE8E8, emissive: 0x041010,
    radius: 0.75,
    orbitRadius: 24.5,
    orbitSpeed:  0.012,
    tilt: 1.706,             // Extreme axial tilt — almost sideways!
    ringColor: 0x4a8888,
    stats: { diameter:"50,724 km", gravity:"8.69 m/s²", atmosphere:"Hydrogen, Helium & Methane", moons:"27 known moons" },
    facts:[
      "↔️ Uranus rotates on its side — axial tilt of 98°!",
      "❄️ Uranus holds the record for the coldest temperature: -224 °C.",
      "🔵 Methane gas gives Uranus its distinctive blue-green colour."
    ]
  },
  neptune: {
    name: "Neptune",
    color: 0x3F54BA, emissive: 0x030512,
    radius: 0.72,
    orbitRadius: 30.0,
    orbitSpeed:  0.006,
    tilt: 0.4943,
    ringColor: null,
    stats: { diameter:"49,244 km", gravity:"11.15 m/s²", atmosphere:"Hydrogen, Helium & Methane", moons:"16 known moons" },
    facts:[
      "💨 Neptune has the fastest winds in the solar system: 2,100 km/h!",
      "🔭 Neptune was discovered through mathematics before being seen.",
      "🌑 Triton (its largest moon) orbits backwards and is slowly spiralling inward."
    ]
  }
};

const PLANET_ORDER = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];

// ---- Quiz Questions (20 total, randomised each game) ----
const QUIZ_QUESTIONS = [
  { q:"Which planet is closest to the Sun?", opts:["Venus","Mercury","Mars","Earth"], ans:1 },
  { q:"Which planet has the most moons?", opts:["Jupiter","Saturn","Uranus","Neptune"], ans:1 },
  { q:"What gives Uranus its blue-green colour?", opts:["Water oceans","Oxygen","Methane gas","Ammonia"], ans:2 },
  { q:"Which planet has the longest day (relative to its year)?", opts:["Mercury","Earth","Venus","Mars"], ans:2 },
  { q:"The Great Red Spot is a storm on which planet?", opts:["Mars","Saturn","Neptune","Jupiter"], ans:3 },
  { q:"Which planet could float in water due to low density?", opts:["Neptune","Uranus","Saturn","Jupiter"], ans:2 },
  { q:"How many Earth days is a year on Mercury?", opts:["365","88","225","687"], ans:1 },
  { q:"Which is the hottest planet in the solar system?", opts:["Mercury","Earth","Mars","Venus"], ans:3 },
  { q:"How many confirmed moons does Saturn have?", opts:["27","95","146","16"], ans:2 },
  { q:"What percentage of Earth's surface is covered by water?", opts:["50%","60%","71%","80%"], ans:2 },
  { q:"Which planet rotates almost completely on its side?", opts:["Neptune","Uranus","Saturn","Jupiter"], ans:1 },
  { q:"Olympus Mons — the solar system's tallest volcano — is on which planet?", opts:["Earth","Venus","Jupiter","Mars"], ans:3 },
  { q:"What is Earth's only natural satellite called?", opts:["Titan","Europa","The Moon","Callisto"], ans:2 },
  { q:"Which planet spins in the opposite direction to most others?", opts:["Mars","Venus","Neptune","Uranus"], ans:1 },
  { q:"What gases make up most of Jupiter's atmosphere?", opts:["Oxygen & Nitrogen","CO₂ & Methane","Hydrogen & Helium","Water vapour & Ammonia"], ans:2 },
  { q:"Which planet has the fastest winds in the solar system?", opts:["Jupiter","Saturn","Uranus","Neptune"], ans:3 },
  { q:"Neptune was first discovered through:", opts:["A telescope","Mathematics","Radar","Photography"], ans:1 },
  { q:"What is Phobos?", opts:["A moon of Mars","A comet","An asteroid","A moon of Saturn"], ans:0 },
  { q:"What percentage of Earth's atmosphere is Nitrogen?", opts:["21%","50%","78%","99%"], ans:2 },
  { q:"How many Earth days does it take Mars to orbit the Sun?", opts:["365","225","88","687"], ans:3 },
];
