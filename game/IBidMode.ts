import { Player } from './Player';


export interface IBid {
	bidTime: number,
	bidValue: number,
}

export interface IBidResult {
	bidValue:number,
	bidIndex:number,
}

export interface IBidMode {
	handleAuction(players:Player[], bids:IBid[]):IBidResult; //handles the bids for the round, returns winning index.
}

export var FirstPriceBidModeHandler:IBidMode = {
	handleAuction(players:Player[], bids:IBid[]):IBidResult {
		var highestIndex:number = -1;
		var highestVal:number = 0;
		var highestTime: number = 0;
		
		var index = 0;
		for (let bid of bids) {
			if (bid.bidValue > highestVal || bid.bidValue === highestVal && highestTime < bid.bidTime) {
				highestVal = bid.bidValue;
				highestIndex = index;
				highestTime = bid.bidTime;
			}
			index++;
		}

		if (highestIndex !== -1) {
			//Payment
			players[highestIndex].pay(highestVal);
		}
		return {bidValue: highestVal, bidIndex: highestIndex};
	}
}

export var HardcoreBidModeHandler:IBidMode = {
	handleAuction(players:Player[], bids:IBid[]):IBidResult {
		var highestIndex:number = -1;
		var highestVal:number = 0;
		var highestTime: number = 0;
		
		var index = 0;
		for (let bid of bids) {
			if (bid.bidValue > highestVal || bid.bidValue === highestVal && highestTime < bid.bidTime) {
				highestVal = bid.bidValue;
				highestIndex = index;
				highestTime = bid.bidTime;
			}
			//pay
			players[index].pay(bid.bidValue);
			index++;
		}
		return {bidValue: highestVal, bidIndex: highestIndex};
	}
}

export var SecondPriceBidModeHandler:IBidMode = {
	handleAuction(players:Player[], bids:IBid[]):IBidResult {
		var highestIndex:number = -1;
		var secondHighestVal:number = 0;
		var highestVal:number = 0;
		var highestTime: number = 0;
		
		var index = 0;
		for (let bid of bids) {
			if (bid.bidValue > highestVal || bid.bidValue === highestVal && highestTime < bid.bidTime) {
				secondHighestVal = highestVal;
				highestVal = bid.bidValue;
				highestIndex = index;
				highestTime = bid.bidTime;
			}
			index++;
		}
		var payment = Math.min(highestVal, secondHighestVal + 1);

		if (highestIndex !== -1) {
			//Payment
			players[highestIndex].pay(payment);
		}

		return {bidValue: payment, bidIndex: highestIndex};
	}
}