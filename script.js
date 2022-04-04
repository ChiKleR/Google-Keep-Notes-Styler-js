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


"use strict";


function alert_app_has_changed()
{
  alert("Something changed in the Google Keep Notes app since the creation of this script (it needs to be updated).");
}


function do_if_tag_found(tag, cb)
{
  alert("``do_if_tag_found`` is yet to be implemented!");
}


function apply_to_note(note)
{
  // add styles to note_title
  // you can even apply filters depending on tags! (although manually for this version)


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


  return true;
}


window.addEventListener("load", function() {
  "use strict";


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

        apply_to_note(note_title);

        apply_to_note_title(note_title);
      }
      else
      if (elements_idx == 3)
      {
        const note_body = elements[elements_idx];

        apply_to_note(note_body);

        apply_to_note_body(note_body);
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
}, false);
