import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    imageBuffer: {
        type: Buffer,
        required: true

    },
    caption: {
        type: String,
        required: true

    },
    createdAt: {
        type: Date,
        default: new Date()
    }

})

const imageModel = new mongoose.model("Images", imageSchema, "images")

export default imageModel