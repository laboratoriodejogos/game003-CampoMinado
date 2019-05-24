function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid;
var cols;function Cell(i, j, w) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.neighborCount = 0;

  this.bee = false;
  this.revealed = false;
}

Cell.prototype.show = function() {
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);
  if (this.revealed) {
    if (this.bee) {
      fill(95);
      noStroke();
      rect(this.x + this.w * 0.2,
              this.y + this.w * 0.5,
              this.w * 0.7, 
              this.w * 0.1);
      rect(this.x + this.w * 0.5,
              this.y + this.w * 0.2,
              this.w * 0.1, 
              this.w * 0.7);
      ellipse(this.x + this.w * 0.55,
              this.y + this.w * 0.55,
              this.w * 0.4);
    } else {
      fill(230, 230, 255);
      rect(this.x, this.y, this.w, this.w);
      if (this.neighborCount > 0) {
        textAlign(CENTER);
        fill(0);
        text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 15);
      }
    }
  }
}

Cell.prototype.countBees = function() {
  if (this.bee) {
    this.neighborCount = -1;
    return;
  }
  var total = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;

      var neighbor = grid[i][j];
      if (neighbor.bee) {
        total++;
      }
    }
  }
  this.neighborCount = total;
}

Cell.prototype.contains = function(x, y) {
  return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Cell.prototype.reveal = function() {
  if (this.revealed == false) {
  this.revealed = true;
  notBees = notBees + 1;
  if (this.neighborCount == 0) {
    // flood fill time
    this.floodFill();
  }
}
}

Cell.prototype.floodFill = function() {
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;

      var neighbor = grid[i][j];
      if (!neighbor.bee && !neighbor.revealed) {
        neighbor.reveal();
      }
    }
  }
}
var rows;
var w = 45.45;

var notBees = 0;
var totalBees = Math.floor(Math.random() * 25) + 5;


var Lost = false;


function setup() {
  createCanvas(501, 501);
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

function gameOver() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
      if (Lost == false) {
       alert("Game Over");
        Lost = true;
    }
   }
  }
}


function Win(){
  alert("You Win! Loading the next level...");    
  window.location.reload(false);
  
}

function mousePressed() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        grid[i][j].reveal();
        if (grid[i][j].bee) {
          gameOver();
        }
        if (notBees >= (121 - totalBees)) {
          Win();
        }
        }
      }   
    }
}

function draw() {
  background(179, 179, 255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}