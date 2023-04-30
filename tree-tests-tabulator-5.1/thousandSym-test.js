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

let columns = [
    {
        title: "Label",
        field: "label",
    },
    {
        title:
            'Money formatter (<span style="font-family:monospace;">thousand</span> is undefined)',
        field: "num1",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
            precision: 0,
        },
    },
    {
        title: 'Money formatter (<span style="font-family:monospace;">thousand: false</span>)',
        field: "num2",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
            thousand: false,
            precision: 0,
        },
    },
];

let table1Data = [
    { label: "A", num1: 1234, num2: 4321 },
    { label: "B", num1: 5678, num2: 8765 },
];

const options = {
    layout: "fitColumns",
    height: 550,

    selectable: "highlight",

    columnDefaults: {
        headerSort: false,
    },
    columns: columns,
    data: table1Data,
};

var table1 = new Tabulator(document.getElementById("table1"), options);
