export class CRValidation {
    public cr: string;
    public valid: boolean;

    constructor(cr: string, valid: boolean) {
        this.cr = cr;
        this.valid = valid;
    }
}