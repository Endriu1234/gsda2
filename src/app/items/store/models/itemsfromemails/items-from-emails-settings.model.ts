export class ItemsFromEmailsSettings {
    public name: string;
    public active: boolean;
    public type: string;
    public tracker: string;
    public project: string;
    public version: string;
    public user: string;
    public parsingMode: string;
    public findIssues: string;
    public findCRs: string;
    public addAttachments: boolean;
    public closeItemsAfterAttach: string;
    public sendAttachResultTo: string;
    public modifiedBy: string;

    constructor(
        name: string,
        active: boolean,
        type: string,
        tracker: string,
        project: string,
        version: string,
        user: string,
        parsingMode: string,
        findIssues: string,
        findCRs: string,
        addAttachments: boolean,
        closeItemsAfterAttach: string,
        sendAttachResultTo: string,
        modifiedBy: string) {

        this.name = name;
        this.active = active;
        this.type = type;
        this.tracker = tracker;
        this.project = project;
        this.version = version;
        this.user = user;
        this.parsingMode = parsingMode;
        this.findIssues = findIssues;
        this.findCRs = findCRs;
        this.addAttachments = addAttachments;
        this.closeItemsAfterAttach = closeItemsAfterAttach;
        this.sendAttachResultTo = sendAttachResultTo;
        this.modifiedBy = modifiedBy;
    }

}