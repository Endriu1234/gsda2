export class Item {
    public cr_id: string;
    public issue_id: string;
    public item_description: string;
    public item_summary: string;
    public tms_id: string;
    public tracker: string;
    public cr_est_hours: string;

    constructor(cr_id: string, issue_id: string, item_description: string, item_summary: string, tms_id: string, tracker: string, cr_est_hours: string) {
        this.cr_id = cr_id;
        this.issue_id = issue_id;
        this.item_description = item_description;
        this.item_summary = item_summary;
        this.tms_id = tms_id;
        this.tracker = tracker;
        this.cr_est_hours = cr_est_hours;
    }
}