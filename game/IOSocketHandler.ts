
import { AuctionObject } from './AuctionObject';
import { EMIT_BID_RESPONSE_FAIL, EMIT_BID_RESPONSE_SUCCESS, EMIT_GAME_OVER, EMIT_ROUND_BEGIN, EMIT_PLAYER_UPDATE, EMIT_ROUND_FINISH } from './EmitConstants';
import { IPlayerData, IRoundFinishData} from './IVisibilityMode'
export interface IEmitWinner {
    name:string,
    objs:AuctionObject[],
    score:number,
    id:string,
    remainingMoney:number,  //Probably should have this for google style
}

export class IOSocketHandler {

    io:object; // TODO
    constructor(io:object) {
        this.io = io;
        //io.on() ... new game
        //io.on... onPlayerBid
    }   

    
    public emitWinner(lobbyID:string, winnerData:IEmitWinner):void {
        this.io.emit(EMIT_GAME_OVER, JSON.stringify(winnerData));
    }

    public emitRoundBegin(lobbyID:string, currentObj: AuctionObject, countdownMS :number) :void {
        this.io.emit(EMIT_ROUND_BEGIN, JSON.stringify({auctionObj: currentObj, countdownMS: countdownMS}));
    }


    // Broadcast?
    public emitBidSuccess(bidderSocket:object) :void {
        bidderSocket.emit(EMIT_BID_RESPONSE_SUCCESS, {"status":"ok", "message":"Bid accepted."});
    }

    // Only emit back to player?
    public emitBidFailure(bidderSocket:object, reason:string) :void {
        bidderSocket.emit(EMIT_BID_RESPONSE_FAIL, {"status":"notok", "message":reason});
    }

    // These two are affected by visibility mode.
    public emitPlayerDataUpdate(lobbyID:string, data:IPlayerData[]):void {
        this.io.emit(EMIT_PLAYER_UPDATE, JSON.stringify(data));
    }

    public emitRoundFinish(lobbyID:string, roundData:IRoundFinishData): void {
        this.io.emit(EMIT_ROUND_FINISH, JSON.stringify(roundData));
    }

}