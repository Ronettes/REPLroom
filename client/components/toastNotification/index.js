import React from 'react'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const ToastNotification = (props) => {
  const {body, setShow, show} = props
  return (
    <div className="toast-container">
      <Toast onClose={() => setShow(false)} show={show} delay={2000} autohide>
        <Toast.Header>Email Confirmation</Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    </div>
  )
}

export default ToastNotification