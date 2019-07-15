// TODO: Find a way to have the types in one file instead of
// one file for backend and one for frontend

export interface User {
  username: string
}

export interface Message {
  sender: string
  recipient: string
  text: string
  timestamp: string
}

export enum LoginError {
  UsernameTaken,
  InvalidCredentials,
}
