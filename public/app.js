const EMIT_BID_RESPONSE_SUCCESS = "Bid Response Success"
const EMIT_BID_RESPONSE_FAIL = "Bid Response Failure"

const EMIT_GAME_OVER = "Game Over"
const EMIT_PLAYER_UPDATE = "Player Update"
const EMIT_ROUND_BEGIN = "Round Begin"
const EMIT_ROUND_FINISH = "Round Finish"



;
jQuery(function($){    
    'use strict';


    // $('form#create_room').submit(function(){
    //     socket.emit('createNewRoom', "some data");
    //     // $('#m').val('');
    //     return false;
    // });




    /**
     * All the code relevant to Socket.IO is collected in the IO namespace.
     *
     * @type {{init: Function, bindEvents: Function, onConnected: Function, onNewGameCreated: Function, playerJoinedRoom: Function, beginNewGame: Function, onNewWordData: Function, hostCheckAnswer: Function, gameOver: Function, error: Function}}
     */
    var IO = {

        /**
         * This is called when the page is displayed. It connects the Socket.IO client
         * to the Socket.IO server
         */
        init: function() {
            IO.socket = io();
            // IO.socket = io.connect();
            IO.bindEvents();
        },

        /**
         * While connected, Socket.IO will listen to the following events emitted
         * by the Socket.IO server, then run the appropriate function.
         */
        bindEvents : function() {

            //lobby listeners
            IO.socket.on('lobbySync', IO.onLobbySync)



            //in-game listeners
            IO.socket.on(EMIT_GAME_OVER, IO.onGameOver );
            IO.socket.on(EMIT_ROUND_BEGIN, IO.onRoundBegin );
            IO.socket.on(EMIT_BID_RESPONSE_SUCCESS, IO.onBidResponseSuccess );
            IO.socket.on(EMIT_BID_RESPONSE_FAIL, IO.onBidResponseFail );
            IO.socket.on(EMIT_PLAYER_UPDATE, IO.onPlayerUpdate );
            IO.socket.on(EMIT_ROUND_FINISH, IO.onRoundFinish );

        },

/* *******************************
   *                             *
   *       LOBBY FUNCTIONS       *
   *                             *
   ******************************* */
        onLobbySync : function(data){
            log(data)

        },


  /* *******************************
   *                             *
   *       GAME FUNCTIONS        *
   *                             *
   ******************************* */
        onGameOver : function(data){
            console.log(data)

        },
        onRoundBegin : function(data){
            console.log(data)

        },
        onBidResponseSuccess : function(data){
            console.log(data)

        },
        onBidResponseFail : function(data){
            console.log(data)

        },
        onPlayerUpdate : function(data){
            console.log(data)

        },
        onRoundFinish : function(data){
            console.log(data)

        },



    };


//  IOSocketHandler.prototype.emitWinner = function (lobbyID, winnerData) {
//         this.io["in"](lobbyID).emit(EmitConstants_1.EMIT_GAME_OVER, JSON.stringify(winnerData));
//     };
//     IOSocketHandler.prototype.emitRoundBegin = function (lobbyID, currentObj, countdownMS) {
//         this.io["in"](lobbyID).emit(EmitConstants_1.EMIT_ROUND_BEGIN, JSON.stringify({ ixObj: currentObj, countdownMS: countdownMS }));
//     };
//     // Broadcast?
//     IOSocketHandler.prototype.emitBidSuccess = function (bidderSocket) {
//         bidderSocket.emit(EmitConstants_1.EMIT_BID_RESPONSE_SUCCESS, "Bid accepted.");
//     };
//     // Only emit back to player?
//     IOSocketHandler.prototype.emitBidFailure = function (bidderSocket, reason) {
//         bidderSocket.emit(EmitConstants_1.EMIT_BID_RESPONSE_FAIL, reason);
//     };
//     // These two are affected by visibility mode.
//     IOSocketHandler.prototype.emitPlayerDataUpdate = function (lobbyID, data) {
//         this.io["in"](lobbyID).emit(EmitConstants_1.EMIT_PLAYER_UPDATE, JSON.stringify(data));
//     };
//     IOSocketHandler.prototype.emitRoundFinish = function (lobbyID, roundData) {
//         this.io["in"](lobbyID).emit(EmitConstants_1.EMIT_ROUND_FINISH, JSON.stringify(roundData));
//     };
//     return IOSocketHandler;



    var App = {

        init: function () {

            App.$doc = $(document);

            // App.cacheElements();
            // App.showInitScreen();
            App.bindEvents();

            // Initialize the fastclick library
            // FastClick.attach(document.body);
        },

        bindEvents: function () {

            /* *******************************
            *                             *
            *       LOBBY BINDINGS        *
            *                             *
            ******************************* */            

            // landing page
            App.$doc.on('click', '#btnCreateRoom', App.onCreateRoom);
            App.$doc.on('click', '#btnJoinRoom', App.onJoinRoom);
            App.$doc.on('click', '#btnDebug', App.onDebug);
            

            // inside room
            App.$doc.on('click', '#btnStartGame', App.onStartGame);
            App.$doc.on('click', '#btnLeaveRoom', App.onLeaveRoom);

            /* *******************************
            *                             *
            *       IN-GAME BINDINGS      *
            *                             *
            ******************************* */

            App.$doc.on('click', '#btnBid', App.onBid);


            // // Host
            // App.$doc.on('click', '#btnCreateGame', App.Host.onCreateClick);

            // // Player
            // App.$doc.on('click', '#btnJoinGame', App.Player.onJoinClick);
            // App.$doc.on('click', '#btnStart',App.Player.onPlayerStartClick);
            // App.$doc.on('click', '.btnAnswer',App.Player.onPlayerAnswerClick);
            // App.$doc.on('click', '#btnPlayerRestart', App.Player.onPlayerRestart);
            
        },

    // socket.on('createNewRoom', createNewRoom)
    // socket.on('joinRoom', playerJoinRoom )

    
    // // inside the room, emitted by the client
    // socket.on('hostStartGame', hostStartGame)
    // socket.on('leaveRoom', playerLeaveRoom)

/* *******************************
   *                             *
   *       LOBBY FUNCTIONS       *
   *                             *
   ******************************* */
        // landing page -----------------------------------------------------------------
        onCreateRoom: function () {
            // log("create!!")
            // console.log('Clicked "Join A Game"');

            // Display the Join Game HTML on the player's screen.
            // App.$gameArea.html(App.$templateJoinGame);

            IO.socket.emit('createNewRoom', "some data");
        },        

        onJoinRoom: function () {
            log('clicked join')
            var roomID = $('#inputRoomID').val();
            IO.socket.emit('joinRoom', roomID);
            // IO.socket.emit('joinRoom', 5);
        },        

        onDebug: function () {
            log('Client: clicked debug')

            IO.socket.emit('debug', "some data");
            // IO.socket.emit('joinRoom', 5);
        },      

        // inside room --------------------------------------------------------------------
        onStartGame: function () {


            IO.socket.emit('hostStartGame', "some data");
        },        

        onLeaveRoom: function () {


            IO.socket.emit('leaveRoom', "some data");
        },        


  /* *******************************
   *                             *
   *       GAME FUNCTIONS        *
   *                             *
   ******************************* */
        onBid: function(){
            log('clicked bid')
            var bidAmount = $('#inputBidAmount').val();
            IO.socket.emit('playerBid', bidAmount);
        }


    };

    IO.init();
    App.init();

}($));


function log(msg){
    console.log(msg)
}
