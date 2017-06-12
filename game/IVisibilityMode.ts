import { AuctionObject } from './AuctionObject';
import { Player } from './Player';
import { IBid, IBidMode, IBidResult} from "./IBidMode";

// TODO
export interface IVisibilityMode {
	getRoundFinishData(players:Player[], bids:IBid[], result:IBidResult, obj:AuctionObject):IRoundFinishData,
	getPlayerData(players:Player[]):IPlayerData[],
}

export interface IRoundFinishData {
	playerData:IRoundFinishPlayerData[],
	winner:string, //ID to tie back to  player
	bid:number,
	item:AuctionObject, 		//IX CRED VALUE
}

export interface IRoundFinishPlayerData {
	name:string,
	bid:number,
	id:string
}


export interface IPlayerData {
	id:string,
	money:number,
	cred:number,
}

// How do i surpress this lol :joy:
export let GoogleVisibilityHandler:IVisibilityMode = {
	getRoundFinishData(players:Player[], bids:IBid[], result:IBidResult, obj:AuctionObject):IRoundFinishData {
		return {
			winner: result.bidIndex >=0 ? players[result.bidIndex].getID() : "0",
			item: obj,
		}
	},

	getPlayerData(players:Player[]):IPlayerData[] {
		var data = [];
		for (let player of players) {
			data.push({
				id: player.getID(),
				cred: player.getVictoryPts(),
			});
		}
		return data;
	}
}

export var StandardVisibilityHandler:IVisibilityMode = {
	getRoundFinishData(players:Player[], bids:IBid[], result:IBidResult, obj:AuctionObject):IRoundFinishData {
		
		let allPlayerData = [];

		for (let i = 0; i < players.length; i++) {
			let player = players[i];
			let bid = bids[i];
			if (bid == null) {
                bid = {bidTime:0, bidValue:0 }
            }
			let playerData:IRoundFinishPlayerData = {
				name: player.getUsername(),
				bid: bid.bidValue,
				id: player.getID()
			};
			allPlayerData.push(playerData);
		}
		
		let allData:IRoundFinishData = {
			playerData: allPlayerData,
			winner: result.bidIndex >=0 ? players[result.bidIndex].getID() : "0",
			item: obj,
			bid: result.bidValue,
		};
		// allData. = allPlayerData;
		// allData.winner = players[result.bidIndex].getID();
		// allData.value = obj.getValue();
		// allData.bid = result.bidValue();
		return allData;
	},

	getPlayerData(players:Player[]):IPlayerData[] {
		var data = [];
		for (let player of players) {
			data.push({
				id: player.getID(),
				cred: player.getVictoryPts(),
				money: player.getMoney(),
			});
		}
		return data;
	}
}