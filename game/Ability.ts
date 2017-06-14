import {Player} from './Player'

// TODO DECIDE ON HOW TO HANDLE ONEVENT

export interface IAbility {
    onEvent();
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

    abstract onEvent();
    abstract isPermanent():boolean;
}

export class TestAbility extends Ability  {
    onEvent() {
        this.owner.addMoney(10);
    }
    isPermanent():boolean {
        return false;
    }
}