export class UserNotFoundException extends Error {
    constructor(){
        super('user not found')
    }
}

export class PasswordMismatchException extends Error {
    constructor() {
      super('Current password does not match')
    }
  }