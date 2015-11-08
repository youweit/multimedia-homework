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

(function (exports) {
  'use strict'; // eslint-disable-line

  var DEGREES_TO_RADIANS = Math.PI / 180.0

  function FractalTree (canvasId) {
    // drawing stuffs
    var canvas = document.getElementById(canvasId)
    var ctx = canvas.getContext('2d')
    // control
    var currentDepth = 7

    function drawTree (x1, y1, length, width, angle, depth) {
      if (depth !== 0 && length > 2) {
        var x2 = x1 + (Math.cos(angle * DEGREES_TO_RADIANS) * length)
        var y2 = y1 + (Math.sin(angle * DEGREES_TO_RADIANS) * length)
        drawRect(x1, y1, x2, y2, width, depth)
        drawTree(x2, y2, length * 2 / 3, width / 2, angle - 30, depth - 1)
        drawTree(x2, y2, length * 2 / 3, width / 2, angle + 30, depth - 1)
      }
    }

    function drawRect (x1, y1, x2, y2, width, depth) {
      ctx.beginPath()
      ctx.lineWidth = width
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      if (currentDepth - depth >= 6) {
        ctx.strokeStyle = 'green'
      } else {
        ctx.strokeStyle = 'brown'
      }
      ctx.stroke()
      ctx.font = '30px Arial'
      ctx.fillText(currentDepth + ' level', 20, 50)
    }

    function clear () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function mouseDown (event) {
      clear()
      if (event.button === 2) {
        if (currentDepth > 0) currentDepth--
      } else {
        currentDepth++
      }
      drawTree(canvas.width / 2, canvas.height - 50, 100, 20, -90, currentDepth)
    }

    this.render = function render () {
      canvas.addEventListener('mousedown', mouseDown, false)
      drawTree(canvas.width / 2, canvas.height - 50, 100, 20, -90, currentDepth)
    }
  }
  exports.FractalTree = FractalTree
})(this)
