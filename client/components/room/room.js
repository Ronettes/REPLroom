import React, {Component} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import {Modal} from 'react-bootstrap'
import RoomNav from './roomNav'
import Repl from '../repl/repl'
import Whiteboard from '../whiteboard/whiteboard'
import VideoChat from '../video-chat'
import Chat from '../chat'
//SOCKET
import socket from '../../socket'
import 'bootstrap/dist/css/bootstrap.min.css'
//ToastNotification
import ToastNotification from '../toastNotification'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      currentUser: this.props.location.state
        ? this.props.location.state.name
        : '',
      newUser: '',
      roomId: this.props.match.params.roomId,
      show: false,
      width: '50%', //width of left pane
    }
  }

  componentDidMount() {
    if (this.state.currentUser && this.state.roomId) {
      socket.emit('connectToRoom', {
        name: this.state.currentUser,
        roomId: this.state.roomId,
      })
    }

    socket.on('load users', () => {
      this.sendUsers()
    })

    socket.on('user joined room', (data) => {
      this.joinUser(data)
    })

    socket.on('receive users', (users) => {
      this.updateUsersForAll(users)
    })

    socket.on('user left room', (data) => {
      this.updateUsersForAll(data.users)
    })
  }

  setShow = (val) => {
    this.setState({
      show: val,
    })
  }

  joinUser = (data) => {
    this.setState({
      users: data.users,
      newUser: data.name,
      show: true,
    })
  }

  updateUsersForAll = (users) => {
    this.setState({users: users})
  }

  sendUsers = () => {
    this.state.users && this.state.users.length
      ? socket.emit('send users', {
          roomId: this.state.roomId,
          users: this.state.users,
        })
      : socket.emit('send users', {
          roomId: this.state.roomId,
        })
  }

  handleEnteredName = () => {
    let name = this.textInput.value.trim()
    if (name) {
      this.setState({
        currentUser: this.textInput.value,
      })
      socket.emit('connectToRoom', {
        name: this.textInput.value,
        roomId: this.state.roomId,
      })
    }
  }

  handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleEnteredName()
    }
  }

  render() {
    return (
      <div className="room">
        <ToastNotification
          header="Notification"
          body={`${this.state.newUser} has joined the room!`}
          show={this.state.show}
          setShow={this.setShow}
        />
        <RoomNav
          roomId={this.props.match.params.roomId}
          users={this.state.users}
        />
        {!this.state.currentUser && (
          <div>
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={!this.state.currentUser}
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Please enter your name to proceed
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                  <div className="input-bar">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      ref={(input) => (this.textInput = input)}
                      onKeyDown={this.handleEnterKeyPress}
                    ></input>
                  </div>
                  <button type="button" onClick={this.handleEnteredName}>
                    {' '}
                    Enter Name{' '}
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        )}
        <SplitPane
          split="vertical"
          minSize={5}
          maxSize={-5}
          defaultSize={this.state.width}
        >
          <Repl
            code={this.state.code}
            result={this.state.result}
            updateResult={this.updateResult}
            updateCode={this.updateCodeInState}
          />
          <Pane className="pane whiteboardPane">
            <Whiteboard roomId={this.props.match.params.roomId} />
          </Pane>
        </SplitPane>
        <VideoChat roomId={this.state.roomId} />
        <Chat roomId={this.state.roomId} userName={this.state.currentUser} />
      </div>
    )
  }
}
