/*jslint node: true, eqnull: true, esversion: 6, browser: true */
/*global Tabulator: false, $: false, table1:true, table1Data:true */
/*
The MIT License (MIT)

Copyright (c) 2020-2022 Bruno Harbulot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";

let table1Data = window.generateTreeData(2, 2, "testseed");

let table1 = null;
const testMutator = x => x.toUpperCase();
const testAccessor = x => x.toLowerCase();

let columns = [
    {
        formatter: "rowSelection",
        width: 20,
        hozAlign: "center",
        cssClass: "rowSelection",
        cellClick: function(e, cell) {
            cell.getRow().toggleSelect();
        },
    },
    {
        title: "Label",
        field: "label",
        widthGrow: 2,
        headerFilter: "input",
    },
    {
        title: "Color",
        field: "color",
        widthGrow: 2,
        headerFilter: "input",
        // accessor: testAccessor,
        // mutator: testMutator,
    },
    {
        title: "Fruit",
        field: "fruit",
        widthGrow: 2,
        headerFilter: "input",
    },
    {
        title: "ID",
        field: "id",
        headerFilter: "input",
        widthGrow: 0.5,
    },
];

const options = {
    layout: "fitColumns",
    height: 350,

    selectable: "highlight",

    dataTree: true,
    dataTreeElementColumn: "label",
    dataTreeStartExpanded: true,
    dataTreeFilter: true,

    columnDefaults: {
        headerSort: false,
    },
    columns: columns,
    data: table1Data,
    debugEventsInternal: ["row-data-retrieve"],
};

$("#output1").text(JSON.stringify(table1Data, null, 4));

table1 = new Tabulator(document.getElementById("table1"), options);

$(".example2").show();

$("#example2-expand-all").click(function() {
    Tabulator.customExtensions.tableTreeExpand(
        table1,
        /*rows*/ null,
        /*refresh*/ true,
        /*reformat*/ true
    );
});
$("#example2-collapse-all").click(function() {
    Tabulator.customExtensions.tableTreeCollapse(
        table1,
        /*rows*/ null,
        /*unlessSelected*/ false,
        /*refresh*/ true,
        /*reformat*/ true
    );
});
$("#example2-collapse-all-but-selected").click(function() {
    Tabulator.customExtensions.tableTreeCollapse(
        table1,
        /*rows*/ null,
        /*unlessSelected*/ true,
        /*refresh*/ true,
        /*reformat*/ true
    );
});
$("#example2-clear-selection").click(function() {
    table1.deselectRow();
});

let multiSelectionGoToIndex = 0;
$("#example2-go-to-selection").click(function() {
    let selection = table1.getSelectedRows();
    if (selection.length) {
        if (multiSelectionGoToIndex >= selection.length) {
            multiSelectionGoToIndex = 0;
        }
        let gotoItem = selection[multiSelectionGoToIndex];
        if (gotoItem.getIndex()) {
            Tabulator.customExtensions.tableTreeScrollToRow(
                table1,
                gotoItem.getIndex(),
                null,
                false
            );
        }
        multiSelectionGoToIndex++;
    }
});

table1.on("rowClick", function(e, row) {
    window.testRow1 = row;
    window.table1 = table1;
    // console.log("row.getPosition(true) ", row.getPosition(true));
    // let displayRowsIdx = row
    //     .getTable()
    //     .rowManager.getDisplayRows()
    //     .indexOf(row._row);
    // console.log("row.getTable().rowManager.getDisplayRows().indexOf(row)", displayRowsIdx);
});

$("#example2-dump-data").click(function() {
    $("#output1").text(JSON.stringify(table1Data, null, 4));
    $("#output2").text(JSON.stringify(table1.getData(), null, 4));

    window.table1Data = table1Data;
    window.table1DataBis = table1.getData();
});
