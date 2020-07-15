const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema)