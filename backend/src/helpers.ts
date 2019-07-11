// Validate the HTTP Authorization header and return the credentials
export const parseAuthorization: (
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
