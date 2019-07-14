import { ErrorRequestHandler } from 'express'
import { STATUS_CODES } from 'http'

export class CustomError extends Error {
  statusCode: number
  code: number

  constructor(message?: string, statusCode: number = 500, key: number = -1) {
    super(message)

    this.statusCode = statusCode
    this.code = key
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | CustomError,
  req,
  res,
  next,
) => {
  // If provided, use the message, otherwise use HTTP 500 message
  const message = err.message || (STATUS_CODES[500] as string)

  // If provided, use the status code, otherwise use 500
  let statusCode = 500
  let code = -1
  if (err instanceof CustomError) {
    statusCode = err.statusCode
    code = err.code
  }

  if (statusCode === 500) {
    console.error(err.message, err.stack)
  }

  res
    .status(statusCode)
    .send({ error: message, ...(code !== -1 ? { code } : {}) })
}
