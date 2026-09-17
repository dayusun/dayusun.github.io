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
    float: right;
    width: 320px;
    margin: 0.4rem 0 1rem 1.5rem;
  }

  .lab-painting figcaption {
    font-size: 0.8rem;
  }

  @media (max-width: 700px) {
    .lab-painting {
      float: none;
      width: 100%;
      margin: 1rem 0 1.5rem;
    }
  }

  .lab-photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }
</style>

SUNDAY Lab develops statistical and data science methodology driven by real biomedical data, in the Department of Biostatistics and Health Data Science at Indiana University School of Medicine. Methods leave here as working code.

<div class="lab-painting">
{% include figure.liquid loading="eager" path="assets/img/la_grande_jatte.jpg" class="img-fluid rounded z-depth-1" alt="Georges Seurat, A Sunday on La Grande Jatte, a pointillist park scene built from thousands of separate dots of colour." caption="Georges Seurat, <em>A Sunday on La Grande Jatte</em>, <span style='white-space: nowrap'>1884&ndash;86</span>. Art Institute of Chicago, public domain." %}
</div>

The name is Sun, Dayu, run together. We do not meet on Sundays. The other Sunday is Seurat's.

<div class="clearfix"></div>

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
