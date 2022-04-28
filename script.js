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


// (Pending|Near|Done|Broken)- Goal.
// Pending- After a note is closed, wait for a note to load.
// Pending- After a note is closed, when a note loads, enter update loop.
// Pending- When a new note is being created, enter update loop.
// Done- Widen notes optionally.
  // Pending- Center widened notes.
  // Pending- Add a scroller for widened notes.
// Done- Fix a bug where when an unexpected warning or error is thrown, since the Try-Catch statements return false, it triggers on_open indefinetly.


(async function() {
    "use strict";


    // ↓↓↓ USER ZONE ↓↓↓ //


    const widen_notes = true;


    function apply_to_note_part_on_open(note_part, tags)
    {
      note_part.style.fontFamily = "Garamond, serif";

      const prev_font_size = window.getComputedStyle(note_part)["font-size"];
      // @TO-DO: use ``font-size-adjust`` or something similar (it's only supported in Firefox).
      note_part.style["font-size"] = `${(+prev_font_size.split("px")[0])+3}px`;
    }

    function apply_to_note_head_on_open(note_head, tags)
    {
      // Increase width of the note itself (disabled by default).
      if (widen_notes)
      {
        let success = true;


        for_each_nested_parent_of_note_part(note_head, function(parents, parents_len, parents_idx)
        {
          const parent = parents[parents_idx];

          if (parent.tagName.toLowerCase() != "div")
          {
            if (parents_idx < 5)
            {
              success = false;

              return true;
            }
            else
            {
              return false;
            }
          }

          // 60 characters is the average length of a code line.
          parent.style.width = "60em";

          if (parents_idx == 4) return true; // break
        });

        if (!success) return true;
      }
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

    function apply_to_note_part_periodically(note_part, tags)
    {
      // Add styles to the whole note periodically.
    }

    function apply_to_note_head_periodically(note_head, tags)
    {
      // Add styles to the note head periodically.
    }

    function apply_to_note_body_periodically(note_body, tags)
    {
      // Add styles to the note body periodically.
    }

    // ↑↑↑ USER ZONE ↑↑↑ //


    // ↓↓↓ USER HELPER FUNCTIONS ↓↓↓ //

    function for_each_nested_parent_of_note_part(note_part, cb)
    {
      let parents = [];

      for (let parents_idx = 0; parents_idx < 5; parents_idx++)
      {
        if (parents_idx == 0)
        {
          parents[parents_idx] = note_part.parentElement;
        }
        else
        {
          parents[parents_idx] = parents[parents_idx - 1].parentElement;
        }

        if (parents[parents_idx].tagName.toLowerCase() != "div") return;
      }

      const parents_len = parents.length;
        let parents_idx = 0;

      while (parents_idx < parents_len)
      {
        if (cb(parents, parents_len, parents_idx)) break;

        ++parents_idx;
      }
    }


    function do_if_tag_found(tags, tag, cb)
    {
      alert("``do_if_tag_found`` is yet to be implemented!");
    }


    // @Unimplemented
    function for_each_snippet(note_part, cb)
    {
      const snippets = [];

      alert("``for_each_snippet`` is yet to be implemented!");

      const snippets_len = snippets.len;
        let snippets_idx = 0;

      while (snippets_idx < snippets_len)
      {
        const is_block = false;
        const name = undefined;
        const text = `${""}`;

        if (cb({ is_block, name, text })) return true;

        ++snippets_idx;
      }

      return false;
    }

    function snippet_to_monospace(note_part, snippet) // @Unimplemented
    {
      if (snippet.is_block)
      {
        note_part.innerHTML.indexOf(`\`\`\`${snippet.name}\n${snippet.text}\n\`\`\``);
      }
      else
      {
        note_part.innerHTML.indexOf(`\`\`${snippet.text}\`\``);
      }
    }

    // ↑↑↑ USER HELPER FUNCTIONS ↑↑↑ //


    // ↓↓↓ DEVELOPER ZONE ↓↓↓ //

    async function main()
    {
      const elements = document.querySelectorAll("[contenteditable=\"true\"]");
      const elements_len = elements.length;

      if (elements_len < 4)
      {
        return false;
      }

      let note_part_idx = 0;

      if (elements_len <= (note_part_idx+2))
      {
        return alert_app_has_changed();
      }

      let has_exitted_note = false;

      (async function()
      {
        has_exitted_note = (document.querySelectorAll("[contenteditable=\"true\"]").length != 4);

        if (has_exitted_note) return;

        // @TO-DO: Wait for changes instead of periodically updating.
        await sleep(200);
      })();

      // Each note part should be undefined if the note gets closed after the check.
      try
      {
        const note_head = elements[2];
        const note_body = elements[3];

        const tags = [];

        if (apply_to_note_part_on_open(note_head, tags)) return true;
        if (apply_to_note_head_on_open(note_head, tags)) return true;

        if (apply_to_note_part_on_open(note_body, tags)) return true;
        if (apply_to_note_body_on_open(note_body, tags)) return true;
      }
      catch (err)
      {
        return (
          (err.message.indexOf("note_head is not defined") == -1) &&
          (err.message.indexOf("note_body is not defined") == -1)
        );
      }

      while (elements_len > (note_part_idx+2))
      {
        if (has_exitted_note) return false;

        const note_part = elements[note_part_idx+2];

        const tags = [];

        if (note_part_idx == 0)
        {
          // Each note part should be undefined if the note gets closed after the check.
          try
          {
            if (apply_to_note_part_periodically(note_part, tags)) return true;
            if (apply_to_note_head_periodically(note_part, tags)) return true;
          }
          catch (err)
          {
            return (
              (err.message.indexOf("note_part is not defined") == -1) &&
              (err.message.indexOf("note_head is not defined") == -1)
            );
          }
        }
        else
        if (note_part_idx == 1)
        {
          // Each note part should be undefined if the note gets closed after the check.
          try
          {
            if (apply_to_note_part_periodically(note_part, tags)) return true;
            if (apply_to_note_body_periodically(note_part, tags)) return true;
          }
          catch (err)
          {
            return (
              (err.message.indexOf("note_part is not defined") == -1) &&
              (err.message.indexOf("note_body is not defined") == -1)
            );
          }
        }
        else
        {
          return alert_app_has_changed();
        }

        const note_part_idx_before = note_part_idx;
        note_part_idx = (note_part_idx + 1) % 2;

        // @TO-DO: Wait for changes instead of periodically updating.
        if (note_part_idx_before == 1) await sleep(1000);
      }
    }


    // Notes update loop (only affects open notes).
    while (true)
    {
      if (await main()) break;
      await sleep(200); // @TO-DO: Wait for changes instead of periodically updating.
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
