
This is an example to illustrate possible solutions to filtering (and filtered selection) in Tabulator trees.

See this issue for initial discussions [https://github.com/olifolkerd/tabulator/issues/3020](https://github.com/olifolkerd/tabulator/issues/3020).

The examples using Tabulator 4.9 can be seen in [tree-tests-tabulator-4.9/tree-test-1.html](tree-tests-tabulator-4.9/tree-test-1.html).

The examples using Tabulator 5.1 can be seen in [tree-tests-tabulator-5.1/tree-test-1.html](tree-tests-tabulator-5.1/tree-test-1.html).

The examples using Tabulator 5.3 can be seen in [tree-tests-tabulator-5.3/tree-test-1.html](tree-tests-tabulator-5.3/tree-test-1.html).


- Clicking on "Example 1" shows the default Tabulator behaviour.
- Clicking on "Example 2" shows the behaviour with extensions.


This rely on custom functions defined in [tree-tests-tabulator-4.9/tabulator-custom-tree-extensions.js](tree-tests-tabulator-4.9/tabulator-custom-tree-extensions.js).

Some of those custom features include:
- Expand / Collapse the entire tree.
- Collapse the entire tree except the selected rows (and the rows leading to those rows).

In terms of filtering, the strategy is to filter the entire tree and allocate a flag to determine what to do when presenting the tree as a table. The values are as follows:
- `2` indicates that it's an actual match,
- `1` indicates that is an ancestor row leading to an actual match.

Those values can then be used for styling or global selection.

In "Example 2":
- Header filtering will apply to the entire tree, filtering out the rows that don't match, but leaving the ancestor rows visible to be able to see the matching rows.
- The non-matching ancestor rows are greyed out and not selectable.
- Using the header checkbox to "select all" will only select the rows matching the filters (not the intermediate ancestors, unless they're a direct match too).

Independently of filtering, there is also a "Go To Selection" feature, which will show and scroll to the selected rows (multiple clicks will move to the next rows in case multiple rows are selected).


The paths to the libraries used are defined in `default-config.js`, but these can be overridden in `local-config.js` and `local-config-THE_TEST_NAME_WITHOUT_HTML_EXTENSION.js` files placed next to it (mainly useful for local tests):

```javascript
// window.__LOCAL_CONFIG.CSS_HREF_MAP.tabulator = "";
// window.__LOCAL_CONFIG.JS_HREF_MAP.tabulator = "";
// window.__LOCAL_CONFIG.JS_BYPASS_CORB_MAP.tabulator = true; // If need to bypass CORB (bad idea to bypass in general).
```
