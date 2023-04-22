import mongoose from "mongoose";
import config from "config";

const connect = async () => {
    try {
        await mongoose.connect(config.get("DB_URI"));
        console.log("Mongo DB Connected Successfully ");

    } catch (error) {
        console.log(error);
    }
};

connect();
