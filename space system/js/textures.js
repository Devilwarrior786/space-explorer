// =====================================================
// textures.js — Procedural planet textures via Canvas 2D
// No external image files needed — generated at runtime
// =====================================================

const PlanetTextures = (() => {

  // Utility: simple seeded noise for surface variation
  function noise(x, y, seed = 1) {
    const s = Math.sin(x * 127.1 * seed + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function makeTexture(w, h, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    drawFn(canvas.getContext('2d'), w, h);
    return new THREE.CanvasTexture(canvas);
  }

  // ---------- MERCURY — grey, cratered ----------
  function mercury() {
    return makeTexture(512, 256, (ctx, W, H) => {
      // Base grey
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#8a8a8a');
      grad.addColorStop(0.5, '#6e6e6e');
      grad.addColorStop(1, '#9a9a9a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Craters
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        const r = 3 + Math.random() * 14;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50,50,50,${0.3 + Math.random() * 0.4})`;
        ctx.fill();
        // Rim highlight
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(160,160,160,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }

  // ---------- VENUS — swirling yellow clouds ----------
  function venus() {
    return makeTexture(512, 256, (ctx, W, H) => {
      ctx.fillStyle = '#c8922a';
      ctx.fillRect(0, 0, W, H);
      // Horizontal cloud bands
      const colors = ['#e8c068', '#c8902a', '#d4a840', '#b8801a', '#e0b850'];
      for (let band = 0; band < 18; band++) {
        const y = (band / 18) * H;
        const h = H / 18 + Math.random() * 6;
        ctx.fillStyle = colors[band % colors.length];
        ctx.globalAlpha = 0.35 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.ellipse(W / 2, y + h / 2, W * (0.6 + Math.random() * 0.4), h, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  // ---------- EARTH — oceans, continents, ice caps ----------
  function earth() {
    return makeTexture(1024, 512, (ctx, W, H) => {
      // Ocean
      const ocean = ctx.createLinearGradient(0, 0, 0, H);
      ocean.addColorStop(0,   '#1a3a6e');
      ocean.addColorStop(0.5, '#1e5fa8');
      ocean.addColorStop(1,   '#1a3a6e');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, W, H);

      // Continents (rough approximations)
      const landColor = '#3a7a3a';
      const desertColor = '#c8a050';
      const continents = [
        // Americas
        { x: 0.18, y: 0.25, rx: 0.07, ry: 0.22 },
        { x: 0.22, y: 0.55, rx: 0.05, ry: 0.18 },
        // Europe / Africa
        { x: 0.48, y: 0.25, rx: 0.05, ry: 0.15 },
        { x: 0.50, y: 0.50, rx: 0.06, ry: 0.22 },
        // Asia
        { x: 0.65, y: 0.25, rx: 0.14, ry: 0.18 },
        // Australia
        { x: 0.75, y: 0.62, rx: 0.05, ry: 0.08 },
      ];
      continents.forEach(c => {
        ctx.fillStyle = landColor;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(c.x * W, c.y * H, c.rx * W, c.ry * H, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
        // Desert patches
        ctx.fillStyle = desertColor;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(c.x * W + 10, c.y * H + 8, c.rx * W * 0.4, c.ry * H * 0.35, 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Polar ice caps
      ctx.fillStyle = '#e8f4ff';
      ctx.globalAlpha = 0.88;
      ctx.fillRect(0, 0, W, H * 0.06);
      ctx.fillRect(0, H * 0.92, W, H * 0.08);
      ctx.globalAlpha = 1;

      // Cloud wisps
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 30; i++) {
        const cx = Math.random() * W;
        const cy = 0.1 * H + Math.random() * 0.8 * H;
        ctx.globalAlpha = 0.15 + Math.random() * 0.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 30 + Math.random() * 60, 6 + Math.random() * 10, Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  // ---------- MARS — red, rocky, dust ----------
  function mars() {
    return makeTexture(512, 256, (ctx, W, H) => {
      const base = ctx.createLinearGradient(0, 0, W, H);
      base.addColorStop(0,   '#c1440e');
      base.addColorStop(0.4, '#a83808');
      base.addColorStop(0.7, '#d05018');
      base.addColorStop(1,   '#b03410');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      // Terrain variation
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        const r = 4 + Math.random() * 22;
        const dark = Math.random() > 0.5;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = dark ? `rgba(60,10,0,${0.2 + Math.random() * 0.3})`
                              : `rgba(220,120,60,${0.15 + Math.random() * 0.2})`;
        ctx.fill();
      }

      // Polar ice cap (north)
      ctx.fillStyle = '#f0e8d8';
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.ellipse(W / 2, 0, W * 0.35, H * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Valles Marineris (dark canyon strip)
      ctx.fillStyle = 'rgba(40,8,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(W * 0.5, H * 0.5, W * 0.28, H * 0.04, 0.1, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ---------- JUPITER — orange/brown bands + GRS ----------
  function jupiter() {
    return makeTexture(1024, 512, (ctx, W, H) => {
      const bands = [
        '#C88B3A','#D4A050','#A06828','#E0B860','#8C5820',
        '#C88B3A','#D4A050','#B07838','#E0C070','#9A6830',
        '#C88B3A','#D4A050','#A06828','#E0B860','#8C5820',
      ];
      const bandH = H / bands.length;
      bands.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(0, i * bandH, W, bandH + 1);
      });

      // Wavy band edges
      ctx.globalAlpha = 0.4;
      for (let b = 0; b < bands.length; b++) {
        const y = b * bandH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 8) {
          ctx.lineTo(x, y + Math.sin(x / 40 + b) * 6);
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Great Red Spot
      ctx.save();
      ctx.translate(W * 0.62, H * 0.62);
      ctx.scale(1, 0.55);
      const grs = ctx.createRadialGradient(0, 0, 2, 0, 0, 38);
      grs.addColorStop(0, '#ff6040');
      grs.addColorStop(0.5, '#c84020');
      grs.addColorStop(1, 'rgba(180,60,20,0)');
      ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fillStyle = grs; ctx.fill();
      ctx.restore();
    });
  }

  // ---------- SATURN — golden bands ----------
  function saturn() {
    return makeTexture(512, 256, (ctx, W, H) => {
      const bands = ['#D4A855','#C09040','#E0C070','#B88030','#D8B060','#C09848'];
      const bandH = H / bands.length;
      bands.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(0, i * bandH, W, bandH + 1);
      });
      // Subtle wavy lines
      ctx.globalAlpha = 0.25;
      for (let y = 0; y < H; y += 14) {
        ctx.beginPath(); ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 10)
          ctx.lineTo(x, y + Math.sin(x / 30) * 3);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  // ---------- URANUS — pale cyan, slight banding ----------
  function uranus() {
    return makeTexture(512, 256, (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0,   '#5ee8e8');
      g.addColorStop(0.3, '#7df0f0');
      g.addColorStop(0.7, '#6de0e0');
      g.addColorStop(1,   '#50d0d0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Very faint bands
      ctx.globalAlpha = 0.12;
      for (let y = 0; y < H; y += 20) {
        ctx.fillStyle = y % 40 === 0 ? '#ffffff' : '#008888';
        ctx.fillRect(0, y, W, 10);
      }
      ctx.globalAlpha = 1;
    });
  }

  // ---------- NEPTUNE — deep blue, storm streaks ----------
  function neptune() {
    return makeTexture(512, 256, (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0,   '#1a2a8a');
      g.addColorStop(0.5, '#3050c0');
      g.addColorStop(1,   '#1a2080');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Cloud streaks
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 12; i++) {
        const y = Math.random() * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 10)
          ctx.lineTo(x, y + Math.sin(x / 25 + i) * 5);
        ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Dark storm spot
      const spot = ctx.createRadialGradient(W * 0.35, H * 0.45, 2, W * 0.35, H * 0.45, 22);
      spot.addColorStop(0, 'rgba(0,0,40,0.8)');
      spot.addColorStop(1, 'rgba(0,0,40,0)');
      ctx.beginPath(); ctx.arc(W * 0.35, H * 0.45, 22, 0, Math.PI * 2);
      ctx.fillStyle = spot; ctx.fill();
    });
  }

  // Public API — call once to generate all textures
  const cache = {};
  function get(key) {
    if (!cache[key]) {
      const fn = { mercury, venus, earth, mars, jupiter, saturn, uranus, neptune }[key];
      cache[key] = fn ? fn() : null;
    }
    return cache[key];
  }

  return { get };
})();
