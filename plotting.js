const here = "here"

function plot() {
    // Create a new svg canvas
    let svg1 = d3.select("#svg1");

    // Get the data
    d3.tsv("https://raw.githubusercontent.com/ecl2020/Proctor/master/example-data.txt?token=AIIDCJBQCE27XTZLZCV46LC7BITQK")
        .then(function (data) {
            // Coerce the data to numbers.
            data.forEach(function (d) {
                d.mass = +d.mass;
                d.moisture = +d.moisture;
            });

            let x = d3.scaleLinear()
                .range([10, 180]);

            let y = d3.scaleLinear()
                .range([180, 10]);

            // Compute the scales’ domains.
            x.domain(d3.extent(data, function (d) { return d.moisture; })).nice();
            y.domain(d3.extent(data, function (d) { return d.mass; })).nice();

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
                .attr("cy", function (d) { return y(d.mass); });

            let line = d3.line()
                .x(function (d) { return x(d.moisture); })
                .y(function (d) { return y(d.mass); })
                .curve(d3.curveNatural);

            svg1.append("path")
                .datum(data) // 10. Binds data to the line 
                .attr("d", line) // 11. Calls the line generator 
                .style("stroke", "black")
                .style("fill", "none")
        })
}

function writeIn() {
    // Create a new svg canvas
    let svg1 = d3.select("#svg1");

    let x = d3.scaleLinear()
        .range([10, 180]);

    let y = d3.scaleLinear()
        .range([180, 10]);

    let data = []
    for (let step = 0; step < 5; step++) {
        data[step] = {
            mass: document.getElementById(`mass-${step+1}`).value,
            moisture: document.getElementById(`moisture-${step+1}`).value
        }
    }
    console.log(data)

    // Compute the scales’ domains.
    x.domain(d3.extent(data, function (d) { return d.moisture; })).nice();
    y.domain(d3.extent(data, function (d) { return d.mass; })).nice();

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
        .attr("cy", function (d) { return y(d.mass); });

    let line = d3.line()
        .x(function (d) { return x(d.moisture); })
        .y(function (d) { return y(d.mass); })
        .curve(d3.curveNatural);

    svg1.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("d", line) // 11. Calls the line generator 
        .style("stroke", "black")
        .style("fill", "none")
    // })
    // })

}
