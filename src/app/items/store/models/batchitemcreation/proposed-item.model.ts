export class ProposedItem {
    public SELECTED: boolean;
    public REDMINE_PROJECT: string;
    public TRACKER: string;
    public STATUS: string;
    public SUBJECT: string;
    public DESCRIPTION: string;
    public ISSUE: string;
    public CR: string;
    public TMS: string;
    public ASSIGNEE: string;
    public REDMINE_LINK: string;
    public REDMINE_VERSION: string;
    public CR_EST_HOURS: string;

    constructor(SELECTED: boolean, REDMINE_PROJECT: string, TRACKER: string, STATUS: string, SUBJECT: string, DESCRIPTION: string, ISSUE: string,
        CR: string, TMS: string, ASSIGNEE: string, REDMINE_LINK: string, REDMINE_VERSION: string, CR_EST_HOURS: string) {
        this.SELECTED = SELECTED;
        this.REDMINE_PROJECT = REDMINE_PROJECT;
        this.TRACKER = TRACKER;
        this.STATUS = STATUS;
        this.SUBJECT = SUBJECT;
        this.DESCRIPTION = DESCRIPTION;
        this.ISSUE = ISSUE;
        this.CR = CR;
        this.TMS = TMS;
        this.ASSIGNEE = ASSIGNEE;
        this.REDMINE_LINK = REDMINE_LINK;
        this.REDMINE_VERSION = REDMINE_VERSION;
        this.CR_EST_HOURS = CR_EST_HOURS;
    }

}

