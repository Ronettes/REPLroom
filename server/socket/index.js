module.exports = (io) => {
  const users = {}

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('new-user-joined', (name) => {
      users[socket.id] = name
    }) //Might not be needed

    socket.on('send-chat-message', (data) => {
      socket
        .to(data.roomId)
        .emit('chat-message', {message: data.message, name: users[socket.id]})
      //UPDATE NAME VALUE W NEW DB OBJECT
    })

    socket.on('connectToRoom', (data) => {
      console.log(data, 'CONNECTED TO ROOM')
      if (data.name && data.roomId) {
        //just in case

        socket.join(data.roomId)

        // console.log(io.clients(data.roomId), "IM SOCKET CLIENT")

        if (!users[data.roomId]) {
          users[data.roomId] = {}
        }

        users[data.roomId][socket.id] = data.name

        console.log(Object.values(users[data.roomId]), 'THE USERS')

        io.sockets
          .in(data.roomId)
          .emit('user joined room', Object.values(users[data.roomId]))

        io.sockets
          .in(data.roomId)
          .emit('load users', Object.values(users[data.roomId]))

        io.sockets.in(data.roomId).emit('load code')
      }
    })

    socket.on('send users', (data) => {
      console.log(data, 'GOT USERS')
      io.sockets.in(data.roomId).emit('receive users', data.users)
    })

    socket.on('send code', (data) => {
      console.log(data, 'GOT CODE')
      io.sockets.in(data.roomId).emit('receive code for all', data.code)
    })

    socket.on('coding event', (data) => {
      console.log('updated code', data)
      io.sockets.in(data.roomId).emit('updating code', data.code)
    })

    socket.on('result event', (data) => {
      io.sockets.in(data.roomId).emit('updating result', data.result)
    })

    socket.on('leave room', (data) => {
      io.sockets.in(data.roomId).emit('user left room', {user: data.user})
      // delete users[data.roomId][socket.id]
      socket.leave(data.room)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
