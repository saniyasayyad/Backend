import mongoose, {Schema} from "mongoose"; // Fixed: "mongoose" not "moongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type : String, // cloudinary url
            required : true
        },
        thumbnail :{
            type : String, // cloudinary url
            required : true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0  // Fixed: "default" not "dafault"
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {  // Fixed: "owner" not "Owner" (lowercase is more conventional)
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true  // Fixed: "timestamps" not "timestamp"
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video', videoSchema)