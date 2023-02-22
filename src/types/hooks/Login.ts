export interface IAuthLoginResult {
    status: boolean
    data: {
        id: string
        UserName: string
        FirstName: string
        LastName: string
        token: string
    }
    message: string
}