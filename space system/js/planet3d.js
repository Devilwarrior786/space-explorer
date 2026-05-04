// =====================================================
// planet3d.js — Close-up 3D planet viewer
// Drag to rotate, pinch/scroll to zoom, info panel
// =====================================================

class Planet3D {
  constructor() {
    this.canvas   = document.getElementById('planet-canvas');
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.mesh     = null;
    this.rings    = null;
    this.animId   = null;
    this.drag     = false;
    this.prev     = { x: 0, y: 0 };
    this.vel      = { x: 0, y: 0 };
    this.pinchD   = 0;
    this.currentKey = null;
  }

  init() {
    const W = window.innerWidth, H = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x020817, 1);

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    this.camera.position.set(0, 0, 6);

    // Background stars
    const sg  = new THREE.BufferGeometry();
    const sp  = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) sp[i] = (Math.random() - 0.5) * 400;
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.28 })));

    // Sun-like key light
    const sun = new THREE.DirectionalLight(0xfff6e0, 1.8);
    sun.position.set(8, 4, 6);
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0x1a1a33, 0.7));

    this._bindGestures();
    window.addEventListener('resize', () => this._onResize());
  }

  // Load a planet by key
  load(key) {
    this.currentKey = key;
    const data = PLANETS[key];

    // Remove old meshes
    if (this.mesh)  { this.scene.remove(this.mesh);  }
    if (this.rings) { this.scene.remove(this.rings); }
    this.mesh = this.rings = null;
    this.vel  = { x: 0, y: 0 };

    // Planet sphere — use real procedural texture
    const geo = new THREE.SphereGeometry(2, 64, 64);
    const tex = PlanetTextures.get(key);
    const mat = new THREE.MeshPhongMaterial({
      map:       tex,
      emissive:  new THREE.Color(data.emissive),
      shininess: (key === 'jupiter' || key === 'saturn') ? 6 : 28,
      specular:  new THREE.Color(0x223344)
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.z = data.tilt;
    this.mesh.scale.setScalar(0.01); // Start tiny
    this.scene.add(this.mesh);

    // Rings for Saturn & Uranus
    if (data.ringColor) {
      const rGeo = new THREE.RingGeometry(2.8, 4.6, 120);
      // Fix ring UV so inner/outer look different
      const pos = rGeo.attributes.position;
      const uv  = rGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        uv.setXY(i, x / 4.6, y / 4.6);
      }
      const rMat = new THREE.MeshBasicMaterial({
        color: data.ringColor, side: THREE.DoubleSide,
        transparent: true, opacity: 0.65
      });
      this.rings = new THREE.Mesh(rGeo, rMat);
      this.rings.rotation.x = key === 'uranus' ? 0.3 : Math.PI / 2.8;
      this.rings.scale.setScalar(0.01);
      this.scene.add(this.rings);
    }

    // Animate scale in (ease-out cubic)
    let t = 0;
    const grow = () => {
      t = Math.min(t + 0.028, 1);
      const s = 1 - Math.pow(1 - t, 3);
      if (this.mesh)  this.mesh.scale.setScalar(s);
      if (this.rings) this.rings.scale.setScalar(s);
      if (t < 1) requestAnimationFrame(grow);
    };
    requestAnimationFrame(grow);

    // Populate info panel
    this._populatePanel(key, data);
  }

  // Fill in the info panel DOM elements
  _populatePanel(key, data) {
    document.getElementById('planet-name').textContent = data.name;
    document.getElementById('s-size').textContent    = data.stats.diameter;
    document.getElementById('s-gravity').textContent = data.stats.gravity;
    document.getElementById('s-atmo').textContent    = data.stats.atmosphere;
    document.getElementById('s-moons').textContent   = data.stats.moons;

    const list = document.getElementById('facts-list');
    list.innerHTML = '';
    data.facts.forEach(f => {
      const div = document.createElement('div');
      div.className   = 'fact-card';
      div.textContent = f;
      list.appendChild(div);
    });
  }

  // Main render loop
  start() {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);
      if (!this.drag) {
        this.vel.x *= 0.93;
        this.vel.y *= 0.93;
      }
      if (this.mesh) {
        this.mesh.rotation.y += this.vel.y + 0.004;
        this.mesh.rotation.x += this.vel.x;
        if (this.rings) {
          // Keep rings tied to planet position but rotation separate
          this.rings.rotation.y = this.mesh.rotation.y * 0.05;
        }
      }
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  stop() { if (this.animId) cancelAnimationFrame(this.animId); }

  // Gesture handlers
  _bindGestures() {
    const c = this.canvas;

    // Mouse drag
    c.addEventListener('mousedown',   e => { this.drag = true; this.prev = { x: e.clientX, y: e.clientY }; });
    window.addEventListener('mouseup', () => { this.drag = false; });
    window.addEventListener('mousemove', e => {
      if (!this.drag) return;
      this.vel.y = (e.clientX - this.prev.x) * 0.006;
      this.vel.x = (e.clientY - this.prev.y) * 0.006;
      this.prev  = { x: e.clientX, y: e.clientY };
    });

    // Scroll zoom
    c.addEventListener('wheel', e => {
      this.camera.position.z = Math.max(3.5, Math.min(12, this.camera.position.z + e.deltaY * 0.012));
    }, { passive: true });

    // Touch drag + pinch zoom
    c.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        this.drag = true;
        this.prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.pinchD = this._dist(e.touches);
      }
    }, { passive: true });

    c.addEventListener('touchend', () => { this.drag = false; }, { passive: true });

    c.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && this.drag) {
        this.vel.y = (e.touches[0].clientX - this.prev.x) * 0.007;
        this.vel.x = (e.touches[0].clientY - this.prev.y) * 0.007;
        this.prev  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const d = this._dist(e.touches);
        this.camera.position.z = Math.max(3.5, Math.min(12, this.camera.position.z + (this.pinchD - d) * 0.02));
        this.pinchD = d;
      }
    }, { passive: true });
  }

  _dist(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }

  _onResize() {
    if (!this.renderer) return;
    const W = window.innerWidth, H = window.innerHeight;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
  }
}
