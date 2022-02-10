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

/*
This is indended to be a "double indexed" map (i.e. a map of maps).
The first key is the field name, the second is the row index.

Values should be:
 - 2: when it's an actual match for the row,
 - 1: when the row is an ancestor leading to an actual match.

Those values will be set in tableTreeCreateDeepMatchHeaderFilter.

This must then be reset in dataFiltering/dataFilter (see logic around "changed" flag).


When need to keep the rows with status 1 so that we can reach the actual matches in the tree.

Having a different value allows for:
- greying out (or styling differently) the parent rows that are not actual matches, for clarity;
- ignoring the non-matching ancestors when doing a global selection (see selectableCheck and header checkbox)


 */
let deepMatchHeaderFilterStatusMap = {};
function deepMatchHeaderFilterStatusMapGetter(fieldName, k) {
    return (deepMatchHeaderFilterStatusMap[fieldName] || {})[k];
}
function deepMatchHeaderFilterStatusMapSetter(fieldName, k, v) {
    let fieldMap = deepMatchHeaderFilterStatusMap[fieldName];
    if (fieldMap == null) {
        fieldMap = {};
        deepMatchHeaderFilterStatusMap[fieldName] = fieldMap;
    }
    fieldMap[k] = v;
}
function deepMatchHeaderFilterIsActualMatch(k) {
    // All fields must match to match the row.
    for (const fieldMap of Object.values(deepMatchHeaderFilterStatusMap)) {
        if (fieldMap[k] != 2) {
            return false;
        }
    }
    return true;
}

const deepMatchHeaderFilter = Tabulator.customExtensions.tableTreeCreateDeepMatchHeaderFilter(
    deepMatchHeaderFilterStatusMapGetter,
    deepMatchHeaderFilterStatusMapSetter,
    null,
    null,
    null
);

$("#example2-btn").click(function() {
    if (table1 != null) {
        table1.destroy();
    }
    $(".example2").show();

    deepMatchHeaderFilterStatusMap = {};

    let columns = [
        {
            formatter: "rowSelection",
            titleFormatter: Tabulator.customExtensions.treeHeaderFilteredRowSelectionFormatter,
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
            headerFilterFunc: deepMatchHeaderFilter,
        },
        {
            title: "Color",
            field: "color",
            widthGrow: 2,
            headerFilter: "input",
            headerFilterFunc: deepMatchHeaderFilter,
        },
        {
            title: "Fruit",
            field: "fruit",
            widthGrow: 2,
            headerFilter: "input",
            headerFilterFunc: deepMatchHeaderFilter,
        },
        {
            title: "ID",
            field: "id",
            headerFilter: "input",
            widthGrow: 0.5,
            headerFilterFunc: deepMatchHeaderFilter,
        },
    ];

    const options = {
        layout: "fitColumns",
        height: 550,

        selectable: "highlight",

        dataTree: true,
        dataTreeElementColumn: "label",
        dataTreeFilter: true,

        columnDefaults: {
            headerSort: false,
        },
        columns: columns,
        data: table1Data,

        selectableCheck: function(row) {
            // Note: this only applies when clicking rows when "selectable" is true or a number. It doesn't apply to the checkbox selection.
            // TODO investigate toggle working even when this returns false.
            // Here "row" is a RowComponent

            if (Object.keys(deepMatchHeaderFilterStatusMap).length) {
                let selectable = deepMatchHeaderFilterIsActualMatch(row.getIndex());
                return selectable;
            } else {
                return true;
            }
        },

        rowFormatter: function(row) {
            // Here "row" is a RowComponent

            let selectionDisabled = !deepMatchHeaderFilterIsActualMatch(row.getIndex());
            if (selectionDisabled) {
                row.getElement().classList.add("disabled");
            } else {
                row.getElement().classList.remove("disabled");
            }

            // We want to use the Row, not the RowComponent
            let actualRow = row._row;
            if (
                actualRow.modules &&
                actualRow.modules.select &&
                actualRow.modules.select.checkboxEl
            ) {
                actualRow.modules.select.checkboxEl.disabled = selectionDisabled;
            }
        },
    };

    table1 = new Tabulator(document.getElementById("table1"), options);

    table1.on("dataFiltering", function(filters) {
        const table = this;

        /*
         When dataTreeFilter is set to true (default), dataFiltering and dataFiltered
         will be called consecutively for each set of filtered child rows.

         Note that the pattern is:
         - dataFiltering, dataFiltered,
           dataFiltering, dataFiltered,
           ...,
           dataFiltering, dataFiltered
         NOT:
         - dataFiltering, dataFiltering, dataFiltering,
           ...,
           dataFiltered, dataFiltered, dataFiltered
         
         (So, it's hard to detect the initial filtering event,
          since table.modules.filter.changed is true all the way too)
         
         To work around this, we always set table.modules.filter.changed = false
         in the dataFiltered callback: at least the first dataFiltering event where it's
        true will be the first one of the tree.
        */

        if (table.modules.filter.changed) {
            /*
             When the filter is first changed, we expand everything first
             (and we'll filter within the tree afterwards).
            */
            Tabulator.customExtensions.tableTreeExpand(table, /*rows*/ null, /*refresh*/ false);

            deepMatchHeaderFilterStatusMap = {};
        }
    });

    table1.on("dataFiltered", function(filters, rows) {
        // Here "rows" is an array RowComponents
        const table = this;

        for (let row of rows) {
            row.reformat();
        }

        /*
         We clear the "changed" flag, otherwise it will still be considered
         a new changed for all the dataFiltering/dataFiltered calls for
         children in the tree.
         */
        table.modules.filter.changed = false;
    });

    table1.on("rowSelectionChanged", function(data, rows) {
        $("#example2-selected-ids").val(rows.map(x => x.getIndex()).join(","));
    });
});

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

$("#example2-select-ids").click(function() {
    let idsToSelect = $("#example2-selected-ids")
        .val()
        .split(",")
        .map(Number)
        .filter(x => !isNaN(x));

    table1.deselectRow();
    Tabulator.customExtensions.tableTreeSelectIds(table1, idsToSelect, true, true);
});
