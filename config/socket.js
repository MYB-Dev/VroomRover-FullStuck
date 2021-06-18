const socketIO = (server, wss, option) => {
  const io = require('socket.io')(server, option)

  io.on('connection', (socket) => {
    console.log(`made socket connection with id: ${socket.id}`)

    socket.on('mpu_measure', (raw) => {
      const data = JSON.stringify(raw)
      console.log(data)
      socket.broadcast.emit('rover_measure', data)
    })
    socket.on('emit_command', (raw) => {
      socket.broadcast.emit('command_rover', raw)
      console.log(raw)
    })

    wss.on('connection', (ws) => {
      console.log('connected!')
      ws.on('message', (data) => {
        socket.emit('stream', data)
      })
    })
  })
}
module.exports = socketIO
