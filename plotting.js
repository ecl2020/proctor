function plot() {
    var svg1 = d3.select("#svg1");
    svg1.append("circle")
        .attr("cx", 100)
        .attr("cy", 100)
        .attr("r", 90)
        .attr("fill", "red");
    console.log(getData());
}

function getData() {
    d3.tsv("https://raw.githubusercontent.com/ecl2020/Proctor/master/example-data.txt?token=AIIDCJBQCE27XTZLZCV46LC7BITQK",
        function (data) {
            // console.log(data)
            return (data[0],data[1])
        })
}