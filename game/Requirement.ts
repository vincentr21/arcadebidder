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

export function addIReqs(ireq1:IReq, ireq2:IReq):IReq {
    return {
        red:ireq1.red + ireq2.red,
        blue:ireq1.blue + ireq2.blue,
        green:ireq1.green + ireq2.green,
    };
}
export function zeroOut(ir:IReq):IReq {
    return {
        red:Math.max(0, ir.red),
        blue:Math.max(0, ir.blue),
        green:Math.max(0, ir.green),
    }
}