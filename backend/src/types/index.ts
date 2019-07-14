export interface User {
  username: string
}

export enum LoginError {
  UsernameTaken,
  InvalidCredentials,
}
