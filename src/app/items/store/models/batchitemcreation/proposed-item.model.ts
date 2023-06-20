export class ProposedItem {
    public SELECTED: boolean;
    public REDMINE_PROJECT: string;
    public TRACKER: string;
    public SUBJECT: string;
    public DESCRIPTION: string;
    public ISSUE: string;
    public CR: string;
    public TMS: string;
    public ASSIGNEE: string;

    constructor(SELECTED: boolean, REDMINE_PROJECT: string, TRACKER: string, SUBJECT: string, DESCRIPTION: string, ISSUE: string, CR: string, TMS: string, ASSIGNEE: string) {
        this.SELECTED = SELECTED;
        this.REDMINE_PROJECT = REDMINE_PROJECT;
        this.TRACKER = TRACKER;
        this.SUBJECT = SUBJECT;
        this.DESCRIPTION = DESCRIPTION;
        this.ISSUE = ISSUE;
        this.CR = CR;
        this.TMS = TMS;
        this.ASSIGNEE = ASSIGNEE;
    }

    public Compare(otherProposedItem: ProposedItem): boolean {
        return this.SUBJECT === otherProposedItem.SUBJECT
            && this.DESCRIPTION === otherProposedItem.DESCRIPTION
            && this.ISSUE === otherProposedItem.ISSUE
            && this.CR === otherProposedItem.CR
            && this.TMS === otherProposedItem.TMS
            && this.ASSIGNEE === otherProposedItem.ASSIGNEE
            && this.TRACKER === otherProposedItem.TRACKER;
    }
}

