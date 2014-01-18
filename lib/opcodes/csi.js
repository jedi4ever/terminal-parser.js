'use strict';

var op = function(actions) {
  return function(p) {
    return { type: 'OP', ops: actions };
  };
};

var csi = {
  // CSI P s @
  // Insert P s (Blank) Character(s) (default = 1) (ICH)
  '@': function(p) { return op([ [ 'insertBlanks', (p.args || 1) ] ])(); },

  // CSI P s A
  // Cursor Up P s Times (default = 1) (CUU)
  'A': function(p) { return op([ [ 'moveCursor', 0 , -(p.args[0] || 1) ] ])(); },

  // CSI P s B
  // Cursor Down P s Times (default = 1) (CUD)
  'B': function(p) { return op([ [ 'moveCursor' , 0, (p.args[0] || 1)  ] ])(); },

  // CSI P s C
  // Cursor Forward P s Times (default = 1) (CUF)
  'C': function(p) { return op([ [ 'moveCursor', (p.args[0] || 1) , 0 ] ])(); },

  // CSI P s D
  // Cursor Backward P s Times (default = 1) (CUB).
  'D': function(p) { return op([ [ 'moveCursor', -(p.args[0] || 1) , 0 ] ])(); },

  // CSI P s E
  // Cursor Next Line P s Times (default = 1) (CNL).
  'E': function(p) { return op([ [ 'moveCursor', 0 , (p.args[0] ||1) ] , [ 'cursor_set', 0, null ] ])(); },
  // CSI P s F
  // Cursor Preceding Line P s Times (default = 1) (CPL)

  // CSI P s G
  // Cursor Character Absolute [column] (default = [row,1]) (CHA)
  'G': function(p) { return op([ [ 'moveCursorAbsolute', p.args ] ])(); },

  // CSI P s ; P s H
  // Cursor Position [row;column] (default = [1,1]) (CUP)
  'H': function(p) { return op([ [ 'setCursor' , (p.args[0] || 1) - 1 , (p.args[1] || 1) -1  ] ])(); },

  // CSI P s I
  // Cursor Forward Tabulation P s tab stops (default = 1) (CHT).
  'I': function(p) { return op([ [ 'moveCursorTab' , (p.args[0] || 1)  ] ])(); },

  // CSI P s J
  // Erase in Display (ED).
  // P s = 0 → Erase Below (default). 
  // P s = 1 → Erase Above. 
  // P s = 2 → Erase All. 
  // P s = 3 → Erase Saved Lines (xterm).
  'J': function(p) { return op([ [ 'eraseDisplay' , (p.n || 0) ] ])(); },

  // CSI ? P s J
  // Erase in Display (DECSED).
  // P s = 0 → Selective Erase Below (default). 
  // P s = 1 → Selective Erase Above. 
  // P s = 2 → Selective Erase All.
  '?J': function(p) { return op([ [ 'DECSED', p.args[0] ] ])(); },

  // CSI P s K
  // Erase in Line (EL).
  // P s = 0 → Erase to Right (default).
  // P s = 1 → Erase to Left.
  // P s = 2 → Erase All.
  'K': function(p) { return op([ [ 'eraseInLine' , (p.n || 0) ] ])(); },

  // CSI ? P s K
  // Erase in Line (DECSEL).
  // P s = 0 → Selective Erase to Right (default). 
  // P s = 1 → Selective Erase to Left. 
  // P s = 2 → Selective Erase All.
  '?K': function(p) { return op([ [ 'eraseInLineL', p.args[0] ] ])(); },

  // CSI P s L
  // Insert P s Line(s) (default = 1) (IL).
  'L': function(p) { return op([ [ 'insertLines', p.args[0] ] ])(); },

  // CSI P s M
  // Delete P s Line(s) (default = 1) (DL)
  'M': function(p) { return op([ [ 'deleteLines', ( p.args[0] || 1) ] ])(); },

  // CSI P s P
  // Delete P s Character(s) (default = 1) (DCH).
  'P': function(p) { return op([ [ 'deleteChars', ( p.args[0] || 1)] ])(); },

  // CSI P s S
  // Scroll up P s lines (default = 1) (SU).
  'S': function(p) { return op([ [ 'scrollLines', ( p.args[0] || 1) ] ])(); },

  // CSI P s T
  // Scroll down P s lines (default = 1) (SD).
  'T': function(p) { return op([ [ 'scrollLines', - (p.args[0] || 1) ] ])(); },

  // CSI P s X
  // Erase P s Character(s) (default = 1) (ECH).
  'X': function(p) { return op([ [ 'eraseChars', - (p.args[0] || 1) ] ])(); },

  // CSI P s Z
  // Cursor Backward Tabulation P s tab stops (default = 1) (CBT).
  'Z': function(p) { return op([ [ 'cursorTab' , - (p.args[0] || 1) ] ])(); },

  // CSI P m `
  // Character Position Absolute [column] (default = [row,1]) (HPA).
  '`': function(p) { return op([ [ 'positionChar' , (p.args[0] || 1) ] ])(); },

  // CSI P m a
  // Character Position Relative [columns] (default = [row,col+1]) (HPR).

  'a': function(p) { return op([ [ 'char_position_rel' , (p.args[0] || 1) ] ])(); },

  // CSI P s b
  // Repeat the preceding graphic character P s times (REP).

  // CSI P s c
  // Send Device Attributes (Primary DA).
  // P s = 0 or omitted → request attributes from terminal. The response depends on the decTerminalID resource setting.
  // → CSI ? 1 ; 2 c (‘‘VT100 with Advanced Video Option’’)
  // → CSI ? 1 ; 0 c (‘‘VT101 with No Options’’)
  // → CSI ? 6 c (‘‘VT102’’)
  // → CSI ? 6 0 ; 1 ; 2 ; 6 ; 8 ; 9 ; 1 5 ; c (‘‘VT220’’)
  // The VT100-style response parameters do not mean anything by themselves.
  // VT220 parameters do, telling the host what features the terminal supports:
  // P s = 1 → 132-columns. 
  // P s = 2 → Printer. 
  // P s = 6 → Selective erase. 
  // P s = 8 → User-defined keys. 
  // P s = 9 → National Replacement Character sets. 
  // P s = 1 5 → Technical characters. 
  // P s = 1 8 → User windows. 
  // P s = 2 1 → Horizontal scrolling. 
  // P s = 2 2 → ANSI color, e.g., VT525. 
  // P s = 2 9 → ANSI text locator (i.e., DEC Locator mode).

  // CSI > P s c
  // Send Device Attributes (Secondary DA).
  // P s = 0 or omitted → request the terminal’s identification code. The response depends on the decTerminalID resource setting. It should apply only to VT220 and up, but xterm extends this to VT100.
  // → CSI > P p ; P v ; P c c
  // where P p denotes the terminal type 
  // P p = 0 → ‘‘VT100’’. 
  // P p = 1 → ‘‘VT220’’. 
  // P p = 2 → ‘‘VT240’’. 
  // P p = 1 8 → ‘‘VT330’’. 
  // P p = 1 9 → ‘‘VT340’’. 
  // P p = 2 4 → ‘‘VT320’’. 
  // P p = 4 1 → ‘‘VT420’’. 
  // P p = 6 1 → ‘‘VT510’’. 
  // P p = 6 4 → ‘‘VT520’’. 
  // P p = 6 5 → ‘‘VT525’’.
  // and P v is the firmware version (for xterm, this was originally the XFree86 patch number, starting with 95). In a DEC terminal, P c indicates the ROM cartridge registration number and is always zero.

  // CSI P m d
  // Line Position Absolute [row] (default = [1,column]) (VPA).
  'd': function(p) { return op([ [ 'line_position_absolute' , (p.args[0] || 1) ] ])(); },

  // CSI P m e
  // Line Position Relative [rows] (default = [row+1,column]) (VPR).

  // CSI P s ; P s f
  // Horizontal and Vertical Position [row;column] (default = [1,1]) (HVP).

  // CSI P s g
  // Tab Clear (TBC).
  // P s = 0 → Clear Current Column (default).
  // P s = 3 → Clear All.

  // CSI ? P m h
  // DEC Private Mode Set (DECSET).
  'h': function(p) {
    var result = [];

    var h = {
      '2': 'Keyboard Action Mode (AM)',
      '4': 'Insert Mode (IRM)',
      '12': 'Send/receive (SRM)',
      '20': 'Automatic Newline (LNM).',
      '34' : 'Normal Cursor Visibility',
      '?1': 'Application Cursor Keys',
      '?2': 'Designate USASCII for character sets G0-G3 (DECANM), and set VT100 mode',
      '?3': '132 Column Mode (DECCOLM)',
      '?4': 'Smooth (Slow) Scroll (DECSCLM)',
      '?5': 'Reverse Video (DECSCNM)',
      '?6': 'Origin Mode (DECOM)',
      '?7': 'Wraparound Mode (DECAWM)',
      '?8': 'Auto-repeat Keys (DECARM)',
      '?9': 'Send Mouse X & Y on button press' , // See the section Mouse Tracking. This is the X10 xterm mouse protocol'
      '?10': 'Show toolbar (rxvt)',
      '?12': 'Start Blinking Cursor (att610)',
      '?18': 'Print form feed (DECPFF)',
      '?19': 'Set print extent to full screen (DECPEX)',
      '?25': 'Show Cursor (DECTCEM)',
      '?30': 'Show scrollbar (rxvt)',
      '?35': 'Enable font-shifting functions (rxvt)',
      '?38': 'Enter Tektronix Mode (DECTEK)',
      '?40': 'Allow 80 -> 132 Mode',
      '?41': 'more(1) fix (see curses resource)',
      '?42': 'Enable National Replacement Character sets (DECNRCM)',
      '?44': 'Turn on Margin Bell.',
      '?45': 'Reverse-wraparound Mode.',
      '?46': 'Start Logging. This is normally disable by a compile-time option',
      '?1000' : 'Send Mouse X & Y on button press and release.',
      '?1034' : 'Interpret meta key, sets eight bit. (enables the eightBitInput resource)',
      '?1049' : 'Save cursor as in DECSC and use Alternate Screen Buffer, clearing it first.',
      '?2004' : 'Reset bracketed paste mode'
    };

    p.args.forEach(function(a) {
      var code = h[p.mod + a];
      if (code !== undefined) {
        if (p.mod === '') {result.push([ 'setMode', code]); }
        if (p.mod === '?') {result.push([ 'setPrivateDecMode', code]); }
      }
    });

    if (result.length !== p.args.length) { // No all codes got converted
      return false;
    } else {
      return op(result)();
    }
  }, //TODO

  // CSI P m i
  // Media Copy (MC).
  // P s = 0 → Print screen (default). 
  // P s = 4 → Turn off printer controller mode
  // P s = 5 → Turn on printer controller mode

  // CSI ? P m i
  // Media Copy (MC, DEC-specific).
  // P s = 1 → Print line containing cursor. 
  // P s = 4 → Turn off autoprint mode. 
  // P s = 5 → Turn on autoprint mode. 
  // P s = 1 0 → Print composed display, ignores DECPEX. 
  // P s = 1 1 → Print all pages.

  'l': function(p) {
    var result = [];

    var l = {
      '2'  : 'Keyboard Action' ,
      '4'  : 'Replace Mode' ,
      '12' : 'Send/Receive' ,
      '20' : 'Normal Linefeed' ,
      '34' : 'Normal Cursor Visbility' ,

      '?1' : 'Normal Cursor Keys' ,
      '?2' : 'Designate VT52 Mode' ,
      '?3' : '80 Column Mode' ,
      '?4' : 'Jump (Fast) Scroll' ,
      '?5' : 'Normal Video',
      '?12' : 'Stop Blinking Cursor (att610)',
      '?25' : 'Hide Cursor' ,
      '?1000' : 'Dont send Mouse X & Y on button press and release.',
      '?1049' : 'Use Normal Screen Buffer and restore cursor as in DECRC',
      '?2004' : 'Set bracketed paste mode'
    };

    p.args.forEach(function(a) {
      var code = l[p.mod + a];
      if (code !== undefined) {
        if (p.mod === '') {result.push([ 'resetMode', code]); }
        if (p.mod === '?') {result.push([ 'resetModeDecPrivate', code]); }
      }
    });

    if (result.length !== p.args.length) { // No all codes got converted
      return false;
    } else {
      return op(result)();
    }
  }, //TODO

  'q': function(p) { return op([ [ 'setLed' , p.n  ] ])(); },
  'r': function(p) { return op([ [ 'setScrollRegion' , (p.n || 1) -1 , (p.m || 80) - 1 ] ])(); }, //TODO

  // CSI u
  // Restore cursor (ANSI.SYS)
  'u': function(p) { return op([ [ 'restoreCursor' ] ])(); },

  // CSI s
  // Save cursor (ANSI.SYS), available only when DECLRMM is disabled.
  's': function(p) { return op([ [ 'saveCursor' ] ])(); },


};
module.exports = csi;

