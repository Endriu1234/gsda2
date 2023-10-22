export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public enabled: boolean;
    public interval: number;

    constructor(success: boolean, errorMessage: string, enabled: boolean, interval: number) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.enabled = enabled;
        this.interval = interval;
    }
}