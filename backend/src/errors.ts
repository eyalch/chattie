import { ErrorRequestHandler } from 'express'
import { STATUS_CODES } from 'http'

export class ErrorWithStatus extends Error {
  statusCode: number

  constructor(message?: string, statusCode: number = 500) {
    super(message)

    this.statusCode = statusCode
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | ErrorWithStatus,
  req,
  res,
  next,
) => {
  // If provided, use the message, otherwise use HTTP 500 message
  const message = err.message || (STATUS_CODES[500] as string)

  // If provided, use the status code, otherwise use 500
  const statusCode = err instanceof ErrorWithStatus ? err.statusCode : 500

  if (statusCode === 500) {
    console.error(err.message, err.stack)
  }

  res.status(statusCode).send({ error: message })
}
