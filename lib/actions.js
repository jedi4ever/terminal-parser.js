'use strict';

function clone(buffer) {
  return JSON.parse(JSON.stringify(buffer));
}

function cursor(buffer) {
  return JSON.parse(JSON.stringify(buffer.cursor));
}

function tabs(buffer) {
  return JSON.parse(JSON.stringify(buffer.tabs));
}

function cursor_set(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = cursor(buffer);
  c.x = x;
  c.y = y;
  buffer.cursor = c;
  return buffer;
}

// Not fiinished yet
function cursor_tab(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = cursor(buffer);
  buffer.tabs = tabs(buffer);
  return buffer;
}

function cursor_save(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = cursor(buffer);
  return buffer;
}

function cursor_restore(obuffer) {
  var buffer = clone(obuffer);
  buffer.cursor = buffer.ocursor;
  return buffer;
}

function cursor_move(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = cursor(buffer);
  c.x = c.x + x;
  c.y = c.y + y;
  buffer.cursor = c;
  return buffer;
}

module.exports = {
  cursor_move: cursor_move,
  cursor_save: cursor_save,
  cursor_set: cursor_set,
  cursor_restore: cursor_restore,
  cursor_tab: cursor_tab
};
