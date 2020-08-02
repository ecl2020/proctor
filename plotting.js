const here = 'here'


// returns the maximum possible density at a given moisture content (moisture)
function getZavl(moisture) {
    // specific gravity [CUSTOM]
    let specGrav = 2.70;
    return 62.4 * specGrav / (moisture / 100 + 1);
}

// returns the dry density of a given wet mass (mass) at a given moisture (moisture)
function getDensity(mass, moisture) {
    // mass - weight of mold [CUSTOM]
    wetmass = mass - 4282;
    // changes moisture from % to decimal
    moisture = 1 + moisture / 100;
    drymass = wetmass / moisture;
    // drymass / volume of mold [CUSTOM]
    drydensity = drymass / 943;
    return drydensity * 62.4;
}

let built = false
function updatePlot() {
    // gets the data as an array
    let data = getData();
    // checks if an svg already exists
    var svg = d3.select('svg > g');
    if (svg.empty()) {
        // if an svg does not exist, a new one is appended to the plot div
        var svg = d3.select(plot).append('svg')
            .attr('class', 'plot')
            .attr('id', 'proctor svg')
            .attr('width', 500)
            .attr('height', 500);
    }
    // define x scale
    let x = d3.scaleLinear()
        // domain allows some space around the actual density/moisture line
        .domain([d3.min(data, d => d.moisture) - 3, d3.max(data, d => d.moisture) + 5])
        .range([40, 280]);
    // add x-axis
    let x_axis = d3.axisBottom()
        .scale(x);

    // define y scale
    let y = d3.scaleLinear()
        .domain([d3.min(data, d => d.density) - 5
            , d3.max(data, d => d.density) + 3])
        .range([260, 20]);
    // Add the y Axis
    let y_axis = d3.axisLeft()
        .scale(y);

    // if the axes have already been constructed 
    if (built) {
        d3.selectAll($('[class=xaxis]')) // change the x axis
            .transition()
            .duration(1000)
            .call(x_axis);
        d3.selectAll($('[class=yaxis]')) // change the y axis
            .transition()
            .duration(1000)
            .call(y_axis);
    }
    else {
        // build axes
        svg.append('g')
            .transition()
            .duration(10)
            .attr('class', 'xaxis')
            // move to the bottom of the plot
            .attr('transform', 'translate(0,260)')
            .call(x_axis);
        svg.append('g')
            .transition()
            .duration(10)
            .attr('class', 'yaxis')
            // move slightly inside the left edge of the plot
            .attr('transform', 'translate(40,0)')
            .call(y_axis);
        // confirm axes have been added to the plot
        built = !built
    }

    // select the svg canvas
    svg = d3.select('svg');
    // select some circles and join to the data
    let u = svg.selectAll('circle').filter('.all')
        .data(data);

    // add circles to the plot
    u.enter()
        .append('circle')
        .attr('class', 'all')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('r', 4.5)
        .attr('cx', function (d) { return x(d.moisture); })
        .attr('cy', function (d) { return y(d.density); });

    // define moisture-density curve
    let line = d3.line()
        .x(function (d) { return x(d.moisture); })
        .y(function (d) { return y(d.density); })
        .curve(d3.curveNatural);

    // define zero air void curve
    let zavLine = d3.line()
        .x(function (d) { return x(d.moisture); })
        .y(function (d) { return y(getZavl(d.moisture)) })
        .curve(d3.curveLinear);

    // update each of the lines on the plot with their curve and class
    updateLine(line, 'line', 'curve');
    updateLine(zavLine, 'zavl', 'zcurve');
    // let omc = svg.selectAll('circle').filter('omc')
    //     .data(getOptimum(document.getElementById('curve')));
    // console.log(x(getOptimum(document.getElementById('curve')).moisture))
    // console.log(y(getOptimum(document.getElementById('curve')).density))
    // omc.enter()
    //     .append('circle')
    //     .attr('class', 'omc')
    //     .merge(u)
    //     .transition()
    //     .duration(1000)
    //     .attr('r', 6.5)
    //     .attr('cx', getOptimum(document.getElementById('curve')).moisture)
    //     .attr('cy', getOptimum(document.getElementById('curve')).density);
}

function updateLine(line, lineClass, lineId) {
    // select the svg
    let svg = d3.select('svg');
    // search for the class to check if line has already been made
    if (svg.selectAll(`path.${lineClass}`).empty()) {
        // if not already made, append a line with the given class
        svg.append('path')
            .attr('class', lineClass)
            .attr('id', lineId);
    }

    // select the line with that class
    let w = svg.selectAll(`path.${lineClass}`);

    // transition the line/animate the line with new data
    w
        .transition()
        .duration(1000)
        .attrTween('d', function () {
            return d3.interpolatePath(d3.select(this).attr('d'), line(getData()))
        })
        .attr('stroke', 'black')
        .attr('fill', 'none');
}

function getData() {
    let localdata = [];
    for (let step = 0; step < 5; step++) {
        let newmass = +document.getElementById(`mass-${step + 1}`).value;
        let newmoisture = +document.getElementById(`moisture-${step + 1}`).value;
        if (newmass != 0) {
            localdata.push({
                mass: newmass,
                moisture: newmoisture,
                density: getDensity(newmass, newmoisture)
            })
        }
    }
    // SORT DATA BY MOISTURE CONTENT
    localdata.sort((a, b) => (a.moisture > b.moisture) ? 1 : -1);
    return localdata;
}

function getOptimum(path) {
    let error = 0.01;
    let maxIterations = 50;
    let n = 0;
    let x = 0;
    let y = 0;
    let mid = 0;
    let start = 0;
    let end = path.getTotalLength();
    while (n < maxIterations && end-start>error) {
        let mid = (start + end) / 2
        if (path.getPointAtLength(mid + error).y < path.getPointAtLength(mid).y &&
            path.getPointAtLength(mid - error).y < path.getPointAtLength(mid).y) {
            x = path.getPointAtLength(mid).x;
            y = path.getPointAtLength(mid).y;
        }
        else if (path.getPointAtLength(mid - error).y > path.getPointAtLength(mid).y) {
            end = mid;
        }
        else {
            start = mid;
        }
        n++;
    }
    if (x, y == 0) {
        return { density: path.getPointAtLength(mid).y, moisture: path.getPointAtLength(mid).x };
    }
    else {
        return { density: y, moisture: x };
    }
}

    // if (document.getElementById('curve') && document.getElementById('curve').getTotalLength()) {
    //     let maxDensity = 100000000
    //     let omc = 0
    //     for (let step = x(d3.min(data, d => d.moisture)); step < x(d3.max(data, d => d.moisture)); step += 0.1) {
    //         // maxDensity.push(document.getElementById('curve').getPointAtLength(step), step)
    //         let temp = document.getElementById('curve').getPointAtLength(step)
    //         if (maxDensity >= temp.y) {
    //             maxDensity = temp.y
    //             omc = step
    //         }
    //         else {
    //             break
    //         }
    //     }
    // console.log('max density', y.invert(maxDensity))
    // console.log('optimum moisture content', x.invert(omc))
    // this is actually getting kinda close maybe

    // console.log(document.getElementById('curve').getTotalLength(), d3.max(maxDensity, d => d.y))
    // console.log(maxDensity)
    // let omc = ({density: y.invert(d3.min(maxDensity, d => d.y)), omc: x.invert(d3.min(maxDensity, d => d.y))})
    // console.log(omc)
    // console.log('Maximum Density: ', y.invert(d3.min(maxDensity, d => d.y)))
    // console.log('OMC: ', x.invert(d3.min(maxDensity, d => d.y)))
    // }
