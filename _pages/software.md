---
layout: page
permalink: /software/
title: Software
description: R packages and research software implementing methods from my papers.
nav: true
nav_order: 4
---

{% for sw in site.data.repositories.software %}

## {{ sw.name }}

{{ sw.description }}

{% if sw.links %}{% for link in sw.links %}{{ link.icon }} [**{{ link.label }}**]({{ link.url }}){% unless forloop.last %} · {% endunless %}{% endfor %}{% endif %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-stretch">
  {% include repository/repo.liquid repository=sw.repo %}
</div>

{% unless forloop.last %}

---

{% endunless %}
{% endfor %}
