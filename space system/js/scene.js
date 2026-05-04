// =====================================================
// scene.js — Three.js 3D planet renderer
// Handles: planet mesh creation, lighting, animation loop
// =====================================================

class PlanetScene {
  constructor(canvasId) {
    this.canvas   = document.getElementById(canvasId);
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.planet   = null;
    this.rings    = null;
    this.animId   = null;
    this.isDragging = false;
    this.prevMouse  = { x: 0, y: 0 };
    this.rotVel     = { x: 0, y: 0 };  // Inertia
    this.pinchDist  = 0;
  }

  // ----- Initialise Three.js scene -----
  init() {
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x000000, 0);

    // Scene & camera
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Sun-like directional light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    // Soft ambient so the dark side isn't pitch black
    this.scene.add(new THREE.AmbientLight(0x222244, 0.6));

    // Resize handler
    window.addEventListener('resize', () => this._onResize());

    // Gesture handlers
    this._bindGestures();
  }

  // ----- Build planet mesh from PLANETS data -----
  loadPlanet(key) {
    const data = PLANETS[key];

    // Remove existing meshes
    if (this.planet) { this.scene.remove(this.planet); this.planet.geometry.dispose(); }
    if (this.rings)  { this.scene.remove(this.rings);  this.rings.geometry.dispose();  }
    this.rings = null;

    // Planet sphere
    const geo  = new THREE.SphereGeometry(2, 64, 64);
    const mat  = new THREE.MeshPhongMaterial({
      color:     data.color,
      emissive:  data.emissive,
      shininess: 25,
      specular:  0x444444
    });

    // Special banding for gas giants (Jupiter/Saturn)
    if (key === 'jupiter' || key === 'saturn') {
      mat.shininess = 8;
    }

    this.planet = new THREE.Mesh(geo, mat);
    this.planet.scale.setScalar(0.01);   // Start tiny → animate in
    this.scene.add(this.planet);

    // Rings (Saturn & Uranus)
    if (data.ringColor) {
      const rGeo = new THREE.RingGeometry(2.6, 4.2, 80);
      // Rotate UVs so ring lies flat
      const pos = rGeo.attributes.position;
      const uv  = rGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        uv.setXY(i, pos.getX(i) / 4, pos.getY(i) / 4);
      }
      const rMat = new THREE.MeshBasicMaterial({
        color: data.ringColor, side: THREE.DoubleSide,
        transparent: true, opacity: 0.55
      });
      this.rings = new THREE.Mesh(rGeo, rMat);
      this.rings.rotation.x = Math.PI / 2.8;
      this.rings.scale.setScalar(0.01);
      this.scene.add(this.rings);
    }

    // Animate scale in
    this._animateEntry();
    this.rotVel = { x: 0, y: 0 };
  }

  // ----- Scale-in entry animation -----
  _animateEntry() {
    let t = 0;
    const ease = (x) => 1 - Math.pow(1 - x, 3); // ease-out cubic
    const grow = () => {
      t = Math.min(t + 0.03, 1);
      const s = ease(t);
      if (this.planet) this.planet.scale.setScalar(s);
      if (this.rings)  this.rings.scale.setScalar(s);
      if (t < 1) requestAnimationFrame(grow);
    };
    requestAnimationFrame(grow);
  }

  // ----- Main render loop -----
  start() {
    const loop = () => {
      this.animId = requestAnimationFrame(loop);

      // Apply rotation inertia
      if (!this.isDragging) {
        this.rotVel.x *= 0.93;
        this.rotVel.y *= 0.93;
      }
      if (this.planet) {
        this.planet.rotation.y += this.rotVel.y + 0.003; // Slow auto-spin
        this.planet.rotation.x += this.rotVel.x;
        if (this.rings) {
          this.rings.rotation.y = this.planet.rotation.y;
        }
      }
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  // ----- Pointer / Touch gesture binding -----
  _bindGestures() {
    const c = this.canvas;

    // Mouse
    c.addEventListener('mousedown', e => { this.isDragging = true; this.prevMouse = { x: e.clientX, y: e.clientY }; });
    window.addEventListener('mouseup',   () => { this.isDragging = false; });
    window.addEventListener('mousemove', e => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.rotVel.y = dx * 0.005;
      this.rotVel.x = dy * 0.005;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Scroll zoom
    c.addEventListener('wheel', e => {
      this.camera.position.z = Math.max(3, Math.min(10, this.camera.position.z + e.deltaY * 0.01));
    }, { passive: true });

    // Touch drag
    c.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.pinchDist = this._pinchDistance(e);
      }
    }, { passive: true });

    c.addEventListener('touchend', () => { this.isDragging = false; }, { passive: true });

    c.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.prevMouse.x;
        const dy = e.touches[0].clientY - this.prevMouse.y;
        this.rotVel.y = dx * 0.006;
        this.rotVel.x = dy * 0.006;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const newDist = this._pinchDistance(e);
        const delta   = this.pinchDist - newDist;
        this.camera.position.z = Math.max(3, Math.min(10, this.camera.position.z + delta * 0.01));
        this.pinchDist = newDist;
      }
    }, { passive: true });
  }

  _pinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _onResize() {
    if (!this.renderer) return;
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
  }
}
