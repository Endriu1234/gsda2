

export class SDQueriesSearchHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public records: any[];
    public columns: any[];

    constructor(success: boolean, errorMessage: string, records: any[], columns: string[]) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.records = records;
        this.columns = columns;
    }
}