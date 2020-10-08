/**
 * Data structure for data returns to the REST API
 */
export default class UserReturnData {
    data: any;

    err_occur: boolean;

    err_reasons: Array<string>;

    scouters?: Array<any>;

    teams?: Array<any>;

    constructor() {
      this.err_occur = false;
      this.data = { value: {} };
      this.err_reasons = [];
    }
}
