/*jslint node: true, eqnull: true, esversion: 6, browser: true */
/*global Tabulator: false, $: false */
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

const columns = [
    {
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        width: 20,
        hozAlign: "center",
        headerHozAlign: "center",
        cssClass: "rowSelection",
        cellClick: function(e, cell) {
            cell.getRow().toggleSelect();
        },
    },
    {
        title: "ID",
        field: "id",
    },
    {
        title: "Label",
        field: "label",
    },
];

const tableData = [];
for (let i = 1; i <= 30; i++) {
    tableData.push({ id: i, label: "Item " + i });
}

const options = {
    layout: "fitColumns",
    height: 300,
    selectable: "highlight",
    columnDefaults: {
        headerSort: false,
    },
    columns: columns,
    data: tableData,
};

const options1 = $.extend({}, options, { selectable: "highlight" });
const options2 = $.extend({}, options, { selectable: true });
const options3 = $.extend({}, options, { selectable: 1 });
const options4 = $.extend({}, options, { selectable: "highlight", selectableMaxRows: 1 });

let table1 = new Tabulator(document.getElementById("table1"), options1);
let table2 = new Tabulator(document.getElementById("table2"), options2);
let table3 = new Tabulator(document.getElementById("table3"), options3);
let table4 = new Tabulator(document.getElementById("table4"), options4);
