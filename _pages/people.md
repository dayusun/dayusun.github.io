---
layout: page
permalink: /people/
title: People
description: Doctoral students and collaborators.
nav: false
nav_order: 5
---

<style>
  h2.people-label {
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

  .people-pi {
    display: grid;
    border-top: 1px solid var(--global-divider-color);
    padding-top: 2rem;
    margin-top: 2.5rem;
    grid-template-columns: minmax(130px, 210px) 1fr;
    gap: 1.8rem;
    align-items: center;
    margin-bottom: 2.8rem;
  }

  .people-pi .people-name {
    font-size: 1.5rem;
    margin-top: 0;
  }

  .people-pi .people-role {
    font-size: 1.05rem;
  }

  .people-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
    align-items: start;
  }

  @media (min-width: 576px) {
    .people-grid {
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }
  }

  .people-pi figure,
  .people-grid figure {
    margin: 0;
  }

  .people-pi img,
  .people-grid img {
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

  .people-grid > div:hover img {
    transform: translateY(-4px);
    box-shadow:
      0 8px 16px #0000002e,
      0 4px 20px #00000024;
  }

  .people-name {
    font-size: 1.05rem;
    font-weight: 600;
    margin-top: 0.75rem;
  }

  .people-role {
    font-size: 0.95rem;
  }

  .people-note {
    font-size: 0.88rem;
    opacity: 0.7;
    margin-top: 0.3rem;
  }

  .people-collabs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1.1rem;
  }
</style>

The group develops statistical and data science methodology driven by real biomedical data. The methods are released as open-source R and MATLAB packages, listed on the [Software]({% link _pages/software.md %}) page.

The group goes by SUNDAY Lab, from Sun, Dayu.

{% assign pi = site.data.people.pi %}

<div class="people-pi">
  <div>{% include figure.liquid loading="eager" path="assets/img/prof_pic.png" class="img-fluid" sizes="(min-width: 576px) 210px, 40vw" alt=pi.name %}</div>
  <div>
    <div class="people-name">{{ pi.name }}</div>
    <div class="people-role">{{ pi.role }}</div>
    <div class="people-note">{{ pi.title }}</div>
  </div>
</div>

<h2 id="students" class="people-label">Students</h2>

<div class="people-grid">
  {% for m in site.data.people.members %}
  <div>
    {% assign member_image = m.image | prepend: 'assets/img/team/' %}
    {% include figure.liquid loading="lazy" path=member_image class="img-fluid" sizes="(min-width: 576px) 220px, 45vw" alt=m.name %}
    <div class="people-name">{{ m.name }}</div>
    <div class="people-role">{{ m.role }}, since {{ m.joined }}</div>
    {% if m.works_on %}<div class="people-note">{{ m.works_on }}</div>{% endif %}
    {% if m.cosupervisors %}
    <div class="people-note">
      With {% for c in m.cosupervisors %}<a href="{{ c.url }}">{{ c.name }}</a>{% unless forloop.last %} and {% endunless %}{% endfor %}
    </div>
    {% endif %}
  </div>
  {% endfor %}
</div>

{% if site.data.people.alumni.size > 0 %}

<h2 id="alumni" class="people-label">Alumni</h2>

{% for a in site.data.people.alumni %}- {{ a.name }}, {{ a.role }}, {{ a.years }}.{% if a.next %} Next: {{ a.next }}.{% endif %}
{% endfor %}
{% endif %}

{% if site.data.people.collaborators.size > 0 %}

<h2 id="collaborators" class="people-label">Collaborators</h2>

<div class="people-collabs">
  {% for c in site.data.people.collaborators %}
  <div>
    <div class="people-role"><a href="{{ c.url }}">{{ c.name }}</a></div>
    <div class="people-note">{{ c.affiliation }}</div>
  </div>
  {% endfor %}
</div>

{% endif %}
