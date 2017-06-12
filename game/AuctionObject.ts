import {IReq} from './Requirement'

interface IAffinity {
	corp: object,	//companies?
	demo: object,	//m/f age?
	type: object,	//luxury, clothing, food etc?
}

export class AuctionObject {
	private value:IReq;
	private image:string;
	private name:string;
	private desc:string;
	private affinity:IAffinity;

	constructor (value:IReq, name:string, desc:string, image:string) {
		this.value = value;
		this.image = image;
		this.name = name;
		this.desc = desc;
	}

	public getValue():IReq {
		return this.value;
	}

	//gets image string url.
	public getImage():string {
		return this.image;
	}
	public getName():string {
		return this.name;
	}
	public getDesc():string {
		return this.desc;
	}
}