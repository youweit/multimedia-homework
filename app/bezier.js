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
  function Point (x, y) {
    this.x = x
    this.y = y
  }

  function Rect (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.center = function () {
      return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }

    this.setPoitsion = function (point) {
      this.x = point.x
      this.y = point.y
    }
  }

  function hitTest (cursor, points, callback) {
    for (var i = 0; i < points.length; i++) {
      if ((cursor.x > points[i].x && cursor.x < points[i].x + points[i].width && cursor.y > points[i].y && cursor.y < points[i].y + points[i].height)) {
        callback(points[i])
      }
    }
  }

  function Bezier (canvasId) {
    // drawing stuffs
    var canvas = document.getElementById(canvasId)
    var ctx = canvas.getContext('2d')
    var curve = []
    var numberOfPoints = 600
    // control
    var down = false
    var cursorPosition
    var draggingRect
    // points
    var controlPoints = []
    var controlPointSize = 10
    var controlPoint1 = new Rect(canvas.width / 2, 40, controlPointSize, controlPointSize)
    var controlPoint2 = new Rect(canvas.width / 2, canvas.height - 40, controlPointSize, controlPointSize)
    var startPoint = new Rect(50, canvas.height / 2, controlPointSize, controlPointSize)
    var endPoint = new Rect(canvas.width - 50, canvas.height / 2, controlPointSize, controlPointSize)

    function computeBezier () {
      var dt
      curve = [] // clear the previous data.
      dt = 1.0 / (numberOfPoints - 1)
      for (var i = 0; i < numberOfPoints; i++) {
        curve[i] = calculateBezier(controlPoints, i * dt)
      }
    }

    function calculateBezier (points, t) {
      if (points.length === 1) {
        return points[0].center()
      } else {
        var P1 = calculateBezier(points.slice(0, -1), t)
        var P2 = calculateBezier(points.slice(1, points.length), t)
        var k = (1 - t)
        var Px = k * P1.x + t * P2.x
        var Py = k * P1.y + t * P2.y
        var P = new Point(Px, Py)
        return P
      }
    }

    function draw () {
      clear()
      ctx.beginPath()
      // draw the control points
      for (var i = 0; i < controlPoints.length; i++) {
        if (i === 0 || i === controlPoints.length - 1) {
          ctx.fillRect(controlPoints[i].x, controlPoints[i].y, controlPoints[i].width, controlPoints[i].height)
        } else {
          ctx.rect(controlPoints[i].x, controlPoints[i].y, controlPoints[i].width, controlPoints[i].height)
        }
      }
      ctx.stroke()
      ctx.closePath()
      // draw bezier path
      for (var j = 0; j < curve.length - 1; j++) {
        ctx.beginPath()
        ctx.moveTo(curve[j].x, curve[j].y)
        ctx.lineTo(curve[j + 1].x + 1, curve[j + 1].y)
        ctx.stroke()
      }
    }

    function clear () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    function getCursorPosition (event) {
      return new Point(event.clientX - (canvas.offsetLeft - window.pageXOffset), event.clientY - (canvas.offsetTop - window.pageYOffset))
    }

    function mouseMove (event) {
      if (down) {
        cursorPosition = getCursorPosition(event)
        if (draggingRect) {
          draggingRect.setPoitsion(cursorPosition)
        }
        computeBezier()
      }
    }

    function mouseUp (event) {
      down = false
      draggingRect = undefined
    }

    function mouseDown (event) {
      down = true
      cursorPosition = getCursorPosition(event)
      draggingRect = undefined

      hitTest(cursorPosition, controlPoints, function (collider) {
        draggingRect = collider
      })
      // uncomment to dynamically add control points
      // if (!draggingRect) {
      //   controlPoints.splice(-1, 0, new Rect(cursorPosition.x, cursorPosition.y, controlPointSize, controlPointSize))
      //   computeBezier()
      // }
    }

    this.render = function render () {
      // add listeners
      canvas.addEventListener('mousedown', mouseDown, false)
      canvas.addEventListener('mouseup', mouseUp, false)
      canvas.addEventListener('mousemove', mouseMove, false)
      // add points to the controlPoints
      controlPoints.push(startPoint)
      controlPoints.push(controlPoint1)
      controlPoints.push(controlPoint2)
      controlPoints.push(endPoint)
      computeBezier()
      setInterval(draw, 16) // draw every 16 milliseconds
    }
  }
  exports.Bezier = Bezier
})(this)
