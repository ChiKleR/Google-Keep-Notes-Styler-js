// ==UserScript==
// @name         Google Keep Notes Styler
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Editable script for styling Google Keep Notes. Changes the current note's font to monospace by default (resets on page refresh).
// @author       ChiKleR
// @match        https://keep.google.com/#NOTE/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==


// Goal: pending|done.
// Automatically refresh each time a note is open: pending.


(function() {
  "use strict";


  // ↓↓↓ USER ZONE ↓↓↓ //

  function apply_to_note(note)
  {
    // you can even apply filters depending on tags! (although manually for this version)


    note.style.fontFamily = "Garamond, serif";

    const prev_font_size = window.getComputedStyle(note)["font-size"];
    note.style["font-size"] = `${(+prev_font_size.split("px")[0])+3}px`; // @TO-DO: use ``font-size-adjust`` or something similar (it's only supported in Firefox)


    // return ``false`` to skip.
    // return ``true`` to break.
    return false;
  }

  function apply_to_note_title(note_title)
  {
    // add styles to note_title


    return false;
  }

  function apply_to_note_body(note_body)
  {
    // example web-safe font cascade
    note_body.style.fontFamily = "Courier New, monospace";
    note_body.style.fontFamily = "Consolas, monospace";

    const prev_font_size = window.getComputedStyle(note_body)["font-size"];
    note_body.style["font-size"] = `${(+prev_font_size.split("px")[0])-2}px`; // @TO-DO: use ``font-size-adjust`` or something similar (it's only supported in Firefox)


    return true;
  }

  // ↑↑↑ USER ZONE ↑↑↑ //


  // ↓↓↓ USER HELPER FUNCTIONS ↓↓↓ //

  function do_if_tag_found(tag, cb)
  {
    alert("``do_if_tag_found`` is yet to be implemented!");
  }


  function for_each_snippet(note, cb) // @Unimplemented
  {
    const snippets = [];

    alert("``for_each_snippet`` is yet to be implemented!");

    const snippets_len = snippets.len;
      let snippets_idx = 0;

    while (snippets_idx < snippets_len)
    {
      const block = false;
      const name = undefined;
      const text = `${""}`;

      cb({ block, name, text });

      ++snippets_idx;
    }
  }

  function snippet_to_monospace(note, snippet) // @Unimplemented
  {
    if (snippet.block)
    {
      note.innerHTML.indexOf(`\`\`\`${snippet.name}\n${snippet.text}\n\`\`\``);
    }
    else
    {
      note.innerHTML.indexOf(`\`\`${snippet.text}\`\``);
    }
  }

  // ↑↑↑ USER HELPER FUNCTIONS ↑↑↑ //


  // ↓↓↓ DEVELOPER ZONE ↓↓↓ //

  function main()
  {
    const elements = document.querySelectorAll("[contenteditable=\"true\"]");
    const elements_len = elements.length;
        let elements_idx = 2;

    if (elements_idx < elements_len)
    {
        while (elements_idx < elements_len)
        {
        if (elements_idx == 2)
        {
            const note_title = elements[elements_idx];

            if (apply_to_note(note_title)) break;

            if (apply_to_note_title(note_title)) break;
        }
        else
        if (elements_idx == 3)
        {
            const note_body = elements[elements_idx];

            if (apply_to_note(note_body)) break;

            if (apply_to_note_body(note_body)) break;
        }
        else
        {
            alert_app_has_changed();
            break;
        }
        ++elements_idx;
        }
    }
    else
    {
        alert_app_has_changed();
    }
  }


  function alert_app_has_changed()
  {
    alert("Something changed in the Google Keep Notes app since the creation of this script (it needs to be updated).");
  }

  // ↑↑↑ DEVELOPER ZONE ↑↑↑ //


  main();
})();
