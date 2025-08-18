---
layout: page
permalink: /publications/
title: Publications
description: selected peer-reviewed publications in reversed chronological order. 
years: (2017..2025)
nav: true
nav_order: 2
---

Please see [CV]({% link _pages/cv.md %}) for more detailed information on publications and working papers.


<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">
{% bibliography -f journal -q !@unpublished %}
</div>

