/*
 *   brainfuck.js
 *    
 *   A JavaScript Brainfuck interpreter by Martin Gammelsæter
 *   If you don't know what Brainfuck is: http://en.wikipedia.org/wiki/Brainfuck
 */

function brainfuck(input) {
  var options = {
    // Output: char is an ascii code integer, get the the ascii character with String.fromCharCode(char)
    outputfunc : function(char) { document.getElementById('output').value += String.fromCharCode(char); },
    // Input: Can be anything, as long as it returns an inputted character as an ascii code
    inputfunc  : function() { return document.getElementById('input').value.charCodeAt(state.inpchar++); }
  };
  var state = {
    // Data pointer pointing at current cell
    pointer :  0,
    // Array of data cells, initially empty - filled as needed
    cells   :  [],
    inpchar :  0
  };

  // Loops through the brainfuck input string
  for (var inputptr = 0; inputptr < input.length; inputptr++) {
    command = input.charAt(inputptr);
    switch (command) {
      case '>':
        state.pointer++;
        break;
      case '<':
        state.pointer--;
        break;
      case '+':
        // If the pointer is pointing at a not yet initialized cell, make it a 0 (to avoid NaN)
        if (!state.cells[state.pointer]) {
          state.cells[state.pointer] = 0;
        }
        state.cells[state.pointer] += 1;
        break;
      case '-':
        if (!state.cells[state.pointer]) {
          state.cells[state.pointer] = 0;
        }
        state.cells[state.pointer] -= 1;
        break;
      case '.':
        options.outputfunc(state.cells[state.pointer]);
        break;
      case ',':
        state.cells[state.pointer] = options.inputfunc();
        break;
      case '[':
        // If current cell is 0, jump to first command after loop
        if (!state.cells[state.pointer]) {
          for (var j = inputptr; j < input.length; j++) {
            if (input.charAt(j) == ']') {
              inputptr = j+1;
              break;
            }
          }
        }
        break;
      case ']':
        // If current cell is not zero, jump to beginning of loop
        if (state.cells[state.pointer]) {
          for (var j = inputptr; j >= 0; j--) {
            if (input.charAt(j) == '[') {
              inputptr = j;
              break;
            }
          }
        }
        break;
    }
  }
}
