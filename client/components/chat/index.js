import React, {Component} from 'react'
//import io from 'socket.io-client'
import socket from '../../socket'
import './index.css'

class Chat extends Component {
  constructor(props) {
    super()
    this.state = {
      chatOpen: false,
      message: '',
      broadcastedMsg: [],
      newMsg: false,
    }

    //this.socket = io(window.location.origin)

    const room = props.roomId
    socket.emit('connectToRoom', {name: props.userName, roomId: room})

    socket.emit('new-user-joined', {name: props.userName, roomId: room})

    socket.on('chat-message', (data) => {
      if (!this.state.chatOpen) {
        this.setState({
          newMsg: true,
        })
      }
      this.setState({
        broadcastedMsg: [
          ...this.state.broadcastedMsg,
          {message: data.message, name: data.name},
        ],
      })
    })
  }

  handleChat = () => {
    socket.emit('send-chat-message', {
      message: this.state.message,
      roomId: this.props.roomId,
    })
    this.setState({
      message: '',
    })
    // this.setState({
    //   message: '',
    //   broadcastedMsg: [
    //     ...this.state.broadcastedMsg,
    //     {message: this.state.message, name: this.props.userName},
    //   ],
    // })
  }

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    })
  }

  handleChatWindow = () => {
    this.setState({
      chatOpen: !this.state.chatOpen,
    })
    if (this.state.newMsg && this.state.chatOpen) {
      this.setState({
        newMsg: false,
      })
    }
  }

  handleSendMessage = (e) => {
    if (e.key === 'Enter') {
      this.handleChat()
    }
  }

  render() {
    return (
      <div className="chat-pop">
        {this.state.newMsg &&
          !this.state.chatOpen &&
          console.log('new message!!!!!!!!!')}
        {this.state.chatOpen && (
          <div className="chat-window">
            <div className="text-area">
              {this.state.broadcastedMsg.map((item, index) => {
                return (
                  <div key={index}>
                    <span className="chat-name">{`${
                      item.name.charAt(0).toUpperCase() + item.name.slice(1)
                    }`}</span>
                    <span>{`:${item.message}`}</span>
                  </div>
                )
              })}
            </div>
            <div className="msg-input-bar">
              <input
                type="text"
                placeholder="Type your message here"
                value={this.state.message}
                onChange={this.handleChange}
                onKeyDown={this.handleSendMessage}
                autoFocus
              />
              <button type="button" onClick={this.handleChat}>
                {' '}
                Send{' '}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="chat-open-button"
          onClick={this.handleChatWindow}
        >
          {this.state.newMsg && !this.state.chatOpen ? (
            <div>
              <span className="dot"></span>
              <div>
                <img src="/replChat.png"></img>
              </div>
            </div>
          ) : (
            <img src="/replChat.png"></img>
          )}
        </button>
      </div>
    )
  }
}

export default Chat
