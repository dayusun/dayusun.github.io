---
layout: page
permalink: /lab/
title: SUNDAY Lab
description: Sun, Dayu. Statistical methods for incomplete and high-dimensional biomedical data.
nav: false
nav_order: 3
---

<style>
  .lab-photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }
</style>

We work on data that is only partly seen. In observational studies and electronic health records, a covariate is measured whenever the patient happens to come in, an event is known only to have fallen between two visits, and a brain image arrives as a three-dimensional array rather than a tidy list of numbers. Standard methods either discard that structure or quietly assume the observation times can be ignored.

The lab builds estimators that keep the structure and stay honest about what was never observed: transformed hazards models with intermittently observed covariates, regression for panel counts and interval-censored survival times, and regression with tensor-valued predictors. The questions come from our collaborations in Alzheimer's disease, mental health, juvenile justice, criminology, critical care, and clinical trials.

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

{% for a in site.data.lab.alumni %}

- **{{ a.name }}.** {{ a.role }}, {{ a.years }}.{% if a.current %} Now {{ a.current }}.{% endif %}
  {% endfor %}
  {% endif %}

{% if site.data.lab.collaborators.size > 0 %}

## Collaborators

{% for c in site.data.lab.collaborators %}- [{{ c.name }}]({{ c.url }}), {{ c.affiliation }}
{% endfor %}
{% endif %}
