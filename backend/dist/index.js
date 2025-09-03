"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const UserSchema_1 = require("./schema/UserSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let usercount = 0;
// let allSocke={};
// /*
//     "room1":[socket1, socket2],
//     "room2":[socket3],
//     "room3":[socket 4, socket 5, socket6]
// */
let allSocket = [];
/*
    [
    socket: "socket1", room : room1,
    socket: "socket2", room : room2,
    socket: "socket1", room: room1
    ]
*/
(0, db_1.DB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const result = yield UserSchema_1.user.findOne({
            email: email
        });
        if (result) {
            return res.status(401).json({
                message: "username already exist"
            });
        }
        const hashpassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield UserSchema_1.user.create({
            username,
            password: hashpassword,
            email
        });
        const token = jwt.sign({ _id: newUser._id }, "mysecretjson");
        return res.status(200).json({
            mesage: "sinup done successfully",
            token,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        console.log(`email is ${email} and password is ${password}`);
        const result = yield UserSchema_1.user.findOne({
            email: email
        });
        if (!result) {
            return res.status(401).json({
                message: "Please sign up first"
            });
        }
        const passwordCompare = yield bcrypt_1.default.compare(password, result.password);
        if (!passwordCompare) {
            return res.status(401).json({
                mesage: "password incorrect"
            });
        }
        const token = jwt.sign({ _id: result._id }, "mysecretjson");
        console.log(token);
        return res.status(200).json({
            mesage: "sigin  done successfully",
            token,
            user: {
                _id: result._id,
                username: result.username,
                email: result.email
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
}));
app.post("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({
            message: "please login first"
        });
    }
    try {
        const decoded = jwt.verify(token, "mysecretjson");
        const userData = yield UserSchema_1.user.findById(decoded._id);
        if (!userData) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "user is already logged in",
            user: {
                _id: userData._id,
                username: userData.username,
                email: userData.email
            }
        });
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}));
app.post("/logout", (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({
            message: "please login first"
        });
    }
    return res.status(200).json({
        message: "user is already logged in"
    });
});
wss.on("connection", (socket) => {
    console.log("connection established");
    socket.on("message", (message) => {
        console.log(message);
        const msg = JSON.parse(message);
        console.log(JSON.stringify(msg));
        if (msg.type === "join") {
            console.log(`user joined room ${msg.payload.roomID}`);
            allSocket.push({ socket, roomID: msg.payload.roomID, username: msg.payload.username });
        }
        if (msg.type === "chat") {
            //if the user is sending a text or chat , then find the currentRoom of that user, now 
            //send that text or chat to all the user which are currently present in that room 
            // const currentUserRoom=allSocket.find((x)=> x.socket===socket);
            // console.log( `currentUserRoom is ${JSON.stringify(currentUserRoom)}`)
            let currentUserRoom = null;
            let currentUsername = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket === socket) {
                    currentUserRoom = allSocket[i].roomID;
                    currentUsername = allSocket[i].username;
                }
            }
            console.log(`user joined room ${msg.payload.message}`);
            console.log(`current user room is ${currentUserRoom}`);
            const messageWithUsername = {
                message: msg.payload.message,
                username: currentUsername,
                timestamp: new Date().toISOString()
            };
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].roomID == currentUserRoom) {
                    // currentUserRoom?.socket.send(msg.payload.message)
                    allSocket[i].socket.send(JSON.stringify(messageWithUsername));
                }
            }
        }
    });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
