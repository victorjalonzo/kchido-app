export class UserNotFoundException extends Error {
    constructor(){
        super('user not found')
    }
}