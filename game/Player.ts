import { AuctionObject } from './AuctionObject';
import {Campaign} from './Campaign'
import {Requirement} from './Requirement'
export class Player {
	private money:number;
	private victoryPts:number;
	private username:string;
	private id:string;
	private wonObjects:AuctionObject[];
	private socket:object;
	private campaigns:Campaign[];

	constructor (uniqueID:string, name:string, money:number, socket:object) {
		this.username = name;
		this.id = uniqueID;
		this.victoryPts = 0;
		this.money = money;
		this.socket = socket;
		this.reset();
	}

	public reset() {
		this.wonObjects = [];
		this.campaigns = []
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