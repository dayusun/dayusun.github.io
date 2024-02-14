---
layout: page
permalink: /publications/
title: Publications
description: peer-reviewed publications in reversed chronological order. 
years: [2023,2022,2021,2020,2019,2018,2017]
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications">


{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f journal -q !@unpublished[year={{y}}]* %}
  
{% endfor %}

</div>
