import { RedmineUser } from "./redmine-user.model"
import * as _ from 'lodash';

export class RedmineUserByLetter {
    public letter: string;
    public redmineUsers: RedmineUser[];

    constructor(letter: string, redmineUsers: RedmineUser[]) {
        this.letter = letter;
        this.redmineUsers = _.cloneDeep(redmineUsers);
    }
}