const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    image: String,
    title: String,
    likes: Array,
    coments: Array,
    userId: mongoose.ObjectId,
    userName: String,
},
{
    timestamps: true,

}
);