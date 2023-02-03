import { RedmineUser } from "./redmine-user.model"

export type RedmineUsersFilter = {
    filter: null | string | RedmineUser;
}