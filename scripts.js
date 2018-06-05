document.addEventListener("DOMContentLoaded", () => setup());

function setup() {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then(res => res.json())
    .then(myJson => scatterplot(myJson));
}

function scatterplot(data) {
  const height = 600;
  const width = 1000;
  const padding = 50;

  const svg = d3
    .select("svg")
    .attr("height", height)
    .attr("width", width);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
    .range([padding, width - padding]);

  const timeParser = d3.timeParse("%M:%S");
  const timeFormatter = d3.timeFormat("%M:%S");
  data.forEach(d => {
    d.Time = timeParser(d.Time);
  });

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, d => d.Time))
    .range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormatter);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  // x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("text")
    .text("Year")
    .attr("transform", `translate(${width / 2}, ${height})`)
    .attr("dy", "-0.5em")
    .style("text-anchor", "middle")
    .style("font-size", "1.3em");

  // y-axis
  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .append("text")
    .text("Time")
    .attr("transform", "rotate(-90)")
    .attr("y", "0.7em")
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .style("font-size", "1.3em");

  // tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .text("a simple tooltip");

  // plotting data
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", d => yScale(d.Time))
    .attr("cx", d => xScale(d.Year))
    .attr("r", 8)
    .classed("dot", true)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time)
    .style("fill", d => {
      return d.Doping === "" ? "blue" : "orange";
    })
    .on("mouseover", d => {
      tooltip
        .style("visibility", "visible")
        .attr("data-year", d.Year)
        .style("top", d3.event.pageY - 30 + "px")
        .style("left", d3.event.pageX + 20 + "px").html(`
        <ul>
          <li>${d.Name} - ${d.Nationality}</li>
          <li>${timeFormatter(d.Time)}</li>
          <li>${d.Year}</li>
          <li>${d.Place} <small>(overall place)</small></li>
        </ul>
        `);
    })
    .on("mouseout", d => tooltip.style("visibility", "hidden"));

  // legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - padding - 200}, ${height / 2})`)
    .attr("id", "legend");

  const legendDoping = legend.append("g");
  legendDoping
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("x", "160")
    .attr("y", "-12")
    .attr("fill", "orange");
  legendDoping
    .append("text")
    .text("Doping Allegations")
    .attr("text-anchor", "start")
    .style("text-align", "right");

  const legendNoDoping = legend.append("g");
  legendNoDoping
    .append("text")
    .text("No Doping Allegations")
    .attr("dy", "2em");

  legendNoDoping
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("x", "160")
    .attr("y", "20")
    .attr("fill", "blue");
}
