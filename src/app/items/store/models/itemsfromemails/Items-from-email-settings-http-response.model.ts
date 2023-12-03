export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public enabled: boolean;
    public tracker: string;
    public project: string;
    public user: string;

    constructor(success: boolean, errorMessage: string, enabled: boolean, tracker: string, project: string, user: string) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.enabled = enabled;
        this.tracker = tracker;
        this.project = project;
        this.user = user;
    }
}