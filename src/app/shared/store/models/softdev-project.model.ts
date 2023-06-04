export class SoftDevProject {
    public PRODUCT_VERSION_ID: number;
    public PRODUCT_VERSION_NAME: string;
    public PROJECT_NAME: string;
    public PRODUCT_BRANCH: string;
    public PRODUCT_RELEASE_CANDIDATE: string;
    public PRODUCT_DEV_START: string;
    public PRODUCT_DEV_END: string;
    public PRODUCT_TEST_START: string;
    public PRODUCT_TEST_END: string;
    public PRODUCT_DELIVERY_DATE: string;
    public PRODUCT_TESTING_MGR: string;
    public PRODUCT_PROGRAMMING_MGR: string;
    public PRODUCT_PROJECT_MGR: string;

    constructor(
        PRODUCT_VERSION_ID: number,
        PRODUCT_VERSION_NAME: string,
        PROJECT_NAME: string,
        PRODUCT_BRANCH: string,
        PRODUCT_RELEASE_CANDIDATE: string,
        PRODUCT_DEV_START: string,
        PRODUCT_DEV_END: string,
        PRODUCT_TEST_START: string,
        PRODUCT_TEST_END: string,
        PRODUCT_DELIVERY_DATE: string,
        PRODUCT_TESTING_MGR: string,
        PRODUCT_PROGRAMMING_MGR: string,
        PRODUCT_PROJECT_MGR: string) {

        this.PRODUCT_VERSION_ID = PRODUCT_VERSION_ID;
        this.PRODUCT_VERSION_NAME = PRODUCT_VERSION_NAME;
        this.PROJECT_NAME = PROJECT_NAME;
        this.PRODUCT_BRANCH = PRODUCT_BRANCH;
        this.PRODUCT_RELEASE_CANDIDATE = PRODUCT_RELEASE_CANDIDATE;
        this.PRODUCT_DEV_START = PRODUCT_DEV_START;
        this.PRODUCT_DEV_END = PRODUCT_DEV_END;
        this.PRODUCT_TEST_START = PRODUCT_TEST_START;
        this.PRODUCT_TEST_END = PRODUCT_TEST_END;
        this.PRODUCT_DELIVERY_DATE = PRODUCT_DELIVERY_DATE;
        this.PRODUCT_TESTING_MGR = PRODUCT_TESTING_MGR;
        this.PRODUCT_PROGRAMMING_MGR = PRODUCT_PROGRAMMING_MGR;
        this.PRODUCT_PROJECT_MGR = PRODUCT_PROJECT_MGR;
    }
}