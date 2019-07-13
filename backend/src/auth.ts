import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { SECRET } from './config'
import { ErrorWithStatus } from './errors'
import * as users from './models/users'

export const loginHandler: RequestHandler = async (req, res, next) => {
  // Return an HTTP 401 and a message
  const authorizationError = (message: string) =>
    next(new ErrorWithStatus(message, 401))

  // Parse the HTTP Authorization header to get the encoded username & password
  const credentials = parseAuthorization(req.headers.authorization)

  if (!credentials) {
    res.set('WWW-Authenticate', 'Basic')
    return authorizationError('A valid Authorization header is required!')
  }

  const [username, password] = credentials

  if (await users.isUserLoggedIn(username)) {
    return authorizationError('Username is already taken')
  } else if (password !== 'chattie') {
    return authorizationError('Invalid credentials')
  }

  jwt.sign({ username }, SECRET, (err: Error, token: string) => {
    if (err) return next(new Error())

    res.json({ token })
  })
}

// Validate the HTTP Authorization header and return the credentials
const parseAuthorization: (
  authorization: string | undefined,
) => [string, string] | null = authorization => {
  // Ensure that the header is not empty and has two fields
  if (!authorization || authorization.split(' ').length !== 2) return null

  const [type, base64Credentials] = authorization.split(' ')

  // The authorization type should be "Basic"
  if (type !== 'Basic') return null

  // Ensure the credentials are Base64 encoded
  const credentialsBuf = Buffer.from(base64Credentials, 'base64')
  if (credentialsBuf.toString('base64') !== base64Credentials) return null

  // Decode the Base64 encoded credentials
  const credentials = credentialsBuf.toString('ascii')

  // Ensure the credentials are of the following form: `username:password`
  if (credentials.split(':').length !== 2) return null

  const [username, password] = credentials.split(':')

  return [username, password]
}
