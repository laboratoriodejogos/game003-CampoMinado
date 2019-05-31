function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid;
var cols;
var rows;
var w = 25;
var timer = setInterval(timeIt, 1000);
var counter = 180;
var seconds, minutes;

var totalBees = Math.floor(Math.random() * 25) + 15;
var notBees = 0;

function setup() {
  createCanvas(401, 401);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }

  // Pick totalBees spots
  var options = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      options.push([i, j]);
    }
  }


  for (var n = 0; n < totalBees; n++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    grid[i][j].bee = true;
  }


  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBees();
    }
  }

}

function Win(){
  alert("Você Venceu!");  
    setTimeout(function(){location.reload()}, 1000);
}



function gameOver() {
  alert("Você Perdeu!");
  stopTimer();
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
  setTimeout(function(){location.reload()}, 1000);
}

function mousePressed() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        grid[i][j].reveal();
        
          if (notBees >= (256 - totalBees)) {
          Win();
          stopTimer();
        }
        
        if (grid[i][j].bee) {
          gameOver();
          stopTimer();
      
        }
      }
    }
  }
}

function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  if (counter == 0 ) {
    alert("Você Perdeu!");
    window.location.reload();
  }
}

function timeIt() {
  // 1 counter = 1 second
  if (counter > 0) {
    counter--;
  }
  
  minutes = floor(counter/60);
  seconds = counter % 60;
  
  // if (counter < 60)
  var timer = select('#timer')
  timer.html(nf(minutes,2) + ":" + nf(seconds,2));
}

function stopTimer() {
  clearInterval(timer);
}