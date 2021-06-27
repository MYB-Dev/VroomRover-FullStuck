const img = document.querySelector('img')
const mpu = document.getElementById('mpu')
const forward = document.getElementById('forward')
const backward = document.getElementById('backward')
const left = document.getElementById('left')
const right = document.getElementById('right')
const flashlight = document.getElementById('flashlight')
const speed = document.getElementById('speed')

const SOCKET_URL = 'wss://vroomrover.herokuapp.com/'
const WS_URL = 'wss://vroomrover.herokuapp.com/ws'

const ws = new WebSocket(WS_URL)

const socket = io.connect(SOCKET_URL)
let urlObject

document.onkeydown = (e) => {
  const keyCode = e.keyCode
  switch (keyCode) {
    case 90 || 38:
      moveForward()
      break
    case 83 || 40:
      moveBackward()
      break
    case 81 || 37:
      turnLeft()
      break
    case 68 || 39:
      turnRight()
      break
    case 70:
      toggleFlashlight()
      break
    default:
      break
  }
}

speed.onchange = () => {
  socket.emit('emit_command', speed.value)
}
const toggleFlashlight = () => {
  socket.emit('emit_command', 'flashlight')
}
const moveForward = () => {
  socket.emit('emit_command', 'forward')
}
const moveBackward = () => {
  socket.emit('emit_command', 'backward')
}
const turnRight = () => {
  socket.emit('emit_command', 'turnRight')
}
const turnLeft = () => {
  socket.emit('emit_command', 'turnLeft')
}

socket.on('rover_measure', (data) => {
  mpu.innerHTML = data
})
socket.on('stream', (data) => {
  const arrayBuffer = data
  if (urlObject) {
    URL.revokeObjectURL(urlObject)
  }
  urlObject = URL.createObjectURL(new Blob([arrayBuffer]))
  img.src = urlObject
})

socket.on('Sensor', (data) => {
  mpu.innerHTML = data
})
// let detector

// function preload() {
//   detector = ml5.objectDetector('cocossd')
// }

// function gotDetections(error, results) {
//   if (error) {
//     console.error(error)
//   }
//   console.log(results)
//   for (let i = 0; i < results.length; i++) {
//     let object = results[i]
//     stroke(0, 255, 0)
//     strokeWeight(4)
//     noFill()
//     rect(object.x, object.y, object.width, object.height)
//     noStroke()
//     fill(255)
//     textSize(24)
//     text(object.label, object.x + 10, object.y + 24)
//   }
// }

// function setup() {
//   createCanvas(640, 480)
//   // console.log(detector);
//   image(img, 0, 0)
//   detector.detect(img, gotDetections)
// }
