import {Player} from './Player'
import {EventDetails} from './EventDetails'
// TODO DECIDE ON HOW TO HANDLE ONEVENT

export interface IAbility {
    onEvent(ev:GameEvent, evDetails:EventDetails);
    isPermanent():boolean;
    setOwner(player:Player): void;
    getName():string;
}


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

    abstract onEvent(ev:GameEvent,evDetails:EventDetails);
    abstract isPermanent():boolean;
}

export class TestSeasonStartAbility extends Ability  {
    onEvent(ev:GameEvent, evDetails:EventDetails) {
        if (ev == GameEvent.SEASON_START) {
             this.owner.addMoney(10);
        }
    }
    isPermanent():boolean {
        return false;
    }
}