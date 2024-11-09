---
layout: page
permalink: /publications/
title: Publications
description: selected peer-reviewed publications in reversed chronological order. 
years: (2017..2024)
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">
{% bibliography -f journal -q !@unpublished %}
</div>

