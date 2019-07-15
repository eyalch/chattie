import { client, subscriber } from './redis'

const USERS_SET = 'users'
const USERS_CHANNEL = 'users'

// Clear the users set
client.DEL(USERS_SET)

export const isUserLoggedIn: (
  username: string,
) => Promise<boolean> = username => {
  return new Promise((resolve, reject) => {
    client.SISMEMBER(USERS_SET, username, (err, isMember) => {
      if (err) reject(err)
      else resolve(Boolean(isMember))
    })
  })
}

const loginLogoutCallback = (err: Error | null) => {
  if (err) return

  // Get the users and publish them
  client.SMEMBERS(USERS_SET, (_err, users) => {
    if (!_err) client.PUBLISH(USERS_CHANNEL, JSON.stringify(users))
  })
}

export const login = (username: string) => {
  client.SADD(USERS_SET, username, loginLogoutCallback)
}

export const logout = (username: string) => {
  client.SREM(USERS_SET, username, loginLogoutCallback)
}

export const subscribe = (cb: (usernames: string) => void) => {
  subscriber.SUBSCRIBE(USERS_CHANNEL, err => {
    if (err) return

    subscriber.on('message', (channel, message) => {
      if (channel !== USERS_CHANNEL) return

      cb(message)
    })
  })
}
