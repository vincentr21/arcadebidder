import { AuctionObject } from './AuctionObject';
import {Player} from './Player'

export interface EventDetails {
    player:Player,
    auctionItem:AuctionObject,
}