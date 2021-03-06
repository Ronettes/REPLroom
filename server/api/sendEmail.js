const router = require('express').Router()
const nodemailer = require('nodemailer')
module.exports = router

router.post('/', async (req, res, next) => {
  const {firstName, email, url} = req.body
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'replroom@gmail.com',
        pass: 'replroom@2020',
      },
    })

    const mailOptions = {
      from: 'replroom@gmail.com',
      to: email,
      subject: 'Invitation from REPLroom',
      text: `Hello ${firstName}, \n Your friend invited you to join REPLroom for collaborative coding. \n Please go the url ${url} to join your friends and have a fun time coding!`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  } catch (error) {
    console.error(error)
  }
})
