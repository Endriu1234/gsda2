import { ProposedItem } from "./proposed-item.model";

export class BatchItemSearchHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public records: ProposedItem[];

    constructor(success: boolean, errorMessage: string, records: ProposedItem[]) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.records = records;
    }
}