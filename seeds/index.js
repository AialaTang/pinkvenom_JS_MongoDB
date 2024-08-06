const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, events } = require('./seedHelpers');
const Pinkcampaign = require('../models/pinkcampaign');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/pink-venom'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const startDate = new Date('2023-08-18').getTime();
const endDate = new Date('2023-08-20').getTime();

const seedDB = async () => {
    await Pinkcampaign.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomTimestamp = Math.floor(Math.random() * (endDate - startDate + 1)) + startDate
        const randomDate = new Date(randomTimestamp)
        const random1004 = Math.floor(Math.random() * 1004)
        const randomPrice = Math.floor(Math.random() * 30)
        const pink = new Pinkcampaign({
            author: '644e0be18f761aeec9aaabfb',
            city: `${cities[random1004].city},${cities[random1004].state}`,
            title: `${sample(descriptors)} ${sample(events)}`,
            price: randomPrice,
            description: "Meanwhile, BLACKPINK's pre-release single Pink Venom, from their 2nd full album 'Born Pink', will be out worldwide on August 19 at 12 AM EST!",
            date: randomDate,
            images: [
                {
                    "url": "https://res.cloudinary.com/dhtfkw9eu/image/upload/v1687507930/PinkVenom/plm579odaz9xeoitpmzy.jpg",
                    "filename": "PinkVenom/plm579odaz9xeoitpmzy"
                },
                {
                    "url": "https://res.cloudinary.com/dhtfkw9eu/image/upload/v1687507931/PinkVenom/mfeqvzfwi7rxdhuvcjjm.webp",
                    "filename": "PinkVenom/mfeqvzfwi7rxdhuvcjjm"
                }]
        })
        await pink.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})



