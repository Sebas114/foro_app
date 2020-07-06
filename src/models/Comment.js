const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    dir: { type: String, required: true },
    comentario: { type: String, required: true },
    user: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema)