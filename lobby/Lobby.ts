import {Game} from '../game/Game'
export class Lobby {
	static roomList = []

	// constructor(){
	// 	Lobby.roomList = []
	// }

	static addRoom(room:Room):void{
		Lobby.roomList.push(room)
	}

	static removeRoom(room:Room):void{
		for (let i=0; i< Lobby.roomList.length; ++i){
			if (Lobby.roomList[i].id === room.id){
				Lobby.roomList.splice(i, 1)
				break
			}
		}

	}

	static hasRoom(roomID:number):boolean{
		for (let room of Lobby.roomList){
			// this caused me a headache, fking A, i'll just use == for now
			// console.log("checking for room id truth")
			// console.log(typeof(room.id))
			// console.log(typeof(roomID))
			// console.log(room.id === roomID)
			// console.log(room.id == roomID)
			if (room.id == roomID){
				return true
			}
		}
		return false
	}

	static getRoom(roomID:number):Room{
		for (let room of Lobby.roomList){
			if (room.id == roomID){
				return room
			}
		}
		return null
	}

	static getSimpleLobbyList():object{
		let simpleLobbyList = []
		for (let room of Lobby.roomList){
			simpleLobbyList.push({
				id: room.id,
				playersInRoom: room.playerList.length,
				playersMax: Room.MAX_PLAYERS_IN_ROOM,
			})
		}

		return simpleLobbyList
	}

}

export class User {
	username: string
	uniqueID: string
	socket: object
	currentRoom: Room

	constructor(socket:object, uniqueID:string){
		this.username = 'peter chao WHOA'
		this.uniqueID = uniqueID
		this.socket = socket
		this.currentRoom = null
	}

}


export class Room {
	static MAX_PLAYERS_IN_ROOM = 8

	id:number
    playerList:User[]
	gameMap:object
	gameObject:Game

	constructor(roomId:number){
		this.id = roomId

		this.playerList = []

		this.gameMap = {
				startingMoney:100,
				objectValues:[3,7,10],
				bidMode:0,
				visibilityMode:0,
				maxCountdownSec:3,
		}

		this.gameObject = null

	}

	addPlayer(player:User):void{
		this.playerList.push(player)
	}

	removePlayer(player:User):void{
		for (let i=0; i< this.playerList.length; ++i){
			if (this.playerList[i].uniqueID === player.uniqueID){
				this.playerList.splice(i, 1)
				break
			}
		}
	}

	getPlayerList():object[]{
		let myList = []
		for (let user of this.playerList){
			myList.push(user.uniqueID)
		}

		return myList
	}


	getPlayerListForGame():object[]{
		let myList = []
		for (let user of this.playerList){
			myList.push({
				username: user.username,
				uniqueID: user.uniqueID,
				socket: user.socket,	
			})
		}

		return myList
	}

	getSimplePlayerList():object{
		let simplePlayerList = []
		for (let user of this.playerList){
			simplePlayerList.push({
				uniqueID: user.uniqueID,
				username: user.username,
			})
		}

		return simplePlayerList
	}

	isFull():boolean{
		if (this.playerList.length >= 8)
			return true
		else
			return false
	}

	isEmpty():boolean{
		if (this.playerList.length == 0)
			return true
		else
			return false
	}

}

// constructor(socketHandler:IOSocketHandler, config:IGameMap, lobbyID:string, joinedPlayers:INewPlayer[]) {

// interface IGameMap {
// 	startingMoney:number;
// 	objectValues:number[];
// 	bidHandler:IBidMode;
// 	observerHandler:IVisibilityMode;
// 	maxCountdownSec:number;
// }

// class Lobby {
// 	private config:IGameMap;
// 	private lobbyID:string;
// 	private joinedPlayers:string[]; // Their player IDs

// 	constructor() {

// 	}

// 	joinGame(playerID:string):void {
// 		this.joinedPlayers.push(playerID);
// 	}
// }