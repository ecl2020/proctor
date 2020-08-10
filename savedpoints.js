function newRow(tbdy, content, cellclass, rowclass) {
    var row = tbdy.insertRow(-1)
    row.className = rowclass
    row.id = rowclass
    for (i = 0; i < content.length; i++) {
        var cell = row.insertCell(i)
        createCell(cell, content[i], cellclass)
    }
    // row.addEventListener('mouseenter', function{})
    // document.getElementById('table').rows[-1].cells.length;
    // document.getElementById('activities').className='selectedItem';
    // cell2.attr("class", "player-table")
}

function createCell(cell, content, newclass) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(content)  // create text node
    div.appendChild(txt)                     // append text node to the DIV
    div.setAttribute('class', newclass)      // set DIV class attribute
    div.setAttribute('contenteditable', 'true')
    // div.setAttribute('onfocusout', updataData())      // set DIV class attribute      
    cell.appendChild(div)                    // append DIV to the table cell
}

function updateTable(content, id) {
    let tbdy = document.getElementById(id).tBodies[0]
    newRow(tbdy, content, 'added-point cell', 'added-point row')
    // Sort by the contents of row 2 (moisture)
    sortBy(2, id)
}

// returns table with id "id" sorted by column number "column"
function sortBy(column, id) {
    var tbl, i, x, y;
    tbl = document.getElementById(id);
    var switching = true;

    // Run loop until no switching is needed 
    while (switching) {
        switching = false;
        var rows = tbl.rows;

        // Loop to go through all rows except header
        for (i = 1; i < (rows.length - 1); i++) {
            var Switch = false;
            // Fetch 2 elements that need to be compared 
            // the current td element
            x = rows[i].getElementsByTagName("TD")[column];
            // the next td element
            y = rows[i + 1].getElementsByTagName("TD")[column];
            if (parseInt(x.innerText) > parseInt(y.innerText)) {
                // If yes, mark Switch as needed and break loop 
                Switch = true;
                break;
            }
        }
        if (Switch) {
            // Function to switch rows and mark switch as completed 
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

            switching = true;
        }
    }
}