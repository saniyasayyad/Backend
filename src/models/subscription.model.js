import mongoose from "mongoose";

const subscriptionSchema = new Schema({
    subscriber : {
        type:Schema.Types.ObjectId,
        // one who is subscribing
        ref: "User"
    },
    channel : {
        typr: Schema.Types.ObjectId,// one to whom 'sub' is subscribing
        ref : "User"
    }
}, {timestamps: true})

export const Subcription = mongoose.model("Subscription",subscriptionSchema)