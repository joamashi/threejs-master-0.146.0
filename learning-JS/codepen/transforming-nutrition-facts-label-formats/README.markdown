# Transforming Nutrition Facts Label Formats

A Pen created on CodePen.io. Original URL: [https://codepen.io/robdimarzo/pen/MQdoOZ](https://codepen.io/robdimarzo/pen/MQdoOZ).

US Nutrition Facts come in a variety of aspect ratios to fit different container sizes. I noticed most of the actual content is consistent across the variations (+- a few labels). The big difference is the layout. CSS to the rescue?

With that in mind, I've written one source of semantic HTML (a whole lot of DLs seem appropriate) that gets presented at different sizes via CSS. Flexbox is doing the heavy lifting, but I am also using CSS Grid for the main outer structure. For the small label, I am using display: contents (new) to allow all the content to flow freely of their containers. Due to this, it may not display correctly on older browsers.

Source: https://www.fda.gov/downloads/Food/GuidanceRegulation/GuidanceDocumentsRegulatoryInformation/LabelingNutrition/UCM511964.pdf


