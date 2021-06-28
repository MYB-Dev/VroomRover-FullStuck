const socketIO = (server, wss, option) => {
  const io = require('socket.io')(server, option)

  io.on('connection', (socket) => {
    console.log(`made socket connection with id: ${socket.id}`)

    socket.on('detectObj', (raw) => {
      const data = JSON.parse(raw)
      socket.broadcast.emit('sensor', data)
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
