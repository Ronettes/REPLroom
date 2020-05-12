import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      roomName: '',
    }
  }

  generateRoomName = () => {
    return Math.random().toString(36).substring(7)
  }
  createRoom = (event) => {
    event.preventDefault()
    this.setState({[event.target.name]: this.generateRoomName()})
  }

  joinRoom = (event) => {
    event.preventDefault()
    console.log(
      'NAME: ',
      this.state.name,
      'ROOM: ',
      this.state.roomName,
      'PROPS: ',
      this.props
    )
  }
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }
  render() {
    const {name, roomName} = this.state
    return (
      <div>
        <form>
          <label htmlFor="name">Name:</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="name"
            name="name"
            value={name}
          />
          <label htmlFor="name">Room:</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="room"
            name="roomName"
            value={roomName}
          />
          <br />

          <input
            onClick={this.joinRoom}
            type="submit"
            value="Join Room"
          ></input>
          <Link to={`/${roomName}`}>Link Test</Link>
        </form>
        <hr />
      </div>
    )
  }
}
export default HomePage
