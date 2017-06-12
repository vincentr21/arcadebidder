import {Requirement} from './Requirement'
import { AuctionObject } from './AuctionObject';

export class Campaign {
    req:Requirement
    completeValue:number
    failValue:number
    
    name:string
    desc:string
    id:string //Some id instead of number is better.
    objs:AuctionObject[];
    completed:boolean;
    victoryPts:number;

    constructor(req:Requirement, cValue:number, fValue:number, vp:number) {
        this.req = req
        this.completeValue = cValue
        this.failValue = fValue
        this.id = this.generateRandomString();
        this.name = this.generateRandomString();
        this.objs = [];
        this.completed = false;
        this.victoryPts = vp;
    }

    private generateRandomString():string {
        return "lol";
    }
    public getID():string {
        return this.id;
    }
    public getSuccessValue():number {
        return this.completeValue;
    }

    public getVP():number {
        return this.victoryPts;
    }
    // IGNORE OVERFLOW FOR NOW
    //return true for just completed,false otherwise
    public assignObj(obj:AuctionObject):boolean {
        this.objs.push(obj);
        this.req.subtract(obj.getValue());
        if (!this.completed && this.req.isComplete()) {
            this.completed = true;
            return true;
        }
        return false;
    }

    public isComplete() {
        return this.completed;
    }
}