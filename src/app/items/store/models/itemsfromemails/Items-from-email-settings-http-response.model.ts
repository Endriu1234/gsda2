export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public name: string;
    public active: boolean;
    public tracker: string;
    public project: string;
    public version: string;
    public user: string;
    public parsingMode: string;
    public findIssues: string;
    public findCRs: string;
    public addAttachments: boolean;
    public modifiedBy: string;

    constructor(
        success: boolean,
        errorMessage: string,
        name: string,
        active: boolean,
        tracker: string,
        project: string,
        version: string,
        user: string,
        parsingMode: string,
        findIssues: string,
        findCRs: string,
        addAttachments: boolean,
        modifiedBy: string) {

        this.success = success;
        this.errorMessage = errorMessage;
        this.name = name;
        this.active = active;
        this.tracker = tracker;
        this.project = project;
        this.version = version;
        this.user = user;
        this.parsingMode = parsingMode;
        this.findIssues = findIssues;
        this.findCRs = findCRs;
        this.addAttachments = addAttachments;
        this.modifiedBy = modifiedBy;
    }
}