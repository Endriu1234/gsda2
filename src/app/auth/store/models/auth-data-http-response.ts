export class AuthDataHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public token: string | null;
    public expiresIn: string | null;

    constructor(success: boolean, errorMessage: string, token: string | null, expiresIn: string | null) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.token = token;
        this.expiresIn = expiresIn;
    }
}