# REPLroom

A real-time coding and whiteboarding environment designed for collaborative development and remote interviewing.

## Features

REPLroom features a code sandbox where you can work with others to write and evaluate Javascript code. To facilitate collaboration, the app also includes a whiteboard space to diagram ideas, as well as text and video chat components all built into the same platform.

## Tech Stack

REPLroom utilizes Socket.IO (a library built on Web Sockets), which enables users of the application to receive changes made to a specific "room" in real time. In addition to broadcasting all changes made within a room's REPL, whiteboard, and chat components immediately, Socket.IO was also used to incorporate a series of user-friendly notifications into the app, that alert members of a room as soon as a new person enters, when someone is currently typing within the REPL, and also when someone enters a new text message into the chat window.

The frontend design of each room was built using React, while libraries such as React-CodeMirror2, HTML Canvas and Konva, and OpenTok were used to build out the REPL, whiteboard, and video chat components respectively. When users click on the "Run" button of the application to evaluate the code they have written, the content within the REPL is converted to string and passed to a separate thread using the Web Worker API, as to not affect the functionality of the main application.

Once the code is passed to the Web Worker, it is evaluated using the Esprima and Escodegen libraries, which both serve to parse and recompile ECMAScript using syntax trees.

### The REPL

- **CodeMirror**

Users interact with the REPL by typing code into a text editor. Both this editor, as well as the console output below it, are [CodeMirror][codeMirrorLink] components imported via [`react-codemirror2`][reactCM2link]. Options and styles are set for each CodeMirror independently to control properties, such as syntax highlighting, line numbers, and whether the Mirror is writeable or read-only, among other things.

After a user writes their code and hits the 'Run' button, the click-handler captures the user's code currently stored on State, and passes it to a parsing function.

[codeMirrorLink]: https://codemirror.net/
[reactCM2link]: https://github.com/scniro/react-codemirror2

- **Esprima**

We expect JavaScript to be entered into our REPL, but it's still necessary to pass the user's code through a JavaScript parsing function in order to capture the outputs a user would expect from a Node terminal. In reality, everything is happening in the browser.

So, before the code can be evaluated by our Web Worker, we generate a Syntax Tree from the user's code using [Esprima][esprimaLink]. With the tree in hand, the parsing function looks for any expression statements the user has inputed and transforms the final statement (if not a console log) into a console log so that our Web Worker can then capture it's value in an output stream.

[esprimaLink]: https://esprima.org/

- **Escodegen**

Now, the parsed Syntax Tree must be transformed back into JavaScript. [Escodegen][escodegenLink] accomplishes this for us. Thus, our parsing function, which takes in the user's JavaScript, also returns JavaScript.

[escodegenLink]: https://github.com/estools/escodegen

- **Web Worker**

Now, after the code is parsed, we send the parsed code to [WebWorker][webworkerlink]. Web worker is a process that executes the code seperately from the main thread. We used WebWorker to run the code as it runs as a seperate thread in the background and does not affect the main thread and the main thread can continue working as normal. Once the web worker is done running the code, it sends the result back to the main thread where it is stored in the local state and then displayed on terminal. Main thread and web worker communicated through messages.

[webworkerlink]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

### Video Call

To provide a more seamless experience we incorportated video call so that the user get a better experience in the virtual scenario. All the people in the same virtual room can connect through video call.

- **OpenTok**

To build video calling feature we used [OpenTok][opentoklink] which is built on [WebRTC][webrtclink]. WebRTC is a JavaScript specification that allows real-time communication between web broswers. We chose OpenTok to build our video call as it allows rapid development. To use OpenTok, you need to configure settings in the OpenTokAPI and then embed the generated URL in your web application.

[opentoklink]: https://www.vonage.com/communications-apis/campaigns/tokbox-is-now-vonage-apis/?utm_source=google-paid-search&utm_medium=cpc&utm_content=OpenTok_Exact&utm_term=opentok&utm_campaign=AMER-Brand-OpenTok-Exact&CMP=OBR-VONAGE-API-PFX-GOO-AMER-BRAND-OPENTOK-EXACT&pi_ad_id=430477772841&keyword=opentok&device=c&matchtype=e&network=g&ca.kw=opentok&ca.mt=e&ca.network=g&cb.device=c&ca.cr=430477772841&ca.target=kwd-305272246216&ca.pos=&ca.ref=Google&adtest=&gclid=CjwKCAjw8df2BRA3EiwAvfZWaEp3vkKpqh8v98qGruHBPakIowej0YFPlICnmRLvgueC7mpSgQK3zxoCuHsQAvD_BwE&gclsrc=aw.ds
[webrtclink]: https://webrtc.org/

### Chat

- **Socket.IO**

User can chat to the people in the same virtual room. To allow real time transmission of chat messages we heavily used [Socket.IO][socketlink]. It is a fullstack library that allows real-time, bidirectional, event based communication between client and the server. Unlike HTTP, server can also initiate a call in Socket.IO. As the user types in the chat box, the message is captured in the local state. After that, he can press `send` button or hit enter to send his message. As soon the user performs either of the two actions, an event based transmission is initiated from the front-end. That event is read at the backend by sockets, it indentifies the room id from where the chat was initiated and then initate another event to broadcast the messge in the same virtual room. Front-end reads the event from backend and then displays the messge to all the people in that room. It was essential to check the room from where the chat is initiated as there can be multiple rooms open at the same time and we want to broadcast the chat message only to the room it belongs to.

[socketlink]: https://socket.io/

### Whiteboard

A dynamic whiteboard shares screen space with our REPL, and can take up more or less of the screen thanks to the [React Split Pane][rspLink] component, which allows panes to be resized by dragging their edges.

[rspLink]: https://www.npmjs.com/package/react-split-pane

- **Konva**

The [Konva][konvaLink] framework, along with [React-Konva][reactKonvaLink], provide robust libraries needed for rendering HTML5 Canvas elements in a React frontend. React-Konva furnishes us with React Component wrappers for the Stage and Layer (which abstract the Canvas context), as well as Ellipses, Rectangles and Trasformers that provide draggable, configurable bounds. Pure Konva is necessary for responding to free-drawing events.

[konvaLink]: https://konvajs.org/
[reactKonvaLink]: https://github.com/konvajs/react-konva

Get started coding together in [REPLroom][replroomlink]!

[replroomlink]: https://replroom.herokuapp.com/

