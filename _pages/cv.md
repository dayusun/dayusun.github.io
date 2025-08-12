---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 2
cv_pdf: SunDayu_CV.pdf
description: My CV
---


{% if page.cv_pdf %}
  {% assign cv_url = page.cv_pdf | prepend: 'assets/pdf/' | relative_url %}
  <a href="{{ cv_url }}" target="_blank" rel="noopener noreferrer">
    <i class="fa-solid fa-file-pdf" style="font-size: 30px;"></i>
  </a>
{% endif %}


<object data= 
"{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url}}"
                width="800"
                height="900"> 
 </object> 