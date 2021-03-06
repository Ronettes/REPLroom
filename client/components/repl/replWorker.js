const Worker = () => {
  self.onmessage = function (e) {
    let outputStream = ''
    console.log = function () {
      //check if Array.isArray and JSON.stringify it
      outputStream += '  <  '
      for (let i = 0; i < arguments.length; i++) {
        outputStream += JSON.stringify(arguments[i])
        outputStream += ' '
      }
      outputStream += '\n'
    }

    let code = e.data

    let func = new Function('return ' + code)()

    try {
      func()
    } catch (err) {
      outputStream += '  <  '
      outputStream += err.name
      outputStream += ': ' + err.message
      outputStream += '\n'
    }
    self.postMessage(outputStream)
  }
}
let code = Worker.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})
const workerScript = URL.createObjectURL(blob)

export default workerScript
