/* ⌘K palette — Cobalt's one interactive move.
 * Every destination here is also reachable by a plain link on the page;
 * the palette is a shortcut, never the only route.
 */

(function () {
    "use strict";

    var ITEMS = [
        { label: "About",   hint: "section", href: "#about" },
        { label: "Stack",   hint: "section", href: "#stack" },
        { label: "Work",    hint: "section", href: "#work" },
        { label: "Contact", hint: "section", href: "#contact" },
        { label: "Email Evans", hint: "mailto", href: "mailto:isholae4865@student.babcock.edu.ng" },
        { label: "GitHub",      hint: "external", href: "https://github.com/isholae4865-glitch" }
    ];

    var root    = document.getElementById("palette");
    var opener  = document.getElementById("palette-open");
    var input   = document.getElementById("palette-input");
    var list    = document.getElementById("palette-list");

    if (!root || !opener || !input || !list) { return; }

    var matches = ITEMS.slice();
    var cursor = 0;
    var lastFocused = null;

    function render() {
        list.textContent = "";

        if (!matches.length) {
            var empty = document.createElement("li");
            empty.className = "palette__empty";
            empty.textContent = "Nothing matches that.";
            list.appendChild(empty);
            return;
        }

        matches.forEach(function (item, i) {
            var li = document.createElement("li");
            var a = document.createElement("a");

            a.className = "palette__item";
            a.href = item.href;
            a.setAttribute("role", "option");
            a.setAttribute("aria-selected", i === cursor ? "true" : "false");
            if (item.hint === "external") { a.rel = "noopener noreferrer"; }

            a.appendChild(document.createTextNode(item.label));

            var hint = document.createElement("span");
            hint.className = "palette__hint";
            hint.textContent = item.hint;
            a.appendChild(hint);

            a.addEventListener("click", close);

            li.appendChild(a);
            list.appendChild(li);
        });
    }

    function filter(q) {
        var needle = q.trim().toLowerCase();
        matches = needle
            ? ITEMS.filter(function (i) { return i.label.toLowerCase().indexOf(needle) > -1; })
            : ITEMS.slice();
        cursor = 0;
        render();
    }

    function move(delta) {
        if (!matches.length) { return; }
        cursor = (cursor + delta + matches.length) % matches.length;
        render();
        var active = list.querySelector('[aria-selected="true"]');
        if (active) { active.scrollIntoView({ block: "nearest" }); }
    }

    function open() {
        lastFocused = document.activeElement;
        root.hidden = false;
        opener.setAttribute("aria-expanded", "true");
        input.value = "";
        filter("");
        input.focus();
    }

    function close() {
        root.hidden = true;
        opener.setAttribute("aria-expanded", "false");
        if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
    }

    opener.addEventListener("click", open);

    root.addEventListener("click", function (e) {
        if (e.target.hasAttribute("data-palette-close")) { close(); }
    });

    input.addEventListener("input", function () { filter(input.value); });

    document.addEventListener("keydown", function (e) {
        var isOpen = !root.hidden;

        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            isOpen ? close() : open();
            return;
        }

        if (!isOpen) { return; }

        if (e.key === "Escape")    { e.preventDefault(); close(); }
        if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
        if (e.key === "ArrowUp")   { e.preventDefault(); move(-1); }
        if (e.key === "Tab")       { e.preventDefault(); move(e.shiftKey ? -1 : 1); }

        if (e.key === "Enter" && matches.length) {
            e.preventDefault();
            var active = list.querySelector('[aria-selected="true"]');
            if (active) { active.click(); }
        }
    });
}());
