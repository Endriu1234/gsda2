export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public enabled: boolean;
    public tracker: string;

    constructor(success: boolean, errorMessage: string, enabled: boolean, tracker: string) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.enabled = enabled;
        this.tracker = tracker;
    }
}