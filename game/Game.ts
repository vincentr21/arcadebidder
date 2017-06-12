import { IBid, IBidMode, FirstPriceBidModeHandler, SecondPriceBidModeHandler, HardcoreBidModeHandler} from "./IBidMode";
import { Player } from './Player';
import { AuctionObject } from './AuctionObject';
import { IVisibilityMode, GoogleVisibilityHandler, StandardVisibilityHandler } from './IVisibilityMode'
import {VISIBILITY_MODE_STANDARD, VISIBILITY_MODE_GOOGLE, BID_MODE_FIRST, BID_MODE_SECOND, BID_MODE_HARDCORE} from './GameConstants'
import {IOSocketHandler} from './IOSocketHandler'
import {Campaign} from './Campaign'
import {Requirement, IReq} from './Requirement'

export interface INewPlayer {
	username: string,
	uniqueID: string,
	socket: object,
}

export interface IAuctionItem {
	name : string,
	desc :string,
	url:string,
	val: IReq,
}

export class Game {
	
	// // CREATING GAME ROOM/LOBBY
	// private startingMoney:number;
	// private objectValues:number[];
	private bidHandler:IBidMode;
	private visibilityHandler:IVisibilityMode;
	// private observerHandler:IVisibilityMode;

	private lobbyID:string; // Used for socket?
	// private joinedPlayers:string[]; // Their player IDs
	//Game details
	private players:Player[];
	private currentRound:number;
	private AuctionObjects:AuctionObject[];

	//Round details.
	private maxBidTimeMS = 15000;
	private playerBids:IBid[];
	private acceptingBids:boolean;
	private countdownTimerID:number;
	private NEXT_ROUND_DELAY_MS = 7500;
	private socketHandler:IOSocketHandler;

	private NUM_RANDOM_CAMPAIGNS = 10;
	private campaigns:Campaign[];
	private playerCampaignStatuses:boolean[];	// False == still bidding, true = passed.
	private currentPlayerCampaignSelect:number;
	
	private season = 0;
	private MAX_SEASON = 3;

	constructor(socketHandler:IOSocketHandler, config:IGameMap, lobbyID:string, joinedPlayers:INewPlayer[]) {
		this.lobbyID = lobbyID;
		this.maxBidTimeMS = config.maxCountdownSec * 1000;
		this.socketHandler = socketHandler;
		this.players = [];
		this.AuctionObjects = [];
		this.playerBids = [];
		

		//Get bid mode from config game map
		if (config.bidMode === BID_MODE_FIRST) {
			this.bidHandler = FirstPriceBidModeHandler;
		} else if (config.bidMode === BID_MODE_SECOND) {
			this.bidHandler = SecondPriceBidModeHandler;
		} else if (config.bidMode === BID_MODE_HARDCORE) {
			this.bidHandler = HardcoreBidModeHandler;
		} else {
			this.bidHandler = FirstPriceBidModeHandler;
			console.log("what the invalid bid mode");
		}

		if (config.visibilityMode === VISIBILITY_MODE_STANDARD) {
			this.visibilityHandler = StandardVisibilityHandler;
		} else if (config.visibilityMode === VISIBILITY_MODE_GOOGLE) {
			this.visibilityHandler = GoogleVisibilityHandler;
		} else {
			this.visibilityHandler = StandardVisibilityHandler;
			console.log("invalid visibility mode");
		}

		this.currentRound = 0;
		for (let val of config.objectValues) {
			this.AuctionObjects.push(this.generateAuctionObj(val));
		}

		for (let playerData of joinedPlayers) {
			this.players.push(new Player(playerData.uniqueID, playerData.username, config.startingMoney, playerData.socket));
		}
		this.socketHandler.emitPlayerDataUpdate(this.lobbyID, this.visibilityHandler.getPlayerData(this.players));

		//this.beginCampaignRound(0);
		this.beginSeason();
	}

	private beginSeason() {
		if (this.season == this.MAX_SEASON) {
			this.finishGame();
			return;
		}
		this.beginCampaignRound(0);
	}

	private finishSeason() {
		// TODO PUNISH CAMPAIGN FAILURES
		this.beginSeason();
	}

	private beginCampaignRound(currentPlayerCampaignSelect:number) {
		this.campaigns = [];
		this.playerCampaignStatuses = [];
		this.currentPlayerCampaignSelect = currentPlayerCampaignSelect; // Maybe smarter logic.

		for (var i = 0; i < this.players.length; i++) {
			this.playerCampaignStatuses.push(false);
		}

		for (var i = 0; i < this.NUM_RANDOM_CAMPAIGNS; i++) {
			this.campaigns.push(this.generateRandomCampaign()) 
		}
		//Emit start.
	}

	private endCampaignRound() {
		this.beginAuctionRound();
	}

	private findCampaignAndRemove(campaignID:string):Campaign {
		
		for (var i = 0; i < this.campaigns.length; i++) {
			let campaign = this.campaigns[i];
			if (campaign.getID() === campaignID) {
				this.campaigns.splice(i, 1);
				return campaign;
			}
		}
		return undefined;
	}
	private findNextCampaignSelector() {
	
		// Start on next player (i=1)
		for (var i = 1; i <= this.players.length; i++) {
			this.currentPlayerCampaignSelect = (this.currentPlayerCampaignSelect + 1) % this.players.length
			if (this.playerCampaignStatuses[this.currentPlayerCampaignSelect]) {
				return;
			}
		}
	}

	private allPlayersPassedCampaigns():boolean {
		for (let passed of this.playerCampaignStatuses) {
			if (!passed) {
				return false;
			}
		}
		return true;
	}
	private generateRandomCampaign():Campaign {
		return new Campaign(this.generateRandomRequirement(), 5, 5, 5);
	}

	private generateRandomRequirement():Requirement {
		return new Requirement({red:5,blue:5,green:5})
	}
	private generateAuctionObj(aItem:IAuctionItem):AuctionObject {
		//Pick from random stuff in config?. TODO
		return new AuctionObject(aItem.val, aItem.name, aItem.desc, aItem.url);
	}

	//Round setup========================================
	private nextAuctionRound():void {
		this.currentRound++;
		if (this.currentRound >= this.AuctionObjects.length) {
			this.finishSeason();
			return;
		}
		this.beginAuctionRound();
	}

	private beginAuctionRound():void {
		var currentObj = this.AuctionObjects[this.currentRound];
		this.resetBids();
		
		this.socketHandler.emitRoundBegin(this.lobbyID, currentObj, this.maxBidTimeMS);
		//Start countdown
		var roundID = this.currentRound;
		var tempThis = this;
		this.countdownTimerID = setTimeout(function() {
			//Be extra safe? Timeout expires before everyone has bid!
			if (tempThis.currentRound == roundID && tempThis.acceptingBids) {
				console.log("round timeout")
				tempThis.finishAuctionRound();
			}
		}, this.maxBidTimeMS);
	}
	
	private resetBids():void {
		this.playerBids = [];
		for (var i = 0; i < this.players.length; i++) {
			this.playerBids.push(null)
		}
		this.acceptingBids = true;
	}

	private hasAllPlayersBid():boolean {
		for (var i = 0; i < this.players.length; i++) {
			if (this.playerBids[i] === null) {
				return false;
			}
		}
		return true;
	}

	private getPlayerIndex(playerID:string):number {
		var index = 0;
		for (let player of this.players) {
			if (player.getID() === playerID) {
				return index;
			}
			index++;
		}
		return -1;
	}

	//TODO MODIFY THIS TO EMIT PLAYER TO ASSIGN CAMPAIGN
	private finishAuctionRound():void {
		this.acceptingBids = false;
		clearTimeout(this.countdownTimerID);
		
		var index = 0;
		for (let bid of this.playerBids) {
			if (bid == null) {
				this.playerBids[index] = {
					bidTime:0,
					bidValue:0,
				};
			}
			index++;
		}
		var bidResult = this.bidHandler.handleAuction(this.players, this.playerBids);
		if (bidResult.bidIndex !== -1) {
			this.players[bidResult.bidIndex].addObject(this.AuctionObjects[this.currentRound]);
		}         
		                                              
		console.log(JSON.stringify(bidResult));
		
		this.socketHandler.emitRoundFinish(this.lobbyID, this.visibilityHandler.getRoundFinishData(this.players, this.playerBids, bidResult, this.AuctionObjects[this.currentRound]));
		this.socketHandler.emitPlayerDataUpdate(this.lobbyID, this.visibilityHandler.getPlayerData(this.players));
		//Delay + next round UPDATE UI?
		var tempThis = this;
		setTimeout(function(){
			tempThis.nextAuctionRound();
		}, this.NEXT_ROUND_DELAY_MS)
	}

	// THE END============================
	finishGame():void {
		var winnerIndex:number = this.getWinner();	
		var player = this.players[winnerIndex];

		this.socketHandler.emitWinner(this.lobbyID, {
			name: player.getUsername(),
			id: player.getID(),
			objs: player.getWonObjects(),
			score: player.getVictoryPts(),
			remainingMoney: player.getMoney()		
		})
	}

	// TODO HANDLE TIES?
	private getWinner():number {
		var highestVal = -1;
		var highestIndex = -1;
		var index = 0;
		for (let player of this.players) {
			var vp = player.getVictoryPts();
			if (vp > highestVal) {
				highestVal = vp
				highestIndex = index;  
			}
			index++;
		}
		return highestIndex;
	}




	// Outside Interface.
	public onPlayerBid(playerID:string, bidValue:number):void {
		var index:number = this.getPlayerIndex(playerID);
		if (index != -1) {
			var player:Player = this.players[index];
			if (!this.acceptingBids) {
				this.socketHandler.emitBidFailure(player.getSocket(), "ERROR:Bid past timeout.");
				return;
			}
			if (typeof bidValue !== "number") {
				this.socketHandler.emitBidFailure(player.getSocket(), "ERROR:Invalid bid amount.");
				return;
			}

			console.log("bid accepted " + index + " bid valuye " + bidValue);
			if (player.canPay(bidValue)) {
				this.playerBids[index] = {bidTime:Date.now(), bidValue: bidValue};
				this.socketHandler.emitBidSuccess(player.getSocket());
			} else {
				this.socketHandler.emitBidFailure(player.getSocket(), "ERROR:Invalid bid amount.");
				return;
			}
	
			if (this.hasAllPlayersBid()) {
				this.finishAuctionRound();
			}
		} else {
			console.log("?????? who are you???")
		}
	}


	public onPlayerCampaignSelect(playerID:string, campaignId:string) {
		var index:number = this.getPlayerIndex(playerID);
		//TODO 
		
		if (index != -1) {
			//Verify right turn.
			if (this.currentPlayerCampaignSelect == index) {
				//Assign campaign
				var campaign:Campaign = this.findCampaignAndRemove(campaignId);
				if (campaign == undefined) {
					console.log("campaign not found");
					return;
				}
				this.players[index].addCampaign(campaign);
				
				if (this.campaigns.length == 0) {
					this.endCampaignRound();
				}
				this.findNextCampaignSelector();

			} else {
				console.log("NOT YOUR TURN");
			}			
		} else {
			console.log("?????? who are you???")
		}
	}


	public onPlayerCampaignPass(playerID:string) {
		//Emit
		//TODO split this check + set to other bool fcn.
		var index:number = this.getPlayerIndex(playerID);
		if (index != -1) {
			if (this.currentPlayerCampaignSelect == index) {
				//Assign campaign
				var player = this.players[index];
				if (player.getCampaigns().length == 0) {
					console.log("CANT HAVE 0 CAMPAIGNS");
					return;
				}

				this.playerCampaignStatuses[index] = true;
				if (this.allPlayersPassedCampaigns()) {
					this.endCampaignRound();
				}
			} else {
				console.log("NOT YOUR TURN");
			}			
		} else {
			console.log("?????? who are you???")
		}
	}

	public onPlayerAssignToCampaign(playerID:string, campaignId:string) {
		var index:number = this.getPlayerIndex(playerID);
		if (index != -1) {
			var player = this.players[index];
			var campaigns:Campaign[] = player.getCampaigns();
			var i = 0;
			for (; i < campaigns.length; i++) {
				let campaign = campaigns[i];
				if (campaign.getID() === campaignId) {
					break;
				} 
			}
			//Found
			if (i != campaigns.length) {
				let campaign = campaigns[i];
				var currentObj = this.AuctionObjects[this.currentRound];
				if(campaign.assignObj(currentObj)) {
					this.resolveCampaign(player, campaign, currentObj);
				}
			}
		} 
	}

	private resolveCampaign(player:Player, campaign:Campaign, obj:AuctionObject) {
		player.addMoney(campaign.getSuccessValue());
		player.addVP(campaign.getVP());
	}
}