var io;
// var socket;

var Game = require('./game/Game');
var Lobby = require('./lobby/Lobby')
var ioss = require('./game/IOSocketHandler')
var fs = require('fs')



/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param io The Socket.IO library
 * @param socket The socket object for the connected client.
 */
// exports.initGame = function(sio, socket){
exports.initGame = function(sio, socket){
    io = sio
    // io = sio;
    // gameSocket = socket;
    // gameSocket.emit('connected', { message: "You are connected!" });

    socket.user = new Lobby.User(socket, socket.id)

    socket.emit('connected', {socketID: socket.id});
    socket.emit('lobbySync', Lobby.Lobby.getSimpleLobbyList())




    // log(socket.user)
    // initial settings
    // socket.nickname = "peter chao"


/* *******************************
   *                             *
   *       LOBBY BINDINGS        *
   *                             *
   ******************************* */
    // Lobby Events

    socket.on('changeUsername', changeUsername)


    // on the landing page, emitted by the client
    socket.on('createNewRoom', createNewRoom)
    socket.on('joinRoom', playerJoinRoom )
    socket.on('debug', debug )

    
    // inside the room, emitted by the client
    socket.on('hostStartGame', hostStartGame)
    socket.on('leaveRoom', playerLeaveRoom)

/* *******************************
   *                             *
   *       GAME BINDINGS         *
   *                             *
   ******************************* */
    // In-Game Events
    socket.on('playerBid', playerBid)

    // PETER WHERE ARE YOU!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // Host Events
    // gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    // gameSocket.on('hostRoomFull', hostPrepareGame);
    // gameSocket.on('hostCountdownFinished', hostStartGame);
    // gameSocket.on('hostNextRound', hostNextRound);

    // Player Events
    // gameSocket.on('playerJoinGame', playerJoinGame);
    // gameSocket.on('playerAnswer', playerAnswer);
    // gameSocket.on('playerRestart', playerRestart);
}

// lobby room class
// var Room = new function(roomId){

//     this.id = roomId
//     this.playerList = []
//     this.gameMap = {
//         startingMoney:100,
//         objectValues:[3,7,10],
//         bidMode:0,
//         visibilityMode:0,
//         maxCountdownSec:3,
//     }
// }

// export interface INewPlayer {
// 	username: string,
// 	uniqueID: string,
// 	socket: object,
// }


/* *******************************
   *                             *
   *       LOBBY FUNCTIONS       *
   *                             *
   ******************************* */

function changeUsername(data){
    log('username changed to ' + data.name)
    this.user.username = data.name
    
}

// ------------------------------------------------------------------------------
// landing page

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */


function createNewRoom(){


    if (this.user.currentRoom === null){
        // Create a unique Socket.IO Room
        var thisRoomId = ( Math.random() * 100000 ) | 0

        // Create new Room
        var thisRoom = new Lobby.Room(thisRoomId)
        Lobby.Lobby.addRoom(thisRoom)

        // Add the creator to the Room
        thisRoom.addPlayer(this.user)
        // playerJoinRoom(thisRoomId)

        // use the Room ID as the socketio room, and join that room
        this.join(thisRoomId.toString())
        this.user.currentRoom = thisRoom



        log('newRoomCreated ' + thisRoomId.toString())
        this.emit('newRoomCreated', {roomId: thisRoomId})
        // this.broadcast.emit('newRoomCreated', {roomId: thisRoomId})
        this.broadcast.emit('lobbySync', Lobby.Lobby.getSimpleLobbyList())

    }
    else{
        log("you're already in a room...")
        // AFTER HACKATHON EXTENSION LOGIC
        // check if a player is already in a room, if so, return fail

    }

}

function playerJoinRoom(roomID){
    log(roomID)
    // log(this)


    // if the room actually exists
    if (Lobby.Lobby.hasRoom(roomID)){
        var joiningRoom = Lobby.Lobby.getRoom(roomID)


        //if room is not full
        if (!joiningRoom.isFull()){
            log("successfully joined!! " + roomID)

            joiningRoom.addPlayer(this.user)
            this.join(roomID.toString())         
            this.user.currentRoom = joiningRoom 
              
            io.in(''+this.user.currentRoom.id).emit('playerJoinedRoomSuccess', {id:this.user.uniqueID, name:this.user.username })
            io.emit('lobbySync', Lobby.Lobby.getSimpleLobbyList())
        }
        else{
            log("room is full =( ) " + roomID)

            this.emit('playerJoinedRoomFull', "some data")   
        }
    }
    
    else{
        log("room doesn't exist... " + roomID)
        this.emit('playerJoinedRoomNotExist', "some data")   
    }

    // log('playerJoinedRoom')
    // this.emit('playerJoinedRoom', "some data")   

    // AFTER HACKATHON EXTENSION LOGIC
    // check if a player is already in a room, if so, return fail

}

function debug(){
    log("DEBUGING!!!")
    log(Lobby.Lobby.roomList)

    // this.emit('playerJoinedRoom', "some data")   

}

// -------------------------------------------------------------------------------------------
// inside room

function hostStartGame(){
    // constructor(socketHandler:IOSocketHandler, config:IGameMap, lobbyID:string, joinedPlayers:INewPlayer[]) {

// export interface INewPlayer {
// 	username: string,
// 	uniqueID: string,
// 	socket: object,
// }

// interface IGameMap {
// 	startingMoney:number;
// 	objectValues:number[];
// 	bidHandler:IBidMode;
// 	observerHandler:IVisibilityMode;
// 	maxCountdownSec:number;
// }

//room id



    var auctionItems = JSON.parse(fs.readFileSync("lobby/auctionItems.json"))



    var gameMap = {
        startingMoney:100,
        objectValues:auctionItems,
        bidMode:0,
        visibilityMode:0,
        maxCountdownSec:10,
    }

    // var playerList = []
    // playerList.push({
    //     username: "peter",
    //     uniqueID: "12345",
    //     socket: socket
    // })



    this.emitWinner = function (lobbyID, winnerData) {
        log(winnerData)
        this.to(''+this.currentRoom.id).emit('event', winnerData)
    };
    this.emitRoundBegin = function (lobbyID, currentObj, countdownMS) {
        log("round starts")
        log(currentObj)
        log(countdownMS)
    };
    // Broadcast?
    this.emitBidSuccess = function (bidderSocket) {
        log("bid accepted")
    };
    // Only emit back to player?
    this.emitBidFailure = function (bidderSocket, reason) {
        log(reason)
    };
    // These two are affected by visibility mode.
    this.emitPlayerDataUpdate = function (lobbyID, data) {
        log(data)
    };
    this.emitRoundFinish = function (lobbyID, roundData) {
        log("round finish")
        log(roundData)
    };

    


    log('hostStartedGame')
    // create new map object
    // var newGame = new Game(socketHandler:IOSocketHandler, gameMap, lobbyID:string, joinedPlayers:INewPlayer[])

    let thisRoom = this.user.currentRoom
    var socketHelper = new ioss.IOSocketHandler(this.to(""+thisRoom.id));

    // load map
    let newGame = new Game.Game(socketHelper, gameMap, ('' + thisRoom.id), thisRoom.getPlayerListForGame())
    thisRoom.gameObject = newGame

    this.emit('hostStartedGame', "some data")

}

function playerLeaveRoom(){

    // if a player is in a room, leave that room
    if (this.user.currentRoom !== null){
        let thisRoom = this.user.currentRoom
        thisRoom.removePlayer(this.user)
             

        this.user.currentRoom = null

        log('playerLeftRoom')
        io.in(''+thisRoom.id).emit('playerLeftRoom', {id:this.user.uniqueID, name:this.user.username })

        this.leave(thisRoom.id.toString()) 

        // if the room is now empty, remove that room
        if (thisRoom.isEmpty() ){
            log('removing empty room...')
            Lobby.Lobby.removeRoom(thisRoom)
            let removedRoomId = thisRoom.id
            this.emit('roomRemoved', {roomId:''+removedRoomId})
            
        }

        io.emit('lobbySync', Lobby.Lobby.getSimpleLobbyList())

    }
    else{
        log("you're not in a room...")
    }
    



}



/* *******************************
   *                             *
   *       IN-GAME FUNCTIONS     *
   *                             *
   ******************************* */


function playerBid(bidAmount){

    let thisGame = this.user.currentRoom.gameObject

    thisGame.onPlayerBid(this.user.uniqueID, +bidAmount)


}

//   var IOSocketHandler = (function () {
//     function IOSocketHandler() {
//         //io.on() ... new game
//         //io.on... onPlayerBid
//     }
//     IOSocketHandler.prototype.emitWinner = function (lobbyID, winnerData) {
//         this.io["in"](lobbyID).emit(EMIT_GAME_OVER, JSON.stringify(winnerData));
//     };
//     IOSocketHandler.prototype.emitRoundBegin = function (lobbyID, currentObj, countdownMS) {
//         this.io["in"](lobbyID).emit(EMIT_ROUND_BEGIN, JSON.stringify({ AuctionObj: currentObj, countdownMS: countdownMS }));
//     };
//     // Broadcast?
//     IOSocketHandler.prototype.emitBidSuccess = function (bidderSocket) {
//         bidderSocket.emit(EMIT_BID_RESPONSE_SUCCESS, "Bid accepted.");
//     };
//     // Only emit back to player?
//     IOSocketHandler.prototype.emitBidFailure = function (bidderSocket, reason) {
//         bidderSocket.emit(EMIT_BID_RESPONSE_FAIL, reason);
//     };
//     // These two are affected by visibility mode.
//     IOSocketHandler.prototype.emitPlayerDataUpdate = function (lobbyID, data) {
//         this.io["in"](lobbyID).emit(EMIT_PLAYER_UPDATE, JSON.stringify(data));
//     };
//     IOSocketHandler.prototype.emitRoundFinish = function (lobbyID, roundData) {
//         this.io["in"](lobbyID).emit(EMIT_ROUND_FINISH, JSON.stringify(roundData));
//     };
//     return IOSocketHandler;
// }());


function log(msg){
    console.log(msg)
}

    
