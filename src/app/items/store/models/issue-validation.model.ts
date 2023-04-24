export class IssueValidation {
    public issue: string;
    public valid: boolean;

    constructor(issue: string, valid: boolean) {
        this.issue = issue;
        this.valid = valid;
    }
}