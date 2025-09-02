"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    }
});
exports.user = (0, mongoose_1.model)("user", UserSchema);
