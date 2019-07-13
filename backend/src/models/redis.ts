import { createClient as _createClient } from 'redis'

const { REDIS_URL } = process.env

const createClient = () =>
  REDIS_URL ? _createClient(REDIS_URL) : _createClient()

export const client = createClient()
export const subscriber = createClient()
