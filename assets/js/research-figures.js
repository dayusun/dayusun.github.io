/* Research figures for the about page.
   Two scenes: the connectome over follow-up time (WebGL, three.js), and a
   dynamic prediction of mortality (canvas 2d). Both pause off screen.
   Data lives in research-brain-data.js as window.BRAIN. */
(function () {
  "use strict";

  function isDark() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set === "dark") return true;
    if (set === "light") return false;
    return !window.matchMedia || window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  var DARK = isDark();
  var B = window.BRAIN;

  function unpack(b64, Type) {
    var bin = atob(b64),
      n = bin.length,
      u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return new Type(u.buffer);
  }

  /* four rank-one components: a loading over follow-up time, a loading over the quantile */
  function aT(c, u) {
    if (c === 0) return 1.45 * Math.exp(-3 * u) - 0.12;
    if (c === 1) return -0.28 - 0.85 * u;
    if (c === 2) return 0.22 + 0.85 * Math.sin(Math.PI * u);
    return 0.58;
  }
  function bQ(c, v) {
    if (c === 0) return 1.25 - 1.05 * v;
    if (c === 1) return 0.35 + 1.1 * v;
    if (c === 2) return 4 * v * (1 - v);
    return 1;
  }
  /* the net signed coefficient the pattern carries, over both axes */
  function beta(u, v) {
    return aT(0, u) * bQ(0, v) - aT(1, u) * bQ(1, v) + aT(2, u) * bQ(2, v) - 1.15;
  }

  var RGB_LO = [39, 111, 191],
    RGB_MID = [247, 247, 247],
    RGB_HI = [209, 73, 91];
  function diverge(c, span) {
    var end = c < 0 ? RGB_LO : RGB_HI;
    var t = Math.pow(Math.min(Math.abs(c) / span, 1), 0.6);
    return [
      (RGB_MID[0] + (end[0] - RGB_MID[0]) * t) / 255,
      (RGB_MID[1] + (end[1] - RGB_MID[1]) * t) / 255,
      (RGB_MID[2] + (end[2] - RGB_MID[2]) * t) / 255,
    ];
  }
  function divergeHex(c, span) {
    var v = diverge(c, span);
    return (Math.round(v[0] * 255) << 16) | (Math.round(v[1] * 255) << 8) | Math.round(v[2] * 255);
  }

  var legend = document.getElementById("fig-legend");
  if (B && legend) {
    B.legend.forEach(function (n) {
      var s = document.createElement("span"),
        i = document.createElement("i");
      i.style.background = n[1];
      s.appendChild(i);
      s.appendChild(document.createTextNode(n[0]));
      legend.appendChild(s);
    });
    var ot = document.createElement("span"),
      oi = document.createElement("i");
    oi.style.background = B.pal["None"];
    ot.appendChild(oi);
    ot.appendChild(document.createTextNode("other parcels"));
    legend.appendChild(ot);
  }

  if (!window.THREE || !B) {
    ["fig-brain", "fig-dyn"].forEach(function (id) {
      var el = document.getElementById(id);
      el.className = "fig-fallback";
      el.textContent = "This figure needs WebGL.";
    });
    return;
  }

  /* shared drag + visibility plumbing */
  function makeStage(id, aspectDefault) {
    var el = document.getElementById(id);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    el.appendChild(renderer.domElement);
    var S = {
      el: el,
      renderer: renderer,
      drag: false,
      lastX: 0,
      lastY: 0,
      yaw: 0,
      pitch: 0,
      onScreen: true,
    };
    el.addEventListener("pointerdown", function (ev) {
      S.drag = true;
      S.lastX = ev.clientX;
      S.lastY = ev.clientY;
      el.classList.add("grabbing");
      el.setPointerCapture(ev.pointerId);
    });
    el.addEventListener("pointermove", function (ev) {
      if (!S.drag) return;
      S.yaw += (ev.clientX - S.lastX) * 0.008;
      S.pitch = Math.max(-0.75, Math.min(0.75, S.pitch + (ev.clientY - S.lastY) * 0.006));
      S.lastX = ev.clientX;
      S.lastY = ev.clientY;
    });
    function up(ev) {
      if (!S.drag) return;
      S.drag = false;
      el.classList.remove("grabbing");
      try {
        el.releasePointerCapture(ev.pointerId);
      } catch (e) {}
    }
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (rows) {
        S.onScreen = rows[0].isIntersecting;
      }).observe(el);
    }
    return S;
  }

  /* ===================== scene one: the brain over time ===================== */

  var bs = makeStage("fig-brain");
  var bScene = new THREE.Scene(),
    bGroup = new THREE.Group();
  bScene.add(bGroup);

  var pos = unpack(B.pos, Int16Array),
    idx = unpack(B.idx, Uint16Array),
    sc = B.scale;
  var verts = new Float32Array(pos.length),
    radial = 0,
    vert = 0;
  for (var i = 0; i < pos.length; i += 3) {
    var x = pos[i] * sc,
      y = pos[i + 1] * sc,
      z = pos[i + 2] * sc;
    verts[i] = x;
    verts[i + 1] = z;
    verts[i + 2] = -y;
    var rr = Math.sqrt(x * x + y * y);
    if (rr > radial) radial = rr;
    if (Math.abs(z) > vert) vert = Math.abs(z);
  }
  var shellGeo = new THREE.BufferGeometry();
  shellGeo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  shellGeo.setIndex(new THREE.BufferAttribute(idx, 1));
  shellGeo.computeVertexNormals();
  var shell = new THREE.Mesh(
    shellGeo,
    new THREE.MeshPhongMaterial({
      color: DARK ? 0x8fa2b4 : 0x9fb0be,
      transparent: true,
      opacity: DARK ? 0.15 : 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
      shininess: 28,
      specular: 0x555555,
    })
  );
  shell.renderOrder = 3;
  bGroup.add(shell);

  var HOME = B.nodes.map(function (p) {
    return new THREE.Vector3(p[0], p[2], -p[1]);
  });
  var byNet = {};
  B.nodes.forEach(function (p, k) {
    (byNet[p[4]] = byNet[p[4]] || []).push(k);
  });
  var sphere = new THREE.SphereGeometry(2.2, 12, 9);
  var tmpM = new THREE.Matrix4();
  Object.keys(byNet).forEach(function (net) {
    var ids = byNet[net],
      faint = net === "None";
    var mesh = new THREE.InstancedMesh(
      sphere,
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(B.pal[net]),
        shininess: 65,
        specular: 0x666666,
        transparent: faint,
        opacity: faint ? 0.42 : 1,
      }),
      ids.length
    );
    ids.forEach(function (k, j) {
      mesh.setMatrixAt(j, tmpM.makeTranslation(HOME[k].x, HOME[k].y, HOME[k].z));
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.renderOrder = faint ? 0 : 1;
    bGroup.add(mesh);
  });

  var tubeGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
  var UP = new THREE.Vector3(0, 1, 0);
  var tubes = B.edges.map(function (e) {
    var a = HOME[e[0]],
      b = HOME[e[1]];
    var dir = new THREE.Vector3().subVectors(b, a);
    var mat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 40, specular: 0x555555, transparent: true });
    var mesh = new THREE.Mesh(tubeGeo, mat);
    mesh.position.copy(a).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
    mesh.renderOrder = 2;
    bGroup.add(mesh);
    return { mesh: mesh, mat: mat, len: dir.length(), e: e };
  });

  function paint(u, v) {
    for (var k = 0; k < tubes.length; k++) {
      var T = tubes[k],
        e = T.e;
      var c = e[3] * e[4] * aT(e[2], u) * bQ(e[2], v);
      var mag = Math.min(Math.abs(c) / 0.95, 1);
      T.mat.color.setHex(divergeHex(c, 0.95));
      T.mat.opacity = Math.min(1, 0.1 + 1.6 * mag);
      T.mesh.visible = mag > 0.03;
      var rad = 0.25 + 2.1 * mag;
      T.mesh.scale.set(rad, T.len, rad);
    }
  }

  bScene.add(new THREE.AmbientLight(0xffffff, DARK ? 0.72 : 0.78));
  var k1 = new THREE.DirectionalLight(0xffffff, 0.6);
  k1.position.set(0.6, 1, 0.8);
  bScene.add(k1);
  var k2 = new THREE.DirectionalLight(0xffffff, 0.25);
  k2.position.set(-0.8, -0.3, -0.6);
  bScene.add(k2);

  var bCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
  bCam.position.set(0, 0, 900);
  bCam.lookAt(0, 0, 0);
  function bFit() {
    var w = bs.el.clientWidth || 960,
      h = bs.el.clientHeight || 420;
    bs.renderer.setSize(w, h, false);
    var need = Math.max(radial * 1.08, vert * 1.12 * (w / h));
    bCam.left = -need;
    bCam.right = need;
    bCam.top = (need * h) / w;
    bCam.bottom = (-need * h) / w;
    bCam.updateProjectionMatrix();
  }
  bFit();
  if (window.ResizeObserver) new ResizeObserver(bFit).observe(bs.el);
  else window.addEventListener("resize", bFit);
  bs.yaw = -Math.PI / 2;

  /* ============ scene two: dynamic prediction, update by update ============
     One patient. At each landmark tau the new measurement is revealed, the
     history is refitted, and the predicted survival S_tau(t) = P(T > t | H_tau)
     and the predicted event-time density f_tau(t) morph into their new shapes.
     Earlier predictions stay behind as faint traces, so the animation shows a
     trajectory of beliefs rather than a line sliding along.                  */

  function tok(n) {
    return getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  }
  var C_GROUND, C_RULE, C_FAINT, C_INK, C_MUTED;
  function readTokens() {
    C_GROUND = tok("--fig-ground") || "#ffffff";
    C_RULE = tok("--fig-rule");
    C_FAINT = tok("--fig-faint");
    C_INK = tok("--fig-ink");
    C_MUTED = tok("--fig-muted");
  }
  readTokens();

  var TEAL = "#2f7f96",
    CLAY = "#c1703c",
    RED = "#c1121f";

  var H0 = 0.0021,
    GAM = 1.25,
    POP0 = -0.8,
    POP1 = 0.014,
    KNEE = 21,
    S1 = 0.012,
    S2 = 0.078,
    SDE = 0.13,
    WIN = 4;
  var XMAX = 60,
    NG = 121,
    DTG = XMAX / (NG - 1);
  var VISITS = [3, 9, 15, 21, 27, 33, 39, 45];
  var NZ = [0.09, -0.12, 0.06, 0.14, -0.1, 0.05, -0.07, 0.11];
  var OBS = VISITS.map(function (t, i) {
    return POP0 + S1 * t + S2 * Math.max(0, t - KNEE) + NZ[i];
  });

  function cumH(b0, b1, t) {
    if (Math.abs(b1) < 1e-6) return H0 * Math.exp(GAM * b0) * t;
    return (H0 * Math.exp(GAM * b0) * (Math.exp(GAM * b1 * t) - 1)) / (GAM * b1);
  }
  function fitAt(tau) {
    var idx = [];
    for (var j = 0; j < VISITS.length && VISITS[j] <= tau; j++) idx.push(j);
    var n = idx.length;
    if (n === 0) return { b0: POP0, b1: POP1, se: 0.03 };
    var use = idx.slice(Math.max(0, n - WIN)),
      m = use.length,
      sx = 0,
      sy = 0,
      sxx = 0,
      sxy = 0;
    use.forEach(function (j) {
      sx += VISITS[j];
      sy += OBS[j];
      sxx += VISITS[j] * VISITS[j];
      sxy += VISITS[j] * OBS[j];
    });
    var b1 = POP1,
      b0,
      sxxc = sxx - (sx * sx) / m;
    if (m >= 2 && Math.abs(sxxc) > 1e-9) {
      b1 = (sxy - (sx * sy) / m) / sxxc;
      b0 = (sy - b1 * sx) / m;
    } else b0 = sy - POP1 * sx;
    var w = n / (n + 1.1);
    var se = m >= 2 ? SDE / Math.sqrt(sxxc) : 0.03;
    return {
      b0: w * b0 + (1 - w) * POP0,
      b1: Math.max(-0.01, Math.min(0.18, w * b1 + (1 - w) * POP1)),
      se: Math.max(se, 0.004) / w,
    };
  }
  function survAt(f, tau, t, db) {
    if (t <= tau) return 1;
    var b1 = f.b1 + (db || 0);
    return Math.exp(-Math.max(cumH(f.b0, b1, t) - cumH(f.b0, b1, tau), 0));
  }

  /* one stored prediction state per landmark, plus the prior before any data */
  var LANDMARKS = [0].concat(VISITS);
  var STATES = LANDMARKS.map(function (tau) {
    var f = fitAt(tau);
    var S = new Float64Array(NG),
      L = new Float64Array(NG),
      U = new Float64Array(NG),
      F = new Float64Array(NG);
    for (var g = 0; g < NG; g++) {
      var t = g * DTG;
      S[g] = survAt(f, tau, t);
      U[g] = survAt(f, tau, t, -1.645 * f.se);
      L[g] = survAt(f, tau, t, 1.645 * f.se);
      F[g] = t <= tau ? 0 : H0 * Math.exp(GAM * (f.b0 + f.b1 * t)) * S[g];
    }
    var med = null;
    for (var u = tau; u <= 600; u += 0.5) {
      if (survAt(f, tau, u) < 0.5) {
        med = u - tau;
        break;
      }
    }
    var nseen = 0;
    while (nseen < VISITS.length && VISITS[nseen] <= tau) nseen++;
    return {
      tau: tau,
      f: f,
      S: S,
      L: L,
      U: U,
      F: F,
      nseen: nseen,
      s1: survAt(f, tau, tau + 12),
      s2: survAt(f, tau, tau + 24),
      med: med,
    };
  });
  var FMAX = 0;
  STATES.forEach(function (st) {
    for (var g = 0; g < NG; g++) if (st.F[g] > FMAX) FMAX = st.F[g];
  });

  var dynEl = document.getElementById("fig-dyn");
  var cv = document.createElement("canvas");
  dynEl.appendChild(cv);
  var ctx = cv.getContext("2d");
  var W = 0,
    H = 0,
    PADL = 64,
    PADR = 28,
    PADB = 38,
    HEAD = 64,
    FS = 1,
    compact = false;
  var panAT = 0,
    panAB = 0,
    panBT = 0,
    panBB = 0,
    panCT = 0,
    panCB = 0;

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = dynEl.clientWidth || 480;
    H = dynEl.clientHeight || 480;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    /* the figure sits in a column, so everything scales with the width */
    compact = W < 620;
    FS = compact ? 0.86 : 1;
    PADL = compact ? 34 : 64;
    PADR = compact ? 14 : 28;
    PADB = compact ? 28 : 38;
    HEAD = compact ? 46 : 64;
    var gut = compact ? 26 : 38;
    var avail = H - HEAD - PADB - 2 * gut;
    panAT = HEAD + (compact ? 16 : 20);
    panAB = panAT + avail * 0.24;
    panBT = panAB + gut;
    panBB = panBT + avail * 0.46;
    panCT = panBB + gut;
    panCB = panCT + avail * 0.3;
  }
  function px(t) {
    return PADL + (t / XMAX) * (W - PADL - PADR);
  }
  var BLO = -1.3,
    BHI = 3.5;
  function ay(v) {
    return panAB - ((v - BLO) / (BHI - BLO)) * (panAB - panAT);
  }
  function by(p) {
    return panBB - p * (panBB - panBT);
  }
  function cy(d) {
    return panCB - (d / FMAX) * (panCB - panCT);
  }
  sizeCanvas();

  var step = 0,
    prog = 0,
    fade = 0,
    seqStart = null,
    SWEEP = 15200,
    TAIL = 2600,
    FADE = 700;
  function ease(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  function lerp(a, b, p) {
    return a + (b - a) * p;
  }

  function band(from, to, p, lo, hi) {
    var path = new Path2D();
    for (var g = 0; g < NG; g++) path[g === 0 ? "moveTo" : "lineTo"](px(g * DTG), by(lerp(from[hi][g], to[hi][g], p)));
    for (g = NG - 1; g >= 0; g--) path.lineTo(px(g * DTG), by(lerp(from[lo][g], to[lo][g], p)));
    path.closePath();
    return path;
  }
  function line(from, to, p, key, ymap) {
    var path = new Path2D();
    for (var g = 0; g < NG; g++) path[g === 0 ? "moveTo" : "lineTo"](px(g * DTG), ymap(lerp(from[key][g], to[key][g], p)));
    return path;
  }
  function densityPath(from, to, p) {
    var path = new Path2D();
    path.moveTo(px(0), panCB);
    for (var g = 0; g < NG; g++) path.lineTo(px(g * DTG), cy(lerp(from.F[g], to.F[g], p)));
    path.lineTo(px(XMAX), panCB);
    path.closePath();
    return path;
  }
  function fmtMed(m) {
    return m === null ? "beyond 10 yr" : (m / 12).toFixed(1) + " yr";
  }

  function draw() {
    /* prog runs 0 -> 1 as the belief morphs from STATES[step] to the next one */
    var a = STATES[step],
      b = STATES[Math.min(step + 1, STATES.length - 1)],
      p = 0.32 * prog + 0.68 * ease(prog);
    var tau = lerp(a.tau, b.tau, p);
    /* every quantity is read off the moving landmark, so nothing on the canvas
       is ever still: the belief is always part way from one visit to the next */
    var liveS1 = lerp(a.s1, b.s1, p),
      liveS2 = lerp(a.s2, b.s2, p),
      liveMed = a.med === null || b.med === null ? (p < 0.5 ? a.med : b.med) : lerp(a.med, b.med, p);
    var nseen = 0;
    for (var vi = 0; vi < VISITS.length; vi++) if (VISITS[vi] <= tau + 1e-6) nseen++;

    ctx.fillStyle = C_GROUND;
    ctx.fillRect(0, 0, W, H);
    ctx.font = (11 * FS).toFixed(1) + 'px "IBM Plex Sans", system-ui, sans-serif';
    ctx.lineJoin = "round";

    /* ---------- header: the quantities a clinician would read ---------- */
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = C_MUTED;
    ctx.font = (11 * FS).toFixed(1) + 'px "IBM Plex Sans", system-ui, sans-serif';
    ctx.fillText(nseen + " visits, landmark at month " + tau.toFixed(0), PADL, 4);

    var cells = [
      [compact ? "1 yr" : "1-year survival", (a.s1 * 100).toFixed(0) + "%", (liveS1 * 100).toFixed(0) + "%"],
      [compact ? "2 yr" : "2-year survival", (a.s2 * 100).toFixed(0) + "%", (liveS2 * 100).toFixed(0) + "%"],
      [compact ? "median" : "median survival", fmtMed(a.med), fmtMed(liveMed)],
    ];
    var cw = (W - PADL - PADR) / cells.length;
    cells.forEach(function (c, i) {
      var x = PADL + i * cw;
      ctx.fillStyle = C_FAINT;
      ctx.font = (10 * FS).toFixed(1) + 'px "IBM Plex Sans", system-ui, sans-serif';
      ctx.fillText(c[0], x, 20);
      ctx.font = "500 " + (14.5 * FS).toFixed(1) + 'px "IBM Plex Sans", system-ui, sans-serif';
      if (c[1] !== c[2]) {
        ctx.fillStyle = C_FAINT;
        ctx.fillText(c[1], x, 32);
        var wprev = ctx.measureText(c[1]).width;
        ctx.fillText("→", x + wprev + 5, 32);
        ctx.fillStyle = CLAY;
        ctx.fillText(c[2], x + wprev + 10 + ctx.measureText("→").width, 32);
      } else {
        ctx.fillStyle = C_INK;
        ctx.fillText(c[2], x, 32);
      }
    });
    ctx.font = (11 * FS).toFixed(1) + 'px "IBM Plex Sans", system-ui, sans-serif';

    /* ---------- panel A: the longitudinal measurements ---------- */
    ctx.save();
    ctx.beginPath();
    ctx.rect(PADL - 3, panAT - 8, W - PADL - PADR + 6, panAB - panAT + 11);
    ctx.clip();
    var fit = { b0: lerp(a.f.b0, b.f.b0, p), b1: lerp(a.f.b1, b.f.b1, p) };
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(px(0), ay(fit.b0));
    ctx.lineTo(px(tau), ay(fit.b0 + fit.b1 * tau));
    ctx.stroke();
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(px(tau), ay(fit.b0 + fit.b1 * tau));
    ctx.lineTo(px(XMAX), ay(fit.b0 + fit.b1 * XMAX));
    ctx.stroke();
    ctx.restore();
    for (var j = 0; j < VISITS.length; j++) {
      if (VISITS[j] > tau) continue;
      var age = (tau - VISITS[j]) / 6; /* visits are six months apart */
      ctx.fillStyle = TEAL;
      ctx.beginPath();
      ctx.arc(px(VISITS[j]), ay(OBS[j]), age < 0.25 ? 1.6 + 9.2 * age : 3.9, 0, 6.2832);
      ctx.fill();
      if (age < 0.6) {
        var ring = age / 0.6;
        ctx.strokeStyle = TEAL;
        ctx.globalAlpha = 1 - ring;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(px(VISITS[j]), ay(OBS[j]), 5 + 14 * ring, 0, 6.2832);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    ctx.fillStyle = C_MUTED;
    ctx.textAlign = "left";
    ctx.fillText(compact ? "biomarker" : "biomarker, observed at each visit", PADL, panAT - 15);

    /* ---------- panel B: P(T > t | history up to tau) ---------- */
    ctx.strokeStyle = C_RULE;
    ctx.lineWidth = 1;
    ctx.fillStyle = C_FAINT;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [0, 0.5, 1].forEach(function (v) {
      ctx.beginPath();
      ctx.moveTo(PADL, by(v));
      ctx.lineTo(W - PADR, by(v));
      ctx.stroke();
      ctx.fillText(v.toFixed(1), PADL - 8, by(v));
    });

    /* every earlier belief, kept faintly */
    ctx.save();
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = CLAY;
    for (var k = 0; k < step; k++) {
      ctx.globalAlpha = 0.09 + 0.16 * (k / Math.max(1, step - 1));
      ctx.stroke(line(STATES[k], STATES[k], 0, "S", by));
    }
    ctx.restore();

    ctx.fillStyle = CLAY;
    ctx.globalAlpha = 0.16;
    ctx.fill(band(a, b, p, "L", "U"));
    ctx.globalAlpha = 1;
    ctx.strokeStyle = CLAY;
    ctx.lineWidth = 2.6;
    ctx.stroke(line(a, b, p, "S", by));

    [12, 24].forEach(function (h, i) {
      var u = Math.min(tau + h, XMAX);
      var g = Math.round(u / DTG);
      var v = lerp(a.S[g], b.S[g], p);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = C_FAINT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px(u), by(v));
      ctx.lineTo(px(u), by(0));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = RED;
      ctx.beginPath();
      ctx.arc(px(u), by(v), 4, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = C_FAINT;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(i === 0 ? "+1 yr" : "+2 yr", px(u), by(0) + 4);
    });
    ctx.fillStyle = C_MUTED;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(compact ? "predicted survival  S(t | τ)" : "predicted survival  P(T > t | history up to τ)", PADL, panBT - 15);

    /* ---------- panel C: the predicted event-time density ---------- */
    ctx.fillStyle = CLAY;
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (k = 0; k < step; k++) ctx.fill(densityPath(STATES[k], STATES[k], 0));
    ctx.restore();
    ctx.globalAlpha = 0.3;
    ctx.fill(densityPath(a, b, p));
    ctx.globalAlpha = 1;
    ctx.strokeStyle = CLAY;
    ctx.lineWidth = 1.8;
    ctx.stroke(line(a, b, p, "F", cy));
    ctx.strokeStyle = C_RULE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADL, panCB);
    ctx.lineTo(W - PADR, panCB);
    ctx.stroke();
    ctx.fillStyle = C_MUTED;
    ctx.fillText(compact ? "event-time density  f(t | τ)" : "predicted event-time density  f(t | history up to τ)", PADL, panCT - 15);

    /* ---------- the landmark, through both upper panels ---------- */
    ctx.save();
    ctx.strokeStyle = CLAY;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(px(tau), panAT - 8);
    ctx.lineTo(px(tau), panBB);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = CLAY;
    ctx.beginPath();
    ctx.moveTo(px(tau), panAT - 8);
    ctx.lineTo(px(tau) - 4, panAT - 15);
    ctx.lineTo(px(tau) + 4, panAT - 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    /* ---------- shared axis ---------- */
    ctx.fillStyle = C_FAINT;
    ctx.textBaseline = "top";
    [0, 12, 24, 36, 48, 60].forEach(function (t, i) {
      ctx.textAlign = i === 0 ? "left" : i === 5 ? "right" : "center";
      ctx.fillText(t, px(t), panCB + 8);
    });
    ctx.textAlign = "center";
    ctx.fillText("months since enrolment", (PADL + W - PADR) / 2, panCB + 23);

    if (fade > 0) {
      ctx.globalAlpha = fade;
      ctx.fillStyle = C_GROUND;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  function reset() {
    step = 0;
    prog = 0;
    fade = 0;
    seqStart = null;
  }

  var dynOn = true,
    dynPaused = false,
    heldAt = null;
  dynEl.addEventListener("click", function () {
    dynPaused = !dynPaused;
  });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (rows) {
      dynOn = rows[0].isIntersecting;
    }).observe(dynEl);
  }
  function refit() {
    sizeCanvas();
    draw();
  }
  if (window.ResizeObserver) new ResizeObserver(refit).observe(dynEl);
  else window.addEventListener("resize", refit);

  if (window.MutationObserver) {
    new MutationObserver(function () {
      var d = isDark();
      if (d === DARK) return;
      DARK = d;
      readTokens();
      shell.material.color.setHex(DARK ? 0x8fa2b4 : 0x9fb0be);
      shell.material.opacity = DARK ? 0.15 : 0.12;
      draw();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ===================== one loop for both scenes ===================== */

  var lastBrain = 0;
  function frame(nowMs) {
    requestAnimationFrame(frame);
    if (document.hidden) return;

    if (bs.onScreen && (bs.drag || nowMs - lastBrain > 32)) {
      bs.yaw += (0.00232 * Math.min(nowMs - lastBrain, 120)) / 16.7;
      lastBrain = nowMs;
      bGroup.rotation.y = bs.yaw;
      bGroup.rotation.x = bs.pitch;
      bs.renderer.render(bScene, bCam);
    }

    if (!dynOn || dynPaused) {
      // off screen or held: stop the clock where it stands rather than rewinding
      if (heldAt === null) heldAt = nowMs;
    } else {
      // the whole sequence is driven off the clock, never off accumulated dt:
      // a capped frame delta would make the animation crawl on a slow renderer
      if (heldAt !== null) {
        if (seqStart !== null) seqStart += nowMs - heldAt;
        heldAt = null;
      }
      if (seqStart === null) seqStart = nowMs;
      var last = STATES.length - 1,
        total = nowMs - seqStart;
      if (total > SWEEP + TAIL) {
        seqStart = nowMs;
        total = 0;
      }
      var q = Math.min(total / SWEEP, 1) * last;
      step = Math.min(Math.floor(q), last);
      prog = Math.min(q - step, 1);
      var tail = total - SWEEP;
      fade = tail > TAIL - FADE ? (tail - (TAIL - FADE)) / FADE : total < FADE ? 1 - total / FADE : 0;
      draw();
    }
  }

  paint(0.25, 0.5);
  draw();
  bGroup.rotation.y = bs.yaw;
  bs.renderer.render(bScene, bCam);
  requestAnimationFrame(frame);
})();
