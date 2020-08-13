/**
 * Is a data structure for data returns
 */
export default class UserReturnData {
    data: any;

    err_occur: boolean;

    err_reasons: Array<string>

    constructor() {
      this.err_occur = false;
      this.data = { value: {} };
      this.err_reasons = [];
    }
}
