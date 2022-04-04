// ==UserScript==
// @name         Google-Keep-Notes-Styler
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Editable script for manually styling Google Keep Notes with utility functions. Affects only the visibility of the notes and resets on page refresh.
// @author       ChiKleR
// @match        https://keep.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==


// Goal: pending|done.
// Automatically refresh each time a note is open: pending.


(async function() {
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

    if (elements_len < 4)
    {
      return false;
    }

    let note_idx = 0;

    if (elements_len <= (note_idx+2))
    {
      return alert_app_has_changed();
    }

    let has_exitted_note = false;
    (async function() {
      has_exitted_note = (document.querySelectorAll("[contenteditable=\"true\"]").length != 4);
      if (has_exitted_note) return;
      await sleep(200);
    })();

    while (elements_len > (note_idx+2))
    {
      if (note_idx == 0)
      {
        const note_title = elements[note_idx];
        try { // Note is possibly undefined (if it gets closed after the check).
          if (has_exitted_note || apply_to_note(note_title)) return false;
          if (has_exitted_note || apply_to_note_title(note_title)) return false;
        } catch (err) {
          console.warn(err);
        }
      }
      else
      if (note_idx == 1)
      {
        const note_body = elements[note_idx];
        try { // Note is possibly undefined (if it gets closed after the check).
          if (has_exitted_note || apply_to_note(note_body)) return false;
          if (has_exitted_note || apply_to_note_body(note_body)) return false;
        } catch (err) {
          console.warn(err);
        }
      }
      else
      {
        return alert_app_has_changed();
      }
      note_idx = (note_idx + 1) % 2;
    }
  }


  /**
   * Notes update loop (only affects open notes).
  **/
  while (true)
  {
    if (main()) break;
    await sleep(1000); // @TO-DO: Wait for changes instead of periodically updating.
  }


  /**
   * Must use ``await``.
  **/
  async function sleep(ms)
  {
    return (
      new Promise((resolve) => setTimeout(resolve, ms))
    );
  }


  function alert_app_has_changed()
  {
    return confirm(
      "Google-Keep-Notes-Styler says:\nSomething changed in the Google Keep Notes app since the creation of this script (it needs to be updated).\nClose the script?"
    );
  }

  // ↑↑↑ DEVELOPER ZONE ↑↑↑ //
})();
