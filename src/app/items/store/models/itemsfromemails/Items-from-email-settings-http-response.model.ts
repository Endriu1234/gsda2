export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public active: boolean;
    public tracker: string;
    public project: string;
    public version: string;
    public user: string;
    public parsingMode: string;
    public addAttachments: boolean;
    public modifiedBy: string;

    constructor(
        success: boolean,
        errorMessage: string,
        active: boolean,
        tracker: string,
        project: string,
        version: string,
        user: string,
        parsingMode: string,
        addAttachments: boolean,
        modifiedBy: string) {

        this.success = success;
        this.errorMessage = errorMessage;
        this.active = active;
        this.tracker = tracker;
        this.project = project;
        this.version = version;
        this.user = user;
        this.parsingMode = parsingMode;
        this.addAttachments = addAttachments;
        this.modifiedBy = modifiedBy;
    }
}