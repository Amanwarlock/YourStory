
var Mongoose = require("mongoose");

module.exports = {
    creator: { "type": Mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    content: { type: String },
    createdAt: { type: Date, default: Date.now() },
    deleted: { type: Boolean, default: false }
}