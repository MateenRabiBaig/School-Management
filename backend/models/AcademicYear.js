const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },

        startDate:{
            type:Date,
            required:true
        },

        endDate:{
            type:Date,
            required:true
        },

        active:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
);

academicYearSchema.set("toJSON",{ transform(doc,ret)
    {
        ret.id=ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports=mongoose.model("AcademicYear", academicYearSchema)