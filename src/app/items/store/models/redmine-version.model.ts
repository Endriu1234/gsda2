export class RedmineVersion {
    public id: number;
    public name: string;
    public description: string;
    public project: string;
    public status: string;
    public due_date: Date;
    public sharing: string;
    public wiki_page_title: string;
    public created_on: Date;
    public updated_on: Date;

    constructor(id: number, name: string, description: string, project: string, status: string, due_date: Date, sharing: string, wiki_page_title: string, created_on: Date, updated_on: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.project = project;
        this.status = status;
        this.due_date = due_date;
        this.sharing = sharing;
        this.wiki_page_title = wiki_page_title;
        this.created_on = created_on;
        this.updated_on = updated_on;
    }
}