import {Player} from './Player'
import {EventDetails} from './EventDetails'
import {Campaign} from './Campaign'
import {AuctionObject} from './AuctionObject'
import {IReq} from './Requirement'
import {GameEvent} from './GameEvent'

//TBH I DONT NEED THIS RIGHT
export interface IAbility {
    onEvent(ev:GameEvent, evDetails:EventDetails);
    modifyValue(campaign:Campaign, auctionItem:AuctionObject):IReq; // Returns IReq of modification Ex. {red + 1, blue + 0, green +0 } etc.
    isPermanent():boolean;
    setOwner(player:Player): void;
    getName():string;
}

//This was supposed to be an adaptor class, impls methods + 
export abstract class Ability implements IAbility {
    protected owner:Player;
    protected name:string;
    constructor(name:string){this.name = name}

    setOwner(player:Player): void {
        this.owner = player;
    };
    getName(){
        return this.name;
    }

    modifyValue(campaign:Campaign, auctionItem:AuctionObject):IReq {
        return {
            red:0,
            blue:0,
            green:0
        };
    }
    onEvent(ev:GameEvent,evDetails:EventDetails) {

    }
    isPermanent():boolean {
        return false;
    }
}

export class TestSeasonStartAbility extends Ability  {
    onEvent(ev:GameEvent, evDetails:EventDetails) {
        if (ev == GameEvent.SEASON_START) {
             this.owner.addMoney(10);
        }
    }
}

export class TestGiveMoreRedAbility extends Ability  {
    modifyValue(campaign:Campaign, auctionItem:AuctionObject):IReq {
        return {
            red: auctionItem.getValue().red > 0 ? 1 : 0, 
            blue:0,
            green:0
        };
    }
    isPermanent():boolean {
        return true;
    }
}