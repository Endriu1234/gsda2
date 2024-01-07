export class FileToUpload {
    public file: File;
    public isUploadInProgress: boolean;
    public upload_error: string;
    public upload_success: boolean;
    public id: number;

    constructor(file: File, isUploadInProgress: boolean, upload_error: string, upload_success: boolean, id: number) {
        this.file = file;
        this.isUploadInProgress = isUploadInProgress;
        this.upload_error = upload_error;
        this.upload_success = upload_success;
        this.id = id;
    }
}
