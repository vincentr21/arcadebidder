import {Requirement, IReq} from './Requirement'
import { AuctionObject } from './AuctionObject';
import {Ability} from './Ability'
export class Campaign {
    req:Requirement
    completeValue:number
    failValue:number
    
    name:string
    desc:string
    id:string //Some id instead of number is better.

    objs:AuctionObject[];
    modifiedVals:IReq[]; //TODO GROUP THESE TWO

    completed:boolean;
    victoryPts:number;
    successAbilities:Ability[];
    failureAbilities:Ability[];

    constructor(req:Requirement, cValue:number, fValue:number, vp:number, sAbilities:Ability[], fAbilities:Ability[]) {
        this.req = req
        this.completeValue = cValue
        this.failValue = fValue
        this.id = this.generateRandomString();
        this.name = this.generateRandomString();
        this.objs = [];
        this.completed = false;
        this.victoryPts = vp;
        this.successAbilities = sAbilities;
        this.failureAbilities = fAbilities;
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
    public assignObj(obj:AuctionObject, modifiedValue:IReq):boolean {
        this.objs.push(obj);
        this.modifiedVals.push(modifiedValue);
        
        this.req.subtract(modifiedValue);
        if (!this.completed && this.req.isComplete()) {
            this.completed = true;
            return true;
        }
        return false;
    }

    public isComplete() {
        return this.completed;
    }

    public getSuccessAbilities():Ability[] {
        return this.successAbilities;
    }

    public getFailureAbilities():Ability[] {
        return this.failureAbilities;
    }

    public getFailureValue():number {
        return -this.failValue;
    }
}