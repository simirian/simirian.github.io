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
function buildTimeline(timeline, width, height) {
  const json = JSON.parse(timeline.innerText);
  // grab the first & last date in eras/events
  const xmin = Math.min(...json.events.map(e => e.date), ...json.eras.map(e => e.start));
  const xmax = Math.max(...json.events.map(e => e.date), ...json.eras.map(e => e.end));
  width = width || 500;
  height = height || 200;

  // make smaller eras appear later so they are clickable over larger eras
  json.eras.sort((a, b) => (b.end - b.start) - (a.end - a.start));

  const colors = {}
  for (let i = 0; i < json.themes.length; ++i) {
    // rotate by the golden ratio every time for maximally different colors :)
    colors[json.themes[i]] = d3.hsl(360 * 0.61803 * i, 0.5, 0.5);
  }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear([xmin, xmax], [10, width - 10]);
  const y = d3.scaleLinear([-1, 1], [10, height - 10]);

  for (let i = 0; i < json.eras.length; ++i) {
    const era = json.eras[i];
    const link = svg.append("a").attr("href", era.link);
    const color = d3.hsl(360 * 0.61803 * (i + 0.2695), 0.5, 0.5);
    color.opacity = 0.1;
    link.append("rect")
      .attr("x", x(era.start))
      .attr("y", y(-1))
      .attr("width", x(era.end) - x(era.start))
      .attr("height", y(1))
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", color);
  }

  svg.append("g")
    .attr("transform", "translate(0, " + height / 2 + ")")
    .call(d3.axisBottom(x).ticks(width / 40, ",f"));

  for (const event of json.events) {
    const link = svg.append("a").attr("href", event.link);
    link.append("circle")
      .attr("cx", x(event.date))
      .attr("cy", y(0))
      .attr("r", 5)
      .attr("fill", colors[event.theme] || "white")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }

  const plotMax = Math.max(...json.plot.data);
  const py = d3.scaleLinear([0, plotMax], [height / 2, 10]);
  const area = d3.area(v => x(v.date), py(0), v => py(v.value));
  const plotStart = json.plot.start || 0;
  const plotEnd = json.plot.end || xmax;
  const interval = (plotEnd - plotStart) / (json.plot.data.length - 1);
  const data = [];
  for (let i = 0; i < json.plot.data.length; ++i)
    data.push({ "date": plotStart + interval * i, value: json.plot.data[i] });
  svg.append("path").attr("d", area(data)).attr("fill", "#ffffff20");
  console.log(interval, data);

  const node = svg.node();
  timeline.parentElement.replaceChild(node, timeline);
}

window.addEventListener("load", _ => {
  const timelines = document.querySelectorAll(".timeline");
  for (const timeline of timelines) {
    const parent = timeline.parentElement;
    buildTimeline(timeline, parent.offsetWidth);
  }
});
