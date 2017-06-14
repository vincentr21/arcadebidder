import { AuctionObject } from './AuctionObject';
import {Campaign} from './Campaign'
import {Requirement} from './Requirement'
import {IAbility} from './Ability'
export class Player {
	private money:number;
	private victoryPts:number;
	private username:string;
	private id:string;
	private wonObjects:AuctionObject[];
	private socket:object;
	private campaigns:Campaign[];
	private abilities:IAbility[];

	constructor (uniqueID:string, name:string, money:number, socket:object) {
		this.username = name;
		this.id = uniqueID;
		this.victoryPts = 0;
		this.money = money;
		this.socket = socket;
		this.abilities = [];
		this.reset();
	}

	public reset() {
		this.wonObjects = [];
		this.campaigns = [];
		for(var i = this.abilities.length - 1; i >= 0 ; i--){
			if(!this.abilities[i].isPermanent()){
				this.abilities.splice(i, 1);
			}
		}
	}

	public addVP(vp:number) {
		this.victoryPts += vp;
	}

	public addMoney(money:number) {
		this.money += money;
	}

	getID():string {
		return this.id;
	}
	getUsername():string {
		return this.username;
	}
	getMoney():number {
		return this.money;
	}
	pay(payment:number):void {
		this.money -= payment;
	}
	addObject(obj:AuctionObject):void {
		this.wonObjects.push(obj);
		//this.victoryPts += obj.getValue();
	}

	addAbility(ability:IAbility) {
		this.abilities.push(ability);
	}

	canPay(bid:number):boolean {
		return this.money >= bid;
	}

	getVictoryPts():number {
		return this.victoryPts;
	}
	getWonObjects():AuctionObject[] {
		return this.wonObjects;
	}

	getSocket():object {
		return this.socket;
	}

	addCampaign(c:Campaign):void {
		this.campaigns.push(c);
	}

	getCampaigns():Campaign[] {
		return this.campaigns;
	}
}