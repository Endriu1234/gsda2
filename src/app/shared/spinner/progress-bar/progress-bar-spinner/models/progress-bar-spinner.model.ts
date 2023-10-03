export class ProgressBarSpinner {
    public value: number;
    public label: string;
    public behaviourSubjectState: string;
    public showCancel: boolean;

    constructor(value: number, label: string, behaviourSubjectState: string, showCancel: boolean = true) {
        this.value = value;
        this.label = label;
        this.behaviourSubjectState = behaviourSubjectState;
        this.showCancel = showCancel;
    }
}