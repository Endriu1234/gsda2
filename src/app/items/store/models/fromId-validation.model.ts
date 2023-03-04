export class FromIdValidation {
    public id: string;
    public valid: boolean;

    constructor(id: string, valid: boolean) {
        this.id = id;
        this.valid = valid;
    }
}