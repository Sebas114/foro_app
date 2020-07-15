const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    dir: { type: String, required: true },
    comentario: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    gravatar: { type: String },
    user: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema)