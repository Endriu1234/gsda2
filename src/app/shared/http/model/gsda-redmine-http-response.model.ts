export class GsdaRedmineHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public redmineLink: string;

    constructor(success: boolean, errorMessage: string, redmineLink: string) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.redmineLink = redmineLink;
    }
}