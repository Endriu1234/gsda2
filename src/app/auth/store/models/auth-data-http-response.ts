export class AuthDataHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public user: string | null;
    public token: string | null;
    public expiresIn: string | null;

    constructor(success: boolean, errorMessage: string, user: string | null, token: string | null, expiresIn: string | null) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.user = user;
        this.token = token;
        this.expiresIn = expiresIn;
    }
}