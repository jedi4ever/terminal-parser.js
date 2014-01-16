'use strict';

function clone(buffer) {
  return JSON.parse(JSON.stringify(buffer));
}

function tabs(buffer) {
  return JSON.parse(JSON.stringify(buffer.tabs));
}

function setMode(obuffer,mode) {
  var buffer = clone(obuffer);
  buffer.modes[mode] = true;
  return buffer;
}

function setPrivateDecMode(obuffer,mode) {
  var buffer = clone(obuffer);
  buffer.modes[mode] = true;
  return buffer;
}

function newLine(obuffer ) {
  var buffer = clone(obuffer);

  var posX = getCursorX(buffer);
  var posY = getCursorY(buffer);

  // Default is to go to
  var newPosX = 0; // beginning of line
  var newPosY = posY + 1; // of next line

  // But if we are now beyond the last row
  if (isBeyondLastRow(buffer, newPosY)) {
    buffer.lines.shift(); // we scroll up
    newPosY = posY; // and stay on the same line
  }

  buffer.lines[newPosY] = []; // and prepare this line

  // Now finally update the buffer new cursor position
  buffer.cursor.x = newPosX;
  buffer.cursor.y = newPosY;

  return buffer;

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
  var buffer = clone(obuffer);
  return getCursor(buffer).x;
}

function getCursorY(obuffer) {
  var buffer = clone(obuffer);
  return getCursor(buffer).y;
}

function getSize(obuffer) {
  var buffer = clone(obuffer);
  return buffer.size;
}

function setCursor(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = getCursor(buffer);
  c.x = x;
  c.y = y;
  buffer.cursor = c;
  return buffer;
}

// Not finished yet
function tabCursor(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = getCursor(buffer);
  buffer.tabs = tabs(buffer);
  return buffer;
}

function saveCursor(obuffer) {
  var buffer = clone(obuffer);
  buffer.ocursor = getCursor(buffer);
  return buffer;
}

function restoreCursor(obuffer) {
  var buffer = clone(obuffer);
  buffer.cursor = buffer.ocursor;
  return buffer;
}

function backspace(obuffer) {
  var buffer = clone(obuffer);
  var c = getCursor(buffer);
  var posX = c.x;
  var posY = c.y;

  // Default we only need to go left
  var newPosX = c.x -1;
  var newPosY = c.y;

  // If we go beyond the Left margin
  if (newPosX < 0) {
    newPosX = getCols(obuffer) -1 ;
    newPosY = c.y - 1;
  }

  // If we go up to high , we stay at the origin
  if (newPosY < 0) {
    newPosY = 0;
    newPosX = 0;
  }

  buffer.cursor.x = newPosX;
  buffer.cursor.y = newPosY;
  return buffer;
}

function moveCursor(obuffer, x, y) {
  var buffer = clone(obuffer);
  var c = getCursor(buffer);
  c.x = c.x + x;
  c.y = c.y + y;
  buffer.cursor = c;
  return buffer;
}

function initialize(obuffer, cols, rows) {

  var buffer = {
    cursor: { x: 0, y: 0 },
    lines: [],
    size: { rows: rows, cols: cols },
    modes: {
    }
  };

  return buffer;
}

module.exports = {
  moveCursor: moveCursor,
  initialize: initialize,
  text: text,
  clone: clone,
  insertText: insertText,
  newLine: newLine,
  isAtLastCol: isAtLastCol,
  isBeyondLastCol: isBeyondLastCol,
  isBeyondLastRow: isBeyondLastRow,
  isAtLastRow: isAtLastRow,
  saveCursor: saveCursor,
  setCursor: setCursor,
  restoreCursor: restoreCursor,
  tabCursor: tabCursor,
  getCursor: getCursor,
  getCursorX: getCursorX,
  getCursorY: getCursorY,
  getCols: getCols,
  getRows: getRows,
  getSize:  getSize,
  backspace: backspace,
  setMode: setMode,
  setPrivateDecMode: setPrivateDecMode
};
