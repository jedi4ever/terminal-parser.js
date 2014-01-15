'use strict';

function clone(buffer) {
  return JSON.parse(JSON.stringify(buffer));
}

function tabs(buffer) {
  return JSON.parse(JSON.stringify(buffer.tabs));
}

function insertText(obuffer, text ) {
  var buffer = clone(obuffer);

  // For each char in the text
  for (var i = 0; i < text.length ; i++) {
    var posX = getCursorX(buffer);
    var posY = getCursorY(buffer);

    var currentLine = buffer.lines[ posY ];

    // If the line was not yet created
    if ((currentLine === undefined) || currentLine === null) {
      buffer.lines[ posY ] = [];
    }

    // Add the text character at the current position
    buffer.lines[ posY ] [ posX] = text[i];

    // Default is to advance only the X position
    var newPosX = posX + 1;
    var newPosY = posY;

    // But if we are at the last column
    if (isAtLastCol(buffer)) {
      newPosX = 0; // We wrap to the next line
      newPosY = posY +1; // And move to the next line
    }

    // But if we are now beyond the last row
    if (isBeyondLastRow(buffer, newPosY)) {
      buffer.lines.shift(); // we scroll up
      newPosY = posY; // and stay on the same line
      buffer.lines[newPosY] = []; // and prepare this line
    }

    // Now finally update the buffer new cursor position
    buffer.cursor.x = newPosX;
    buffer.cursor.y = newPosY;
  }

  return buffer;
}

function getCols(buffer) {
  return buffer.size.cols;
}

function getRows(buffer) {
  return buffer.size.rows;
}

function text(obuffer, input ) {
  return insertText(obuffer, input);
}

function isAtLastCol(buffer) {
  return getCursorX(buffer) === (getCols(buffer) -1);
}

function isAtLastRow(buffer) {
  return getCursorY(buffer) === (getRows(buffer) -1);
}

function isBeyondLastRow(buffer,posY) {
  return (posY > getRows(buffer)-1);
}

function isBeyondLastCol(buffer,posX) {
  return (posX > getCols(buffer)-1);
}

function getCursor(buffer) {
  return JSON.parse(JSON.stringify(buffer.cursor));
}

function getCursorX(obuffer) {
  return getCursor(obuffer).x;
}

function getCursorY(obuffer) {
  return getCursor(obuffer).y;
}

function cursor_set(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = getCursor(buffer);
  c.x = x;
  c.y = y;
  buffer.cursor = c;
  return buffer;
}

// Not finished yet
function cursor_tab(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = getCursor(buffer);
  buffer.tabs = tabs(buffer);
  return buffer;
}

function cursor_save(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = getCursor(buffer);
  return buffer;
}

function cursor_restore(obuffer) {
  var buffer = clone(obuffer);
  buffer.cursor = buffer.ocursor;
  return buffer;
}

function cursor_move(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = getCursor(buffer);
  c.x = c.x + x;
  c.y = c.y + y;
  buffer.cursor = c;
  return buffer;
}

module.exports = {
  cursor_move: cursor_move,
  text: text,
  insertText: insertText,
  isAtLastCol: isAtLastCol,
  isBeyondLastCol: isBeyondLastCol,
  isBeyondLastRow: isBeyondLastRow,
  isAtLastRow: isAtLastRow,
  cursor_save: cursor_save,
  cursor_set: cursor_set,
  cursor_restore: cursor_restore,
  cursor_tab: cursor_tab
};
