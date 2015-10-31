/*
The MIT License

Copyright © 2015 Youwei Teng. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

"use strict"; 

function Point(x, y) {
  this.x = x
  this.y = y
}


var main = function(){
  var canvas = document.getElementById('bezier-canvas')
  var down = false
  var numberOfPoints = 600
  var ctx = canvas.getContext('2d')
  var controlPoint1 = new Point(canvas.width/2, 40)
  var controlPoint2 = new Point(canvas.width/2, canvas.height-40)
  var startPoint = new Point(50, canvas.height/2)
  var endPoint = new Point(canvas.width - 50, canvas.height/2)
  var rectSize = 8
  var curve = new Array()
  var draggingPoint
  var canvasMouseX,canvasMouseY

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function computeBezier(){
    var dt //float
    curve = new Array()
    dt = 1.0 / ( numberOfPoints - 1 );
    for(var i = 0; i < numberOfPoints; i++) {
      curve[i] = pointsOnCubicBezier(i*dt)
    }
  }

  function pointsOnCubicBezier(t) {
    var ax, bx, cx //float
    var ay, by, cy //float
    var tSquared, tCubed //float
    var result = new Point(0,0)

    cx = 3.0 * (controlPoint1.x - startPoint.x)
    bx = 3.0 * (controlPoint2.x - controlPoint1.x) - cx
    ax = endPoint.x - startPoint.x - cx - bx

    cy = 3.0 * (controlPoint1.y - startPoint.y)
    by = 3.0 * (controlPoint2.y - controlPoint1.y) - cy
    ay = endPoint.y - startPoint.y - cy - by

    /*計算位於參數值t的曲線點*/

    tSquared = t * t
    tCubed = tSquared * t

    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + startPoint.x + rectSize/2
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + startPoint.y + rectSize/2

    return result
  }

  function draw(){
    clear()
    ctx.beginPath();
    ctx.fillRect(startPoint.x, startPoint.y, rectSize, rectSize)
    ctx.fillRect(endPoint.x, endPoint.y, rectSize, rectSize)
    ctx.rect(controlPoint1.x, controlPoint1.y, rectSize, rectSize)
    ctx.rect(controlPoint2.x, controlPoint2.y, rectSize, rectSize)
    ctx.stroke();
    ctx.closePath();

    for (var i=0; i< curve.length-1; i++) {
      ctx.beginPath();
      ctx.moveTo(curve[i].x, curve[i].y);
      ctx.lineTo(curve[i+1].x+1, curve[i+1].y);
      ctx.stroke();
    }
  }

  function hitTest(event, controlPoint) {
    return (canvasMouseX > controlPoint.x && canvasMouseX <  controlPoint.x+rectSize && canvasMouseY > controlPoint.y && canvasMouseY < controlPoint.y+rectSize)
  }

  var mouseMove = function (event){
    if (down) {
      canvasMouseX = event.clientX - (canvas.offsetLeft - window.pageXOffset)
      canvasMouseY = event.clientY - (canvas.offsetTop - window.pageYOffset)

      if (draggingPoint) {
        draggingPoint.x = canvasMouseX
        draggingPoint.y = canvasMouseY
      }
      computeBezier()
      // console.log(computeBezier())
    }
  }

  var mouseUp = function (event) {
    down = false;
    draggingPoint = undefined
  }

  var mouseDown = function (event) {
    down = true;
    canvasMouseX = event.clientX - (canvas.offsetLeft - window.pageXOffset)
    canvasMouseY = event.clientY - (canvas.offsetTop - window.pageYOffset)

    if (hitTest(event, controlPoint1)) {
      console.log("controlPoint1 hit")
      draggingPoint = controlPoint1
    }

    if (hitTest(event, controlPoint2)) {
      console.log("controlPoint2 hit")
      draggingPoint = controlPoint2
    }

    if (hitTest(event, startPoint)) {
      console.log("controlPoint2 hit")
      draggingPoint = startPoint
    }

    if (hitTest(event, endPoint)) {
      console.log("controlPoint2 hit")
      draggingPoint = endPoint
    }
  }

  //add listeners
  canvas.addEventListener('mousedown', mouseDown, false)
  canvas.addEventListener('mouseup', mouseUp, false)
  canvas.addEventListener('mousemove',mouseMove, false)

  computeBezier()
  
  setInterval(draw, 10);
}()
