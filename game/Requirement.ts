export interface IReq {
    red:number
    blue:number
    green:number
}
export class Requirement {
    reqs: IReq
    completed:IReq

    constructor(req:IReq) {
        this.reqs = req;
        this.completed = {red:0, blue:0, green:0}
    }

    public subtract(objValue:IReq) {
        this.completed.red += objValue.red;
        this.completed.green += objValue.green;
        this.completed.blue += objValue.blue;
    }
    public isComplete():boolean {
        for (let property in this.reqs) {
            if (this.reqs.hasOwnProperty(property)) {
                if (this.reqs[property] - this.completed[property] > 0) {
                    return false;
                } 
            }
        }
        return true;
    }
}