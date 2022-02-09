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

let table1Data = window.generateTreeData(10, 5, "testseed");

let table1 = null;

$("#example1-btn").click(function() {
    if (table1 != null) {
        table1.destroy();
    }
    $(".example2").hide();

    let columns = [
        {
            formatter: "rowSelection",
            width: 20,
            hozAlign: "center",
            cssClass: "rowSelection",
            cellClick: function(e, cell) {
                cell.getRow().toggleSelect();
            },
            headerSort: false,
        },
        {
            title: "Label",
            field: "label",
            widthGrow: 2,
            headerSort: false,
            headerFilter: "input",
        },
        {
            title: "Color",
            field: "color",
            widthGrow: 2,
            headerSort: false,
            headerFilter: "input",
        },
        {
            title: "Fruit",
            field: "fruit",
            widthGrow: 2,
            headerSort: false,
            headerFilter: "input",
        },
        {
            title: "ID",
            field: "id",
            headerSort: false,
            headerFilter: "input",
            widthGrow: 0.5,
        },
    ];

    const options = {
        layout: "fitColumns",
        height: 550,
        tooltips: true,

        invalidOptionWarnings: false,

        selectable: "highlight",

        dataTree: true,
        dataTreeElementColumn: "label",
        dataTreeFilter: true,

        columns: columns,
        data: table1Data,
    };

    table1 = new Tabulator(document.getElementById("table1"), options);
});
