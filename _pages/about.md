---
layout: about
title: About
description: Assistant Professor of Biostatistics and Health Data Science at Indiana University School of Medicine. Survival, longitudinal, tensor and causal methods.
permalink: /
subtitle: >
  <p><span class="about-name">孙达宇/孫達宇</span></p>

profile:
  align: right
  image: prof_pic.png
  image_circular: false # crops the image to make it circular
  more_info: >
    <p><i class="fa fa-envelope" aria-hidden="true"></i> dayu.sun [at] outlook.com </p>
    <p><i class="fa fa-envelope" aria-hidden="true"></i> dayusun [at] iu.edu </p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

I am an Assistant Professor in the [Department of Biostatistics and Health Data Science](https://medicine.iu.edu/biostatistics) at Indiana University School of Medicine and the Richard M. Fairbanks School of Public Health, and an Affiliated Scientist at the [Regenstrief Institute](https://www.regenstrief.org/).

I develop statistical methods for addressing challenges from complex data:

- **[Tensor](https://en.wikipedia.org/wiki/Tensor) data analysis for neuroimaging.** Keeping an image's multidimensional structure instead of flattening it into a long vector.
- **Intermittently observed longitudinal and time-to-event data in observational studies and electronic health records.** Covariates recorded only at irregular clinic visits, and outcomes never observed exactly, including interval-censored survival times and panel counts.
- **Collaboration in Alzheimer's disease, mental health, juvenile justice, criminology, critical care, and clinical trials.** These applications are where my methodological questions come from.
- **Emerging directions.** Economic and financial data, and AI tools for method development and health data science.

<div class="research-figures">
  <figure class="fig-block">
    <div class="fig-stage" id="fig-brain" role="img" aria-label="The 333 Gordon parcels at their real coordinates inside the real ICBM152 brain surface, joined by the estimated connectivity pattern. The model turns slowly and can be dragged."></div>
    <figcaption class="fig-title">
      Brain functional connectivity
      <a class="fig-link" href="https://github.com/dayusun/brainconnvis" target="_blank" rel="noopener">brainconnvis</a>
    </figcaption>
  </figure>
  <figure class="fig-block">
    <div class="fig-stage" id="fig-dyn" role="img" aria-label="Two linked panels for one patient. A biomarker measured at eight visits, the predicted survival curve drawn forward from a landmark, and the predicted event-time density. All three update each time a measurement arrives, with earlier forecasts left behind as faint traces."></div>
    <figcaption class="fig-title">Dynamic prediction with longitudinal covariates</figcaption>
  </figure>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu" crossorigin="anonymous"></script>
<script defer src="{{ '/assets/js/research-brain-data.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script defer src="{{ '/assets/js/research-figures.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

<!---
My [GitHub](https://github.com/dayusun) hosts implementations of these methods along with general computational tools; selected packages are described on my [Software](/software/) page.
--->

Before joining IU, I was a postdoctoral fellow at Emory University with [Dr. Amita Manatunga](https://sph.emory.edu/faculty/profile/index.php?FID=amita-manatunga-36), [Dr. Limin Peng](https://sph.emory.edu/faculty/profile/index.php?FID=limin-peng-338), and [Dr. Ying Guo](https://www.yingguo.us/). I earned my Ph.D. in statistics at the University of Missouri with [Dr. Jianguo (Tony) Sun](https://sunj.mufaculty.umsystem.edu/), and an [M.Phil.](https://en.wikipedia.org/wiki/Master_of_Philosophy) and B.Sc. at The Hong Kong Polytechnic University with [Dr. Xingqiu Zhao](https://www.polyu.edu.hk/ama/people/academic-staff/prof-zhao-xingqiu/) and [Dr. Zhisheng Ye](https://cde.nus.edu.sg/isem/staff/ye-zhisheng/).
