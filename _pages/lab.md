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
  .lab-painting {
    margin-top: 0.25rem;
  }

  #jatte {
    width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 0 2px 5px #00000029, 0 2px 10px #0000001f;
  }

  .lab-painting figcaption {
    font-size: 0.8rem;
  }


  .lab-photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }
</style>

<div class="row align-items-center">
  <div class="col-md-8">
    <p>SUNDAY Lab develops statistical and data science methodology driven by real biomedical data, in the Department of Biostatistics and Health Data Science at Indiana University School of Medicine. The methods are released as open-source R and MATLAB packages, listed on the <a href="{% link _pages/software.md %}">Software</a> page.</p>
    <p>The name is Sun, Dayu, run together. We do not meet on Sundays. The other Sunday is Seurat's.</p>
  </div>
  <div class="col-md-4">
    <div class="lab-painting">
      <figure>
        <canvas id="jatte" aria-label="Georges Seurat, A Sunday on La Grande Jatte, drawn dot by dot." role="img"></canvas>
        <noscript>
          <img src="{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" alt="Georges Seurat, A Sunday on La Grande Jatte.">
        </noscript>
        <figcaption class="caption">
          Georges Seurat, <em>A Sunday on La Grande Jatte</em>, <span style="white-space: nowrap">1884&ndash;86</span>. Art Institute of Chicago, public domain.
          <a href="#" id="jatte-replay" hidden>Paint it again</a>
        </figcaption>
      </figure>
    </div>
  </div>
</div>

## People

{% assign pi = site.data.lab.pi %}

<div class="row align-items-center mb-4">
  <div class="col-sm-3 mb-3">
    <div class="lab-photo">{% include figure.liquid loading="eager" path="assets/img/prof_pic.png" class="img-fluid z-depth-1 rounded" sizes="(min-width: 576px) 25vw, 95vw" alt=pi.name %}</div>
  </div>
  <div class="col-sm-9">
    <div style="font-size: 1.15rem; font-weight: 600">{{ pi.name }}</div>
    <div>{{ pi.role }}</div>
    <div style="opacity: 0.75">{{ pi.title }}</div>
  </div>
</div>

{% for m in site.data.lab.members %}

<hr>

<div class="row align-items-center mb-4">
  <div class="col-sm-3 mb-3">
    {% assign member_image = m.image | prepend: 'assets/img/team/' %}
    <div class="lab-photo">{% include figure.liquid loading="lazy" path=member_image class="img-fluid z-depth-1 rounded" sizes="(min-width: 576px) 25vw, 95vw" alt=m.name %}</div>
  </div>
  <div class="col-sm-9">
    <div style="font-size: 1.15rem; font-weight: 600">{{ m.name }}</div>
    <div>{{ m.role }}, since {{ m.joined }}</div>
    <div style="opacity: 0.75">Biostatistics and Health Data Science, IU School of Medicine</div>
    {% if m.works_on %}<div class="mt-2">{{ m.works_on }}</div>{% endif %}
    {% if m.cosupervisors %}<div style="opacity: 0.75">Co-supervised with {% for c in m.cosupervisors %}<a href="{{ c.url }}">{{ c.name }}</a>{% unless forloop.last %} and {% endunless %}{% endfor %}</div>{% endif %}
  </div>
</div>

{% endfor %}

{% if site.data.lab.alumni.size > 0 %}

## Alumni

{% for a in site.data.lab.alumni %}- {{ a.name }}, {{ a.role }}, {{ a.years }}.{% if a.next %} Next: {{ a.next }}.{% endif %}
{% endfor %}
{% endif %}

{% if site.data.lab.collaborators.size > 0 %}

## Collaborators

{% for c in site.data.lab.collaborators %}- [{{ c.name }}]({{ c.url }}), {{ c.affiliation }}
{% endfor %}
{% endif %}

<script>
  // The painting draws itself dot by dot, which is how Seurat made it.
  // Falls back to a single static paint when the visitor asks for reduced motion.
  (function () {
    const canvas = document.getElementById("jatte");
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const src = "{{ '/assets/img/la_grande_jatte.jpg' | relative_url }}";
    const img = new Image();
    let dots = [];
    let step = 6;
    let raf = null;

    function build() {
      const cssWidth = canvas.parentElement.clientWidth || 320;
      const ratio = img.height / img.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.height = Math.round(cssWidth * ratio) + "px";
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssWidth * ratio * dpr);

      const sample = document.createElement("canvas");
      sample.width = canvas.width;
      sample.height = canvas.height;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      sctx.drawImage(img, 0, 0, sample.width, sample.height);
      const data = sctx.getImageData(0, 0, sample.width, sample.height).data;

      step = Math.max(3, Math.round(2 * dpr));
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
          }, 600);
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
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          build();
          paint(1);
        }, 200);
      });
    };
    img.src = src;
  })();
</script>
