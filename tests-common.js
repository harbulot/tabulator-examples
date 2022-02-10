/*jslint node: true, eqnull: true, esversion: 6, browser: true */
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

(function() {
    const scriptContainerElem = document.getElementsByTagName("body")[0];

    window.generateTreeData = function(maxLevelBreadth, maxDepth, seed, indexKey, childrenKey) {
        if (indexKey == null) {
            indexKey = "id";
        }
        if (childrenKey == null) {
            childrenKey = "_children";
        }

        const rng = new Math.seedrandom(seed);
        const COLOURS = window.__LOCAL_CONFIG.COLOURS || ["red", "blue", "green", "yellow"];
        const FRUITS = window.__LOCAL_CONFIG.FRUITS || ["apple", "banana", "pears"];

        let uniqueId = 1;
        function generateNode(depth, parent, arrIdx) {
            const dataNode = {};
            dataNode[indexKey] = uniqueId++;
            // dataNode.parent = parent; // This causes problems when accessing the row data (deep clone / max stack size error...)
            dataNode.color = COLOURS[Math.trunc(rng() * COLOURS.length)];
            dataNode.fruit = FRUITS[Math.trunc(rng() * FRUITS.length)];

            let label;
            if (depth % 2 === 1) {
                label = generateIndexLabel(arrIdx + 1);
            } else {
                label = (arrIdx + 1).toString();
            }
            if (parent) {
                dataNode.label = parent.label + "." + label;
            } else {
                dataNode.label = "Item " + label;
            }

            if (depth < maxDepth) {
                const childrenArr = [];
                const childrenCount = Math.trunc(rng() * maxLevelBreadth);
                for (let i = 0; i < childrenCount; i++) {
                    const childDataNode = generateNode(depth + 1, dataNode, i);
                    childrenArr.push(childDataNode);
                }

                if (childrenCount) {
                    // In Tabulator 4.9 (at least), an empty array still shows the expand symbol.
                    dataNode[childrenKey] = childrenArr;
                }
            }

            return dataNode;
        }

        const firstLevelArr = [];
        for (let i = 0; i < maxLevelBreadth; i++) {
            firstLevelArr.push(generateNode(0, null, i));
        }

        return firstLevelArr;
    };

    function generateIndexLabel(value) {
        const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        let output = "";
        while (value > 0) {
            let quotient = Math.floor((value - 1) / 26);
            let remainder = (value - 1) % 26;
            output = LETTERS[remainder] + output;
            value = quotient;
        }

        return output;
    }

    function generateNextLoader(dataToLoadArr) {
        return function() {
            const [head, ...tail] = dataToLoadArr;
            if (!head) {
                return;
            }

            if (typeof head === "function") {
                return head();
            }

            const callback = generateNextLoader(tail);

            if (head.type === "js" && head.bypassCorb) {
                // Note: this is an ugly way to bypass CORB restrictions. It's generally not a good idea to bypass them.
                let elem = document.createElement("script");
                elem.type = "text/javascript";
                scriptContainerElem.appendChild(elem);

                let req = new XMLHttpRequest();
                req.responseType = "text";
                req.addEventListener("load", function() {
                    if (req.readyState === req.DONE && req.status === 200) {
                        elem.textContent = req.responseText;
                    }

                    callback();
                });
                req.addEventListener("error", callback);

                req.open("GET", head.href);
                req.send();
            } else {
                let elem;
                switch (head.type) {
                    case "css":
                        elem = document.createElement("link");
                        elem.rel = "stylesheet";
                        elem.type = "text/css";
                        elem.href = head.href;
                        break;
                    case "js":
                        elem = document.createElement("script");
                        elem.type = "text/javascript";
                        elem.src = head.href;
                        break;
                }
                elem.addEventListener("load", callback);
                elem.addEventListener("error", callback);
                scriptContainerElem.appendChild(elem);
            }
        };
    }

    const firstChainedLoader = function() {
        const DATA_TO_LOAD_ARR = [];
        for (const cssHref of Object.values(window.__LOCAL_CONFIG.CSS_HREF_MAP)) {
            DATA_TO_LOAD_ARR.push({ type: "css", href: cssHref });
        }
        for (const [jsKey, jsHref] of Object.entries(window.__LOCAL_CONFIG.JS_HREF_MAP)) {
            const bypassCorb = !!(window.__LOCAL_CONFIG.JS_BYPASS_CORB_MAP || {})[jsKey];
            DATA_TO_LOAD_ARR.push({ type: "js", href: jsHref, bypassCorb: !!bypassCorb });
        }
        for (const jsHref of window.__LOCAL_CONFIG.PAGE_SCRIPTS || []) {
            DATA_TO_LOAD_ARR.push({ type: "js", href: jsHref });
        }
        generateNextLoader(DATA_TO_LOAD_ARR)();
    };

    const currentFilename = window.location.pathname
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "");
    const CONFIG_SCRIPTS_ARR = [
        { type: "js", href: "default-config.js" },
        { type: "js", href: "local-config.js" },
        { type: "js", href: "default-config-" + currentFilename + ".js" },
        { type: "js", href: "local-config-" + currentFilename + ".js" },
        firstChainedLoader,
    ];
    generateNextLoader(CONFIG_SCRIPTS_ARR)();
})();
