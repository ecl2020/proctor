const here = "here"


function getDensity(mass, moisture) {
    wetmass = mass - 4282
    moisture = 1+moisture/100
    drymass = wetmass/moisture
    drydensity = drymass/943
    return drydensity * 62.4
}


function writeIn() {
    // Create a new svg canvas
    let svg1 = d3.select("#svg1");
    // remove all lines
    d3.selectAll("path.line").remove()
    d3.selectAll(".point").remove()

    let data = []
    for (let step = 0; step < 5; step++) {
        let newmass = +document.getElementById(`mass-${step + 1}`).value
        let newmoisture = +document.getElementById(`moisture-${step + 1}`).value
        if (newmass != 0 && newmoisture != 0) {
            data.push({
                mass: newmass,
                moisture: newmoisture,
                density: getDensity(newmass, newmoisture)
            })
        }
    }

    // SORT DATA BY MOISTURE CONTENT

    // Compute the scales’ domains.
    let x = d3.scaleLinear()
        .domain([d3.min(data, d => d.moisture), d3.max(data, d => d.moisture)])
        .range([10, 180])

    let y = d3.scaleLinear()
        .domain([d3.min(data, d => d.density)
            , d3.max(data, d => d.density)])
        .range([180, 10])

    // Add the x Axis
    svg1.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg1.append("g")
        .call(d3.axisLeft(y));

    // Add the points!
    svg1.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4.5)
        .attr("cx", function (d) { return x(d.moisture); })
        .attr("cy", function (d) { return y(d.density); });

    let line = d3.line()
        .x(function (d) { return x(d.moisture); })
        .y(function (d) { return y(d.density); })
        .curve(d3.curveNatural);

    svg1.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("d", line) // 11. Calls the line generator 
        .attr("class", "line")
        .attr("id", "curve")
        .style("stroke", "black")
        .style("fill", "none")

    if (document.getElementById("curve").getTotalLength()) {
        let maxDensity = 100000000
        let omc = 0
        for (let step = x(d3.min(data, d => d.moisture)); step < x(d3.max(data, d => d.moisture)); step += 0.1) {
            // maxDensity.push(document.getElementById("curve").getPointAtLength(step), step)
            let temp = document.getElementById("curve").getPointAtLength(step)
            if (maxDensity >= temp.y) {
                maxDensity = temp.y
                omc = step
            }
            else {
                break
            }
        }
        // console.log("max density", y.invert(maxDensity))
        // console.log("optimum moisture content", x.invert(omc))
// this is actually getting kinda close maybe

        // console.log(document.getElementById("curve").getTotalLength(), d3.max(maxDensity, d => d.y))
        // console.log(maxDensity)
        // let omc = ({density: y.invert(d3.min(maxDensity, d => d.y)), omc: x.invert(d3.min(maxDensity, d => d.y))})
        // console.log(omc)
        // console.log("Maximum Density: ", y.invert(d3.min(maxDensity, d => d.y)))
        // console.log("OMC: ", x.invert(d3.min(maxDensity, d => d.y)))
    }

}
