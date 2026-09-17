---
layout: page
permalink: /people/
title: People
description: Doctoral students and collaborators.
og_image: /assets/img/la_grande_jatte.jpg
nav: false
nav_order: 5
---

<style>
  .lab-painting {
    margin: 0;
  }

  .lab-painting canvas,
  .lab-painting img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1280 / 852;
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow:
      0 2px 5px #00000029,
      0 2px 10px #0000001f;
  }

  .lab-painting figcaption {
    font-size: 0.8rem;
  }

  h2.lab-label {
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-top: 1px solid var(--global-divider-color);
    padding-top: 1rem;
    margin-top: 3.2rem;
    margin-bottom: 1.8rem;
  }

  .lab-pi {
    display: grid;
    border-top: 1px solid var(--global-divider-color);
    padding-top: 2rem;
    margin-top: 2.5rem;
    grid-template-columns: minmax(130px, 210px) 1fr;
    gap: 1.8rem;
    align-items: center;
    margin-bottom: 2.8rem;
  }

  .lab-pi .lab-name {
    font-size: 1.5rem;
    margin-top: 0;
  }

  .lab-pi .lab-role {
    font-size: 1.05rem;
  }

  .lab-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
    align-items: start;
  }

  @media (min-width: 576px) {
    .lab-grid {
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }
  }

  .lab-pi figure,
  .lab-grid figure {
    margin: 0;
  }

  .lab-pi img,
  .lab-grid img {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 3px;
    box-shadow:
      0 2px 5px #00000029,
      0 2px 10px #0000001f;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;
  }

  .lab-grid > div:hover img {
    transform: translateY(-4px);
    box-shadow:
      0 8px 16px #0000002e,
      0 4px 20px #00000024;
  }

  .lab-name {
    font-size: 1.05rem;
    font-weight: 600;
    margin-top: 0.75rem;
  }

  .lab-role {
    font-size: 0.95rem;
  }

  .lab-note {
    font-size: 0.88rem;
    opacity: 0.7;
    margin-top: 0.3rem;
  }

  .lab-collabs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.1rem;
  }
</style>

<div class="row">
  <div class="col-md-8">
    <p>
      The group develops statistical and data science methodology driven by real biomedical data. The methods are released as open-source R and MATLAB
      packages, listed on the <a href="{% link _pages/software.md %}">Software</a> page. They are not Sunday drivers: the heavy loops drop into C++.
    </p>
    <p>The group goes by SUNDAY Lab, which is Sun, Dayu, minus the comma. The other Sunday is Seurat's.</p>
  </div>
  <div class="col-md-4">
    <figure class="lab-painting">
      <canvas id="jatte" role="img" aria-label="Georges Seurat, A Sunday on La Grande Jatte, painted dot by dot."></canvas>
      <noscript>
        <img src="{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}" alt="Georges Seurat, A Sunday on La Grande Jatte." />
      </noscript>
      <figcaption class="caption">
        Georges Seurat, <em>A Sunday on La Grande Jatte</em>, <span style="white-space: nowrap">1884&ndash;86</span>. Art Institute of Chicago, public
        domain. <span id="jatte-hint" hidden>Move over it to stir the dots.</span> <a href="#" id="jatte-replay" hidden>Paint it again</a>
      </figcaption>
    </figure>
  </div>
</div>

{% assign pi = site.data.people.pi %}

<div class="lab-pi">
  <div>{% include figure.liquid loading="eager" path="assets/img/prof_pic.png" class="img-fluid" sizes="(min-width: 576px) 210px, 40vw" alt=pi.name %}</div>
  <div>
    <div class="lab-name">{{ pi.name }}</div>
    <div class="lab-role">{{ pi.role }}</div>
    <div class="lab-note">{{ pi.title }}</div>
  </div>
</div>

<h2 id="students" class="lab-label">Students</h2>

<div class="lab-grid">
  {% for m in site.data.people.members %}
  <div>
    {% assign member_image = m.image | prepend: 'assets/img/team/' %}
    {% include figure.liquid loading="lazy" path=member_image class="img-fluid" sizes="(min-width: 576px) 220px, 45vw" alt=m.name %}
    <div class="lab-name">{{ m.name }}</div>
    <div class="lab-role">{{ m.role }}, since {{ m.joined }}</div>
    {% if m.works_on %}<div class="lab-note">{{ m.works_on }}</div>{% endif %}
    {% if m.cosupervisors %}
    <div class="lab-note">
      With {% for c in m.cosupervisors %}<a href="{{ c.url }}">{{ c.name }}</a>{% unless forloop.last %} and {% endunless %}{% endfor %}
    </div>
    {% endif %}
  </div>
  {% endfor %}
</div>

{% if site.data.people.alumni.size > 0 %}

<h2 id="alumni" class="lab-label">Alumni</h2>

{% for a in site.data.people.alumni %}- {{ a.name }}, {{ a.role }}, {{ a.years }}.{% if a.next %} Next: {{ a.next }}.{% endif %}
{% endfor %}
{% endif %}

{% if site.data.people.collaborators.size > 0 %}

<h2 id="collaborators" class="lab-label">Collaborators</h2>

<div class="lab-collabs">
  {% for c in site.data.people.collaborators %}
  <div>
    <div class="lab-role"><a href="{{ c.url }}">{{ c.name }}</a></div>
    <div class="lab-note">{{ c.affiliation }}</div>
  </div>
  {% endfor %}
</div>

{% endif %}

<script>
  // The painting draws itself dot by dot, which is how Seurat made it.
  // Falls back to a single static paint when the visitor asks for reduced motion.
  (function () {
    const canvas = document.getElementById("jatte");
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    let dots = [];
    let radius = 3;
    let raf = null;
    let settled = false;

    function build() {
      const w = canvas.clientWidth || 320;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(((w * img.height) / img.width) * dpr);

      const sample = document.createElement("canvas");
      sample.width = canvas.width;
      sample.height = canvas.height;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      sctx.drawImage(img, 0, 0, sample.width, sample.height);
      const data = sctx.getImageData(0, 0, sample.width, sample.height).data;

      // Hold the dot count near 18k whatever the canvas measures, so a wide
      // screen animates as smoothly as a phone.
      const step = Math.max(3, Math.round(Math.sqrt((canvas.width * canvas.height) / 18000)));
      radius = step * 0.72;
      dots = [];
      for (let y = step / 2; y < sample.height; y += step) {
        for (let x = step / 2; x < sample.width; x += step) {
          const i = (Math.floor(y) * sample.width + Math.floor(x)) * 4;
          dots.push({
            x: x,
            y: y,
            fromX: Math.random() * sample.width,
            fromY: Math.random() * sample.height,
            delay: Math.random() * 0.45,
            dx: 0,
            dy: 0,
            colour: "rgb(" + data[i] + "," + data[i + 1] + "," + data[i + 2] + ")",
          });
        }
      }
      dots.sort(() => Math.random() - 0.5);
    }

    function paint(progress) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let p = (progress - d.delay) / (1 - d.delay);
        if (p <= 0) continue;
        if (p > 1) p = 1;
        const e = 1 - Math.pow(1 - p, 3);
        ctx.globalAlpha = Math.min(1, p * 1.6);
        ctx.fillStyle = d.colour;
        ctx.beginPath();
        ctx.arc(d.fromX + (d.x - d.fromX) * e, d.fromY + (d.y - d.fromY) * e, radius, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function scatter() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.85;
      for (let i = 0; i < dots.length; i++) {
        ctx.fillStyle = dots[i].colour;
        ctx.beginPath();
        ctx.arc(dots[i].fromX, dots[i].fromY, radius, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawSettled() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.fillStyle = d.colour;
        ctx.beginPath();
        ctx.arc(d.x + d.dx, d.y + d.dy, radius, 0, 6.2832);
        ctx.fill();
      }
    }

    // Moving over the finished painting pushes nearby dots outward; they drift
    // back into place once the cursor passes. Skipped for reduced motion.
    function stir(clientX, clientY) {
      if (!settled || still || !dots.length) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (clientX - rect.left) * (canvas.width / rect.width);
      const my = (clientY - rect.top) * (canvas.height / rect.height);
      const reach = Math.max(36, canvas.width * 0.09);
      let stirred = false;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const ddx = d.x - mx;
        const ddy = d.y - my;
        const dist2 = ddx * ddx + ddy * ddy;
        if (dist2 < reach * reach) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / reach) * 22;
          d.dx += (ddx / dist) * force;
          d.dy += (ddy / dist) * force;
          stirred = true;
        }
      }
      if (stirred) {
        if (raf) cancelAnimationFrame(raf);
        settleOffsets();
      }
    }

    function settleOffsets() {
      let maxD = 0;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.dx *= 0.86;
        d.dy *= 0.86;
        const m = Math.max(Math.abs(d.dx), Math.abs(d.dy));
        if (m > maxD) maxD = m;
      }
      drawSettled();
      if (maxD > 0.25) {
        raf = requestAnimationFrame(settleOffsets);
      } else {
        raf = null;
        for (let i = 0; i < dots.length; i++) {
          dots[i].dx = 0;
          dots[i].dy = 0;
        }
        drawSettled();
      }
    }

    // `force` is a click: an explicit request to see it, which outranks the
    // reduced motion preference that governs the automatic play.
    function run(force) {
      if (raf) cancelAnimationFrame(raf);
      settled = false;
      for (let i = 0; i < dots.length; i++) {
        dots[i].dx = 0;
        dots[i].dy = 0;
      }
      if (still && !force) {
        settled = true;
        return paint(1);
      }
      const started = performance.now();
      const duration = 3200;
      (function frame(now) {
        const progress = Math.min(1, (now - started) / duration);
        paint(progress);
        if (progress < 1) raf = requestAnimationFrame(frame);
        else {
          raf = null;
          settled = true;
          const hint = document.getElementById("jatte-hint");
          if (hint) hint.hidden = false;
        }
      })(started);
    }

    img.onload = function () {
      build();
      if (still) {
        paint(1); // reduced motion: show the finished painting straight away
        settled = true;
      } else {
        scatter(); // hold the scattered state so the settling is visible
      }
      const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          setTimeout(function () {
            run(false);
          }, 500);
          observer.disconnect();
        }
      });
      observer.observe(canvas);
      canvas.addEventListener("click", function () {
        run(true);
      });
      canvas.addEventListener("pointermove", function (event) {
        stir(event.clientX, event.clientY);
      });
      const replay = document.getElementById("jatte-replay");
      if (replay) {
        replay.hidden = false;
        replay.addEventListener("click", function (event) {
          event.preventDefault();
          run(true);
        });
      }
      let resizeTimer;
      let lastWidth = canvas.clientWidth;
      window.addEventListener("resize", function () {
        if (canvas.clientWidth === lastWidth) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          lastWidth = canvas.clientWidth;
          build();
          paint(1);
          settled = true;
        }, 200);
      });
    };
    img.src = "{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}";
  })();
</script>
