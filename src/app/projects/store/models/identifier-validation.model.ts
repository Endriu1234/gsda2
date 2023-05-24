export class IdentifierValidation {
    public identifier: string;
    public valid: boolean;

    constructor(identifier: string, valid: boolean) {
        this.identifier = identifier;
        this.valid = valid;
    }
}