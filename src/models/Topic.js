const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
    likes: { number: { type: Number, default: 0 }, user_id: [String] },
    dislikes: { number: { type: Number, default: 0 }, user_id: [String] },
    views: { type: Number, default: 0 },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema)