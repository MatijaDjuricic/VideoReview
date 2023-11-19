const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
    video_id: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    channel: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String,
        require: true
    }
},  {
    timestamps: true
});
module.exports = mongoose.model('Review', ReviewSchema);