// =====================================================
// solar.js — Realistic animated solar system (Home Screen)
// Uses procedural textures, optimised for smooth 60fps
// =====================================================

class SolarSystem {
  constructor() {
    this.canvas   = document.getElementById('home-canvas');
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.animId   = null;
    this.speed    = 1.0;
    this.planetMeshes = {};
    this.raycaster    = new THREE.Raycaster();
    this.mouse        = new THREE.Vector2();
    this.onPlanetClick = null;
  }

  init() {
    const W = window.innerWidth, H = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x000000, 1);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 2000);
    // Slight angle — not straight top-down so rings & tilt are visible
    this.camera.position.set(0, 42, 18);
    this.camera.lookAt(0, 0, 0);

    this._buildStarfield();
    this._buildSun();
    this._buildAsteroidBelt();
    this._buildPlanets();

    // Single point light from sun position
    const sun = new THREE.PointLight(0xFFF6E0, 2.2, 250);
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0x111122, 0.9));

    this._bindEvents();
    window.addEventListener('resize', () => this._onResize());
  }

  _buildStarfield() {
    const count = 3500;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 700;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    // Two layers: small white + rare blue-tinted
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.28 })));
  }

  _buildSun() {
    // Core bright sphere
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFE050 })
    );
    this.scene.add(core);

    // Corona layers (back-side additive glow)
    [{ r: 3.0, c: 0xFF9900, o: 0.22 },
     { r: 4.2, c: 0xFF6600, o: 0.10 },
     { r: 6.0, c: 0xFF4400, o: 0.04 }].forEach(({ r, c, o }) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 24),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.BackSide })
      );
      this.scene.add(m);
    });
  }

  _buildAsteroidBelt() {
    // Optimised: single Points object, fewer particles
    const count = 280;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 11.2 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x887766, size: 0.14 })));
  }

  _buildOrbitRing(radius) {
    const geo = new THREE.RingGeometry(radius - 0.035, radius + 0.035, 120);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x2a3a55, side: THREE.DoubleSide, transparent: true, opacity: 0.4
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  _buildPlanets() {
    PLANET_ORDER.forEach(key => {
      const data = PLANETS[key];
      this._buildOrbitRing(data.orbitRadius);

      // Use Lambert on home screen (much cheaper than Phong, no specular needed at distance)
      const tex = PlanetTextures.get(key);
      const mat = new THREE.MeshLambertMaterial({ map: tex });

      // Reduced segments for home (32 vs 64 on detail screen) — big perf win
      const geo  = new THREE.SphereGeometry(data.radius, 32, 32);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = data.tilt;
      mesh.userData.planetKey = key;
      this.scene.add(mesh);

      // Saturn / Uranus rings
      let ringMesh = null;
      if (data.ringColor) {
        const rGeo = new THREE.RingGeometry(data.radius * 1.45, data.radius * 2.5, 72);
        const rMat = new THREE.MeshBasicMaterial({
          color: data.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.6
        });
        ringMesh = new THREE.Mesh(rGeo, rMat);
        ringMesh.rotation.x = key === 'uranus' ? 0.1 : Math.PI / 2.6;
        this.scene.add(ringMesh);
      }

      this.planetMeshes[key] = {
        mesh, ringMesh,
        angle: Math.random() * Math.PI * 2,   // Spread start angles
        data
      };
    });
  }

  start() {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);

      PLANET_ORDER.forEach(key => {
        const p  = this.planetMeshes[key];
        p.angle += p.data.orbitSpeed * 0.005 * this.speed;

        const x = Math.cos(p.angle) * p.data.orbitRadius;
        const z = Math.sin(p.angle) * p.data.orbitRadius;

        p.mesh.position.set(x, 0, z);
        p.mesh.rotation.y += 0.006;  // Self-spin

        if (p.ringMesh) p.ringMesh.position.set(x, 0, z);
      });

      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  stop() { if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; } }
  setSpeed(v) { this.speed = v; }

  _bindEvents() {
    const pick = (cx, cy) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x =  ((cx - r.left) / r.width)  * 2 - 1;
      this.mouse.y = -((cy - r.top)  / r.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(PLANET_ORDER.map(k => this.planetMeshes[k].mesh));
      if (hits.length && this.onPlanetClick) this.onPlanetClick(hits[0].object.userData.planetKey);
    };

    this.canvas.addEventListener('click',    e => pick(e.clientX, e.clientY));
    this.canvas.addEventListener('touchend', e => { e.preventDefault(); pick(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }, { passive: false });
  }

  _onResize() {
    if (!this.renderer) return;
    const W = window.innerWidth, H = window.innerHeight;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
  }
}
