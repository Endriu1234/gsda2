export class TmsClient {
    public TMS_CLIENT: string;
    public TMS_CLIENT_FULLNAME: string;

    constructor(
        TMS_CLIENT: string,
        TMS_CLIENT_FULLNAME: string) {

        this.TMS_CLIENT = TMS_CLIENT;
        this.TMS_CLIENT_FULLNAME = TMS_CLIENT_FULLNAME;
    }
}