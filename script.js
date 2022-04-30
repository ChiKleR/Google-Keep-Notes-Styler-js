// ==UserScript==
// @name         Google-Keep-Notes-Styler-js
// @namespace    https://github.com/ChiKleR/
// @version      0.0.0
// @description  Editable JavaScript userscript for manually styling Google Keep Notes with helper and utility functions. This version affects only the visualization of the notes while the script is running (it doesn't change the actual content).
// @author       ChiKleR
// @match        https://keep.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==


// (Pending|Near|Done|Broken)- Goal.
// Pending- After a note is closed, wait for a note to load.
// Pending- After a note is closed, when a note loads, enter update loop.
// Pending- When a new note is being created, enter update loop.
// Done- Widen notes optionally.
  // Pending- Center widened notes.
  // Pending- Add a scroller for widened notes.


"use strict";


(async function() {
    "use strict";


    // ↓↓↓ USER ZONE ↓↓↓ //


    const check_spelling = false;

    const widen_notes = true;
    // 60em (monospace characters) is the average length of a code line.
    const wide_note_width = "60em";


    function apply_to_note_part_on_open(note_part, tags)
    {
      note_part.style.fontFamily = "Garamond, serif";

      const prev_font_size = window.getComputedStyle(note_part)["font-size"];
      // @TO-DO: use ``font-size-adjust`` or something similar (it's only supported in Firefox).
      note_part.style["font-size"] = `${(+prev_font_size.split("px")[0])+3}px`;


      note_part.spellcheck = check_spelling;
    }

    function apply_to_note_head_on_open(note_head, tags)
    {
      // Increase width of the note itself (disabled by default).
      if (widen_notes)
      {
        if (for_each_nested_parent_of_note_part(note_head, function(parent, parents_len, parents_idx)
        {
          parent.style.width = wide_note_width;

          parent.classList.add("nested_parent_of_note_part");

        })) return true;
      }

      // Add styles to the note head on open.
    }

    function apply_to_note_body_on_open(note_body, tags)
    {
      // example web-safe font cascade
      note_body.style.fontFamily = "Courier New, monospace";
      note_body.style.fontFamily = "Consolas, monospace";

      const prev_font_size = window.getComputedStyle(note_body)["font-size"];
      // @TO-DO: use ``font-size-adjust`` or something similar (it's only supported in Firefox).
      note_body.style["font-size"] = `${(+prev_font_size.split("px")[0])-2}px`;
    }

    function apply_to_note_part_on_update(note_part, tags)
    {
      // Add styles to the whole note on_update.
    }

    function apply_to_note_head_on_update(note_head, tags)
    {
      // Add styles to the note head on_update.
    }

    function apply_to_note_body_on_update(note_body, tags)
    {
      // Add styles to the note body on_update.
    }

    // ↑↑↑ USER ZONE ↑↑↑ //


    // ↓↓↓ USER HELPER FUNCTIONS ↓↓↓ //

    // Affects all the elements that make the note.
    // cb(parent, parents_len, parents_idx);
    function for_each_nested_parent_of_note_part(note_part, cb)
    {
      let parent = note_part;

      const parents_len = 5;
        let parents_idx = 0;

      while (parents_len > parents_idx)
      {
        if (parents_idx != 0) parent = parent.parentElement;

        if (parent.tagName.toLowerCase() == "div")
        {
          if (cb(
            parent,
            parents_len,
            parents_idx++
          )) break;
        }
        else
        {
          return alert_app_has_changed();
        }
      }

      return false;
    }


    function do_if_tag_found(tags, tag, cb)
    {
      alert("``do_if_tag_found`` is yet to be implemented!");
    }


    // @Unimplemented
    function for_each_snippet(note_part, cb)
    {
      const snippets = [];

      // use note_part.innerHTML.indexOf
        const text_index_begin = undefined;
        const text_index_close = undefined;
        const is_block = undefined;
        const name = undefined;
        const text = undefined;

      alert("``for_each_snippet`` is yet to be implemented!");

      const snippets_len = snippets.len;
        let snippets_idx = 0;

      while (snippets_len > snippets_idx)
      {
        const snippet = snippets[snippets_idx++];

        if (cb(snippet)) return true;
      }

      return false;
    }

    // ↑↑↑ USER HELPER FUNCTIONS ↑↑↑ //


    // ↓↓↓ DEVELOPER ZONE ↓↓↓ //

    async function main()
    {
      const note_parts = document.querySelectorAll("[contenteditable=\"true\"][spellcheck]");
      const note_parts_len = note_parts.length;

      if (note_parts_len == 0)
      {
        return false;
      }
      else
      if (note_parts_len != 2)
      {
        return alert_app_has_changed();
      }

      let note_part_idx = 0;


      // Even if a note is closed after being checked, the DOM element won't be
      // garbage-collected until all references to it are deleted. Thus, there is no
      // need to catch an undefined error, and we can simply exit in the next iteration.
      let has_exitted_note = false;

      (async function()
      {
        has_exitted_note = (document.querySelectorAll("[contenteditable=\"true\"][spellcheck]").length == 0);

        if (has_exitted_note)
        {
          return;
        }
        else
        {
          // @TO-DO: Wait for changes instead of on_update updating.
          await sleep(200);
        }
      })();


      const note_head = note_parts[0];
      const note_body = note_parts[1];

      const tags = [];

      if (apply_to_note_part_on_open(note_head, tags)) return true;
      if (apply_to_note_head_on_open(note_head, tags)) return true;

      if (apply_to_note_part_on_open(note_body, tags)) return true;
      if (apply_to_note_body_on_open(note_body, tags)) return true;

      while (true)
      {
        if (has_exitted_note) return false;

        const tags = [];

        if (apply_to_note_part_on_update(note_head, tags)) return true;
        if (apply_to_note_head_on_update(note_head, tags)) return true;

        if (apply_to_note_part_on_update(note_body, tags)) return true;
        if (apply_to_note_body_on_update(note_body, tags)) return true;

        await sleep(1000);
      }
    }


    // Notes update loop (only affects open notes).
    while (true)
    {
      if (await main()) break;
      await sleep(200); // @TO-DO: Wait for changes instead of on_update updating.
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
