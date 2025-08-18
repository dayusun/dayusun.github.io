---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 2
cv_pdf: SunDayu_CV.pdf
---


{% if page.cv_pdf %}
  {% assign cv_url = page.cv_pdf | prepend: 'assets/pdf/' | relative_url %}
  Download the CV here:
  <a href="{{ cv_url }}" target="_blank" rel="noopener noreferrer">
    <i class="fa-solid fa-file-pdf" style="font-size: 30px;"></i>
  </a>
{% endif %}

<style>
  .cv-embed {
  /* Make it take the full width of its container */
  width: 100%;
  
  /* Set a height relative to the screen's height */
  height: 85vh; /* This means 85% of the viewport's height */
  
  /* Optional: Add a border for better visual separation */
  border: 1px solid #ddd;
}
</style>


<object class="cv-embed" data="{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url }}" type="application/pdf"> 
  <p>Your browser cannot display the PDF. 
    <a href="{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url }}">Download the CV instead</a>.
  </p>
</object>