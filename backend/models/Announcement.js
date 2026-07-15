const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true,
        trim:true
    },

    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    postedByRole:{
        type:String,
        enum:["admin","teacher"],
        required:true
    },

    audience:{
        type:String,
        enum:[
            "All",
            "Students",
            "Teachers"
        ],
        default:"All"
    },

    active:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
}
);

announcementSchema.set("toJSON", { transform(doc,ret){
    ret.id=ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
}
});

module.exports = mongoose.model("Announcement", announcementSchema);