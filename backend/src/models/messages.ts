import { Message } from '../types'
import { client, subscriber } from './redis'

const MESSAGES_CHANNEL = 'messages'

export const send = (message: Message) => {
  client.PUBLISH(MESSAGES_CHANNEL, JSON.stringify(message))
}

export const subscribe = (cb: (message: Message) => void) => {
  subscriber.SUBSCRIBE(MESSAGES_CHANNEL, err => {
    if (err) return

    subscriber.on('message', (channel, message) => {
      if (channel !== MESSAGES_CHANNEL) return

      cb(JSON.parse(message))
    })
  })
}
