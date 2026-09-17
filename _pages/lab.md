---
layout: page
permalink: /lab/
title: SUNDAY Lab
description: Sun, Dayu. Statistical methods for incomplete and high-dimensional biomedical data.
og_image: /assets/img/la_grande_jatte.jpg
nav: false
nav_order: 3
---

<style>
  .lab-band {
    position: relative;
    margin: 2rem 0 0.6rem;
    border-radius: 4px;
    overflow: hidden;
    box-shadow:
      0 2px 5px #00000029,
      0 2px 10px #0000001f;
  }

  .lab-band canvas,
  .lab-band img {
    display: block;
    width: 100%;
    height: clamp(180px, 25vw, 320px);
    object-fit: cover;
    cursor: pointer;
  }

  .lab-credit {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.3rem 1.5rem;
    font-size: 0.78rem;
    opacity: 0.65;
    margin-bottom: 2.4rem;
  }

  .lab-lead {
    font-size: 1.3rem;
    line-height: 1.55;
    margin-bottom: 1.2rem;
  }

  h2.lab-label {
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-top: 1px solid var(--global-divider-color);
    padding-top: 1rem;
    margin-top: 3.2rem;
    margin-bottom: 1.8rem;
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

  .lab-grid figure {
    margin: 0;
  }

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
    font-size: 0.88rem;
  }

  .lab-note {
    font-size: 0.82rem;
    opacity: 0.68;
    margin-top: 0.3rem;
  }

  .lab-collabs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.1rem;
  }
</style>

<div class="lab-band">
  <canvas id="jatte" role="img" aria-label="Georges Seurat, A Sunday on La Grande Jatte, painted dot by dot."></canvas>
  <noscript>
    <img src="{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}" alt="Georges Seurat, A Sunday on La Grande Jatte." />
  </noscript>
</div>
<div class="lab-credit">
  <span>Georges Seurat, <em>A Sunday on La Grande Jatte</em>, <span style="white-space: nowrap">1884&ndash;86</span>. Art Institute of Chicago, public domain.</span>
  <a href="#" id="jatte-replay" hidden>Paint it again</a>
</div>

The name is Sun, Dayu, run together. We do not meet on Sundays. The other Sunday is Seurat's.
{: .lab-lead}

SUNDAY Lab develops statistical and data science methodology driven by real biomedical data, in the Department of Biostatistics and Health Data Science at Indiana University School of Medicine. The methods are released as open-source R and MATLAB packages, listed on the [Software]({% link _pages/software.md %}) page.

<h2 id="people" class="lab-label">People</h2>

{% assign pi = site.data.lab.pi %}

<div class="lab-grid">
  <div>
    {% include figure.liquid loading="eager" path="assets/img/prof_pic.png" class="img-fluid" sizes="(min-width: 576px) 220px, 45vw" alt=pi.name %}
    <div class="lab-name">{{ pi.name }}</div>
    <div class="lab-role">{{ pi.role }}</div>
    <div class="lab-note">Assistant Professor of Biostatistics and Health Data Science</div>
  </div>
  {% for m in site.data.lab.members %}
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

{% if site.data.lab.alumni.size > 0 %}

<h2 id="alumni" class="lab-label">Alumni</h2>

{% for a in site.data.lab.alumni %}- {{ a.name }}, {{ a.role }}, {{ a.years }}.{% if a.next %} Next: {{ a.next }}.{% endif %}
{% endfor %}
{% endif %}

{% if site.data.lab.collaborators.size > 0 %}

<h2 id="collaborators" class="lab-label">Collaborators</h2>

<div class="lab-collabs">
  {% for c in site.data.lab.collaborators %}
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
    let step = 6;
    let raf = null;

    function build() {
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 240;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Crop the painting to the band the way object-fit: cover would.
      const target = canvas.width / canvas.height;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.width / target;
      if (sh > img.height) {
        sh = img.height;
        sw = img.height * target;
        sx = (img.width - sw) / 2;
      } else {
        sy = (img.height - sh) * 0.45;
      }

      const sample = document.createElement("canvas");
      sample.width = canvas.width;
      sample.height = canvas.height;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, sample.width, sample.height);
      const data = sctx.getImageData(0, 0, sample.width, sample.height).data;

      // Hold the dot count near 18k whatever the band measures, so a wide
      // screen animates as smoothly as a phone.
      step = Math.max(3, Math.round(Math.sqrt((canvas.width * canvas.height) / 18000)));
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
            colour: "rgb(" + data[i] + "," + data[i + 1] + "," + data[i + 2] + ")",
          });
        }
      }
      dots.sort(() => Math.random() - 0.5);
    }

    function paint(progress) {
      const r = step * 0.72;
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
        ctx.arc(d.fromX + (d.x - d.fromX) * e, d.fromY + (d.y - d.fromY) * e, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function scatter() {
      const r = step * 0.72;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.85;
      for (let i = 0; i < dots.length; i++) {
        ctx.fillStyle = dots[i].colour;
        ctx.beginPath();
        ctx.arc(dots[i].fromX, dots[i].fromY, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // `force` is a click: an explicit request to see it, which outranks the
    // reduced motion preference that governs the automatic play.
    function run(force) {
      if (raf) cancelAnimationFrame(raf);
      if (still && !force) return paint(1);
      const started = performance.now();
      const duration = 3200;
      (function frame(now) {
        const progress = Math.min(1, (now - started) / duration);
        paint(progress);
        if (progress < 1) raf = requestAnimationFrame(frame);
      })(started);
    }

    img.onload = function () {
      build();
      if (still) {
        paint(1); // reduced motion: show the finished painting straight away
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
        }, 200);
      });
    };
    img.src = "{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}";
  })();
</script>
