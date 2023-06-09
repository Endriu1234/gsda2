export class BatchItemSearchHttpResponse {
    public success: boolean;
    public errorMessage: string;

    constructor(success: boolean, errorMessage: string) {
        this.success = success;
        this.errorMessage = errorMessage;
    }
}