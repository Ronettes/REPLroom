import React, {Component} from 'react'
import './index.css'

class VideoChat extends Component {
  constructor() {
    super()
    this.state = {
      videoOpen: false,
    }
  }

  handleVideo = () => {
    this.setState({
      videoOpen: !this.state.videoOpen,
    })
  }

  render() {
    return (
      <div className="video">
        {this.state.videoOpen && (
          <div className="">
            <iframe
              src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=e32408e5-28ff-4a88-aa49-bc63b9f55745&room=${this.props.roomName}&iframe=true`}
              width="400px"
              height="300px"
              scrolling="auto"
              allow="microphone; camera"
            ></iframe>
          </div>
        )}
        <div className="video-button">
          <button
            type="button"
            className="video-button"
            onClick={this.handleVideo}
          >
            <img src="../videoChatNew.png"></img>
          </button>
        </div>
      </div>
    )
  }
}

// const VideoChat = (props) => {
//   console.log('PROPS', props)
//   // let roomId = props.match.params.roomId
//   handleVideo = () => {}
//   return (
//     <div>
//       {/* <NavLink to="/roomId/1"> */}
//       <iframe
//         src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=e32408e5-28ff-4a88-aa49-bc63b9f55745&room=${props.roomId}&iframe=true`}
//         width="400px"
//         height="300px"
//         scrolling="auto"
//         allow="microphone; camera"
//       ></iframe>
//       {/* </NavLink> */}
//       <button type="button" className="video-button" onClick={handleVideo}>
//         Video Chat
//       </button>
//     </div>
//   )
// }

export default VideoChat
