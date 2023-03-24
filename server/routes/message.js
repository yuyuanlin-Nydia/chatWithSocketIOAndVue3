import express from 'express'
import { Message } from '../models/message.js'

export const messageRouter = express.Router()

messageRouter.post('/message/addMessage', async (req, res) => {
  try {
    const msgText = await Message.create(req.body)
    res.status(201).send({
      success: true,
      message: {
        msgText
      }
    })
  } catch (err) {
    console.log(err)
  }
})
