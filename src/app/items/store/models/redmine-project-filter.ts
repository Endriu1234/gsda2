import { RedmineProject } from "./redmine-project.model"

export type RedmineProjectsFilter = {
    filter: null | string | RedmineProject;
}