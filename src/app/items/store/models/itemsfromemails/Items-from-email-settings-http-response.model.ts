import { ItemsFromEmailsSettings } from "./items-from-emails-settings.model";

export class ItemsFromEmailSettingsHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public records: ItemsFromEmailsSettings[];

    constructor(
        success: boolean,
        errorMessage: string,
        records: ItemsFromEmailsSettings[]) {

        this.success = success;
        this.errorMessage = errorMessage;
        this.records = records;;
    }
}