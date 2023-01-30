export class RedmineUser {
    public id: number;
    public login: string;
    public firstname: string;
    public lastname: string;
    public name: string;

    constructor(id: number, login: string, firstname: string, lastname: string, name: string) {
        this.id = id;
        this.login = login;
        this.firstname = firstname;
        this.lastname = lastname;
        this.name = name;
    }
}