import { UserPreferences } from "./userPreferences.model";

export class UserPreferencesHttpResponse {
    public success: boolean;
    public errorMessage: string;
    public records: UserPreferences;

    constructor(
        success: boolean,
        errorMessage: string,
        records: UserPreferences) {

        this.success = success;
        this.errorMessage = errorMessage;
        this.records = records;
    }
}