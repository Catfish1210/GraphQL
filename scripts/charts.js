const GRAPH = {w: 920, h: 690}
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function lineChart(data, container, graphID) {
    container.innerHTML = '';
    data.sort((a, b) => a.Time - b.Time);
    let cumulativeXP = 0;
    data = data.map(d => {
        cumulativeXP += d.XP;
        return {...d, cumulativeXP};
    });
    const width = GRAPH.w;
    const height = GRAPH.h;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Time)).nice()
        .range([marginLeft, width - marginRight]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cumulativeXP)]).nice()
        .range([height - marginBottom, marginTop]);
    const line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d.Time))
        .y(d => y(d.cumulativeXP));
    const svg = d3.create("svg")
        .attr("id", graphID)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    const path = svg.append("path")
        .datum(data)
        .attr("id", `${graphID}-path`)
        .attr("fill", "none")
        .attr("stroke", "#7b47f4")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    const length = path.node().getTotalLength();
    path.attr("stroke-dasharray", `0,${length}`)
        .transition()
        .duration(1200)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${length},${length}`);
    const glowColors = ["#7b47f4", "#7b47f4", "#7b47f4", "#7b47f4"];
    const glowWidths = [6, 4, 2, 1];
    glowColors.forEach((color, idx) => {
        const glowPath = svg.append("path")
            .datum(data)
            .attr("id", `${1}-glow-path-${idx}`)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", glowWidths[idx])
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 0)
            .attr("d", line);
        glowPath.attr("stroke-dasharray", `0,${length}`)
            .transition()
            .duration(1200)
            .ease(d3.easeLinear)
            .attr("stroke-opacity", 0.1)
            .attr("stroke-dasharray", `${length},${length}`);
    });
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - 4)
            .attr("y", -4)
            .attr("id", "graph-axis-title")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .text("Date"));
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("id", "graph-axis-title")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .style("fill", "white")
            .text("Total XP"));
    const tooltip = d3.select(container)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#161a1dcf")
        .style("border", "2px solid #9CA3AF")
        .style("border-radius", "0.25rem")
        .style("padding", "5px")
        .style("display", "none");
        svg.append("g")
        .attr("id", "data-point")
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.Time))
        .attr("cy", d => y(d.cumulativeXP))
        .attr("r", 5)
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(`<div class="graph-tt-name">${d.Name}</div>
                    <div class="graph-tt-date">${(d.TimeDisplay)}</div>
                    <div class="graph-tt-xp">↱${d.cumulativeXP} B</div>`);
        })
        .on("mousemove", function(event) {
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipX = event.pageX - tooltipWidth / 2;
            const tooltipY = event.pageY - 10;
            tooltip.style("top", `${tooltipY}px`)
                .style("left", `${tooltipX}px`);
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    return svg.node();
}

export function barChart(data, container, graphID) {
    container.innerHTML = '';
    const width = GRAPH.w;
    const height = GRAPH.h;
    const marginTop = 60;
    const marginRight = 30;
    const marginBottom = 120;
    const marginLeft = 120;
    const x = d3.scaleBand()
    .domain(d3.groupSort(data, ([d]) => -d.XP, (d) => d.Name))
    .range([marginLeft, width - marginRight])
    .padding(0.1);
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.XP)])
    .range([height - marginBottom, marginTop]);
    const svg = d3.create("svg")
    .attr("id", graphID)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
    const tooltip = d3.select(container)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#161a1dcf")
        .style("border", "2px solid #9CA3AF")
        .style("border-radius", "0.25rem")
        .style("padding", "5px")
        .style("justify-content", "right")
        .style("display", "none");
    const formatXP = val => {
        return ((val / 1000).toFixed(1)) % 1 === 0 ? (`${(val / 1000).toFixed(0)} kB`) : (`${(val / 1000).toFixed(1)} kB`);
    }
    svg.append("g")
    .attr("id", `graph-${graphID}-cont`)
    .selectAll()
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.Name))
    .attr("y", height - marginBottom)
    .attr("height", 0)
    .attr("width", x.bandwidth())
    .attr("data-y", (d) => y(d.XP))
    .attr("data-height", (d) => y(0) - y(d.XP))
    .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
            .html(`<div class="graph-tt-name">${d.Name}</div>
                <div class="graph-tt-xp">↑${formatXP(d.XP)}</div>
                <div class="graph-tt-date">${(d.TimeDisplay)}</div>`);
    })
    .on("mousemove", function(event) {
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipX = event.pageX - tooltipWidth / 2;
        const tooltipY = event.pageY - 10;
        tooltip.style("top", `${tooltipY}px`)
            .style("left", `${tooltipX}px`);
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
    })
    .transition()
    .duration(1000)
    .attr("y", (d) => y(d.XP))
    .attr("height", (d) => y(0) - y(d.XP));
    svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em");
    const yTickFormat = d => {
        if (d === 0) return "0 kB";
        return d3.format(".2s")(d) + "B";
    }
    svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickFormat(yTickFormat))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("id", "graph-axis-title")
        .attr("x", -30)
        .attr("y", marginTop - 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("XP"));

    return svg.node()
}