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
  var canvas = document.getElementById('fractal-canvas')
  var ctx = canvas.getContext('2d')
  var degree = 30
  var maxDepth = 7
  var depth = 0
  var recusionDepth = 0
  var x = (canvas.width - 20)/2
  var y = canvas.height

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function branch(width, height , currentDepth){
    if (currentDepth > 0) {
      y -= height
      currentDepth--
      console.log(x,y,"height", height, "width", width)
      drawRotatedRect(x, y, width, height, -30)
      drawRotatedRect(width + x, y, width, height, 30)
      height = height * 0.66
      width  = width * 0.5
      branch(width, height, currentDepth)

    }
  }

  var mouseDown = function (event) {
    clear()
    y = canvas.height
    if (event.button == 2) {
      if (depth > 0) depth--
      console.log("left mouse click")
    } else {
      if (depth < 7) depth++
      console.log("right mouse click")
    }

    branch(20, 100, depth)
    console.log(depth)
  }

  function drawRotatedRect(x, y, width, height, degrees){
    // first save the untranslated/unrotated context
    ctx.save()

    ctx.fillStyle="#7e3a1c"

    ctx.beginPath()
    // move the rotation point to the center of the rect
    ctx.translate( x+width/2, y+height/2 )
    // rotate the rect
    ctx.rotate(degrees*Math.PI/180)

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect( -width/2, -height/2, width,height)
    ctx.fill()

    // restore the context to its untranslated/unrotated state
    ctx.restore()
  }

  canvas.addEventListener('mousedown', mouseDown, false)

}()
