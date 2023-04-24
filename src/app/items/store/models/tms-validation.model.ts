export class TmsValidation {
    public tms: string;
    public valid: boolean;

    constructor(tms: string, valid: boolean) {
        this.tms = tms;
        this.valid = valid;
    }
}