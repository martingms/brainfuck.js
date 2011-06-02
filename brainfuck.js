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
    pointer :  0,         // Data pointer pointing at current cell
    cells   :  [],        // Array of data cells, initially empty - filled as needed
    inpchar :  0,         // Points to first input character not yet taken as input
    matchingbrackets : [] // Keeping track of loop begin/end
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
        // If no corresponding ] found, find it and save it
        if (!state.matchingbrackets[inputptr]) {
          var nestedloops = 0;
          for (var j = inputptr + 1; j < input.length; j++) {
            // Internal loop detected, ++ nestedloops
            if (input.charAt(j) == '[') {
              nestedloops++;
            }
            // End of loop detected
            else if (input.charAt(j) == ']') {
              // If nestedloops > 0, -- nestedloops
              if (nestedloops) {
                nestedloops--;
              // If nestedloops == 0, we know that this is the end of the current loop
              } else {
                state.matchingbrackets[inputptr] = j;
                state.matchingbrackets[j] = inputptr;
                break;
              }
            }
          }
        }
        // If current cell is 0, jump to first command after loop
        if (!state.cells[state.pointer]) {
          inputptr = state.matchingbrackets[inputptr] + 1;
        }
        break;
      case ']':
        // If current cell is not zero, jump to beginning of loop
        if (state.cells[state.pointer]) {
          inputptr = state.matchingbrackets[inputptr];
        }
        break;
    }
  }
}
