import React from 'react'
const io = require('socket.io-client')
const socket = io()
import Codemirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      guestList: [],
    }
  }

  updateCodeInState = (newText) => {
    this.setState({code: newText})
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'monokai',
    }

    return (
      <div>
        <Codemirror
          value={this.state.code}
          onChange={this.updateCodeInState}
          options={options}
        />
      </div>
    )
  }
}

export default Room
