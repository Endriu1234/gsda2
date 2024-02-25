import * as _ from 'lodash';

export class UserPreferences {
    public formId: string;
    public user: string;
    public setupValues: {
        rememberProject: Boolean,
        rememberVersion: Boolean,
        rememberTracker: Boolean,
        rememberUser: Boolean
    };
    public currentValues: {
        project: String,
        version: String,
        tracker: String,
        user: String
    }

    constructor(
        formId: string,
        user: string,
        setupValues: { rememberProject: Boolean, rememberVersion: Boolean, rememberTracker: Boolean, rememberUser: Boolean },
        currentValues: { project: String, version: String, tracker: String, user: String }
        ) {

        this.formId = formId;
        this.user = user;
        this.setupValues = _.cloneDeep(setupValues); 
        this.currentValues = _.cloneDeep(currentValues);
    }

}