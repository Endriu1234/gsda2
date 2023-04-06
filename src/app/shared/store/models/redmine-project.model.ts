export class RedmineProject {
    public id: number;
    public name: string;
    public identifier: string;
    public description: string;

    constructor(id: number, name: string, identifier: string, description: string) {
        this.id = id;
        this.name = name;
        this.identifier = identifier;
        this.description = description;
    }
}