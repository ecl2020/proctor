function plot() {
    var svg1 = d3.select("#svg1");
    svg1.append("circle")
        .attr("cx", 100)
        .attr("cy", 100)
        .attr("r", 90)
        .attr("fill", "red");
    getData();
}

function getData() {
    d3.tsv("C:\\Users\\Eric\\Documents\\personal-projects\\Proctor\\example-data.txt", function (data) {
        console.log(data)
    })
}