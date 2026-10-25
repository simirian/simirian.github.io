import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/*

The timeline should cover a range of dates, which can be learned from the first
and last listed date.

- Chapters have a start and an end, a title, a summary, and a link to the
  chapter's content.
- Arcs have a name and summary, and have values associated with their relevance
  over an interval.
- Events have a time when they happened, a title, a summary of what happend, and
  might have a link to where they happened in text.

*/
function buildTimeline(timeline) {
  const json = JSON.parse(timeline.innerText);

  const svg = d3.create("svg")
    .attr("width", 500)
    .attr("height", 500);

  svg.append("circle")
    .attr("cx", 250)
    .attr("cy", 250)
    .attr("r", 100)
    .attr("stroke", "#000")
    .attr("stroke-width", 5)
    .attr("fill", "#fff");

  const node = svg.node();
  timeline.parentElement.replaceChild(node, timeline);
}

window.addEventListener("load", _ => {
  const timelines = document.querySelectorAll(".timeline");
  for (const timeline of timelines)
    buildTimeline(timeline);
});
