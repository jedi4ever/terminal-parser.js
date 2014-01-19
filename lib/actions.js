'use strict';

function clone(buffer) {
  return JSON.parse(JSON.stringify(buffer));
}

function tabs(buffer) {
  return JSON.parse(JSON.stringify(buffer.tabs));
}

function setMode(obuffer,mode) {
  var buffer = clone(obuffer);
  var shortMode = mode.slice(0,10);
  buffer.modes[shortMode] = true;
  return buffer;
}

function setPrivateDecMode(obuffer,mode) {
  var buffer = clone(obuffer);
  var shortMode = mode.slice(0,10);
  buffer.modes[shortMode] = true;
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


function insertArrayAt(array, index, remove, arrayToInsert) {
    Array.prototype.splice.apply(array, [index, remove ].concat(arrayToInsert));
}

function insertText(obuffer, text ) {
  var buffer = clone(obuffer);

  var textLength = text.length;
  var posX = buffer.cursor.x;
  var posY = buffer.cursor.y;

  var cols = buffer.size.cols;
  var rows = buffer.size.rows;
  var maxX = cols -1;
  var maxY = rows -1;

  var newPosX = posX + (textLength % cols);
  var newPosY = posY + Math.floor(textLength / cols);

  if (newPosY > maxY) {
    // We need to shift
    buffer.lines.shift(); // we scroll up
    newPosY = posY; // and stay on the same line
    buffer.lines[newPosY] = new Array(cols); // and prepare this line
  }

  // Current line
  var charsLeft = cols - posX ;
  var currentLine = text.slice(0,charsLeft);
  var currentLineArr = currentLine.split('');

  // Needs to be added 
  insertArrayAt(buffer.lines[posY], posX , currentLine.length, currentLineArr);

  var moreLines = Math.floor(textLength / cols);

  //console.log(moreLines);
  for (var l = 0 ; l < moreLines ; l++) {
    var line = text.slice(charsLeft + (cols * l) , charsLeft + (cols * l) + cols);
    //console.log(l, cols,  charsLeft + (cols *l),  line);
    var lineArr = line.split('');
    // posY + 1 because we already handled the first line
    // At position 0
    // We replace a number of elements = lineArr.length
    // with the line we got (but as an array)
    insertArrayAt(buffer.lines[posY + 1 + l ], 0 , lineArr.length, lineArr);
  }

  buffer.cursor.x = newPosX;
  buffer.cursor.y = newPosY;

  return buffer;

}

function insertText2(obuffer, text ) {
  var buffer = clone(obuffer);


  var textLength = text.length;
  var cols = getCols(obuffer);
  var rows = getRows(obuffer);

  // For each char in the text
  for ( var i = 0 ; i < textLength ; i++ ) {
    var posX = getCursorX(buffer);
    var posY = getCursorY(buffer);

    var currentLine = buffer.lines[ posY ];

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
      buffer.lines[newPosY] = new Array(cols); // and prepare this line
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
    size: { rows: rows, cols: cols },
    modes: {
    }
  };

  buffer.lines = new Array(rows);
  for (var i = 0; i < rows ; i++) {
    buffer.lines[i] = new Array(cols);
  }
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
