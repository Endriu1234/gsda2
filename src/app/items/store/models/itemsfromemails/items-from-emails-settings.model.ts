export class ItemsFromEmailsSettings {
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