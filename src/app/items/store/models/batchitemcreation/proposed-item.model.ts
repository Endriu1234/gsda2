export class ProposedItem {
    public REDMINE_PROJECT: string;
    public TRACKER: string;
    public SUBJECT: string;
    public DESCRIPTION: string;
    public ISSUE: string;
    public CR: string;
    public TMS: string;
    public ASSIGNEE: string;

    constructor(REDMINE_PROJECT: string, TRACKER: string, SUBJECT: string, DESCRIPTION: string, ISSUE: string, CR: string, TMS: string, ASSIGNEE: string) {
        this.REDMINE_PROJECT = REDMINE_PROJECT;
        this.TRACKER = TRACKER;
        this.SUBJECT = SUBJECT;
        this.DESCRIPTION = DESCRIPTION;
        this.ISSUE = ISSUE;
        this.CR = CR;
        this.TMS = TMS;
        this.ASSIGNEE = ASSIGNEE;
    }
}