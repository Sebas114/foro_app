const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    dir: { type: String, required: true },
    comentario: { type: String, required: true },
    likes: { number: { type: Number, default: 0 }, user_id: [String] },
    dislikes: { number: { type: Number, default: 0 }, user_id: [String] },
    user: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema)