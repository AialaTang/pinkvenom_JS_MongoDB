const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const PinkcampaignSchema = new Schema({
    title: String,
    city: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    date: Date,
    author: {
        type: Schema.Types.ObjectId,
        re: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

PinkcampaignSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Pinkcampaign', PinkcampaignSchema);