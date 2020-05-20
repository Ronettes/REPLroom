module.exports = (io) => {
  //Data objects for Firestore once we migrate to Firebase:
  const users = {}
  const whiteboard = {}

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`)

    socket.on('new-user-joined', (data) => {
      if (!users[data.roomId]) {
        users[data.roomId] = {}
      }

      users[data.roomId][socket.id] = data.name

      //need this?
      if (!whiteboard[data.roomId]) {
        whiteboard[data.roomId] = {
          lines: [],
          rectangles: [],
          cirlces: [],
        }
      }
    })

    socket.on('send-chat-message', (data) => {
      socket.to(data.roomId).emit('chat-message', {
        message: data.message,
        name: users[data.roomId][socket.id],
      })
    })

    socket.on('connectToRoom', (data) => {
      if (data.name && data.roomId) {
        socket.join(data.roomId)

        //Setting users obj to store roomId & name
        if (!users[data.roomId]) {
          users[data.roomId] = {}
        }

        users[data.roomId][socket.id] = data.name

        if (!whiteboard[data.roomId]) {
          whiteboard[data.roomId] = {
            lines: [],
            rectangles: [],
            cirlces: [],
          }
        }

        //Emits for Room Component
        io.sockets
          .in(data.roomId)
          .emit('user joined room', Object.values(users[data.roomId]))

        io.sockets
          .in(data.roomId)
          .emit('load users', Object.values(users[data.roomId]))

        //Emits for Repl Component
        io.sockets.in(data.roomId).emit('load code')

        io.sockets.in(data.roomId).emit('load result')

        //Emit for Whiteboard Component
        io.to(socket.id).emit('draw whiteboard', whiteboard[data.roomId])
      }
    })

    socket.on('send users', (data) => {
      io.sockets.in(data.roomId).emit('receive users', data.users)
    })

    socket.on('send code', (data) => {
      io.sockets.in(data.roomId).emit('receive code for all', data.code)
    })

    socket.on('send result', (data) => {
      io.sockets.in(data.roomId).emit('receive result for all', data.result)
    })

    socket.on('coding event', (data) => {
      io.sockets.in(data.roomId).emit('updating code', {
        code: data.code,
        name: users[data.roomId][socket.id],
      })
    })

    //Whiteboard Events
    socket.on('add line', (data) => {
      whiteboard[data.roomId].lines = data.allLines
      io.in(data.roomId).emit('new line', whiteboard[data.roomId].lines) //data.allLines)
    })

    socket.on('add rect', (data) => {
      socket.to(data.roomId).emit('new rect', data.rect)
    })

    socket.on('add circ', (data) => {
      socket.to(data.roomId).emit('new circ', data.circ)
    })

    socket.on('update circs', (data) => {
      whiteboard[data.roomId].circles = data.circs
      socket.to(data.roomId).emit('draw circs', data.circs)
    })

    socket.on('update rects', (data) => {
      whiteboard[data.roomId].rectangles = data.rects
      socket.to(data.roomId).emit('draw rects', data.rects)
    })
    //End whiteboard events

    socket.on('result event', (data) => {
      io.sockets.in(data.roomId).emit('updating result', data.result)
    })

    socket.on('stop typing', (roomId) => {
      io.sockets.in(roomId).emit('update typing name')
    })

    const getRoomId = (socketId) => {
      let roomId = ''
      Object.entries(users).find(([key, value]) => {
        if (value[socketId]) {
          roomId = key
        }
      })
      return roomId
    }

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)

      let roomId = getRoomId(socket.id)
      if (roomId) {
        delete users[roomId][socket.id]

        let remainingUsers = Object.values(users[roomId])

        io.sockets
          .in(roomId)
          .emit('user left room', {users: remainingUsers, roomId: roomId})
      }

      socket.leave(roomId)
    })
  })
}
