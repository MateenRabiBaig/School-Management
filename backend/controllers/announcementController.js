const Announcement = require("../models/Announcement");

const getAnnouncements=async(req,res,next) => {
    try {
        let filter = { active:true };
        
        if(req.user.role === "student") {
            filter.audience={
                $in:["All", "Students"]
            };
        }
        
        if(req.user.role === "teacher") {
            filter.audience = {
                $in:["All", "Teachers"]
            };
        }
        
        const announcements = await Announcement.find(filter).sort({ createdAt:-1 }).select(
            `
                title
                description
                audience
                active
                postedByRole
                createdAt
                updatedAt
            `
        );
        res.status(200).json({ announcements });
    }
    catch(error) {
        next(error);
    }
};

const createAnnouncement = async(req,res,next) => {
    try {
        const announcement = await Announcement.create({
            title:req.body.title,
            description:req.body.description,
            audience:req.body.audience,
            postedBy:req.user.id,
            postedByRole:req.user.role
        });
        res.status(201).json({ announcement });
    }
    catch(error) {
        next(error);
    }
};

const updateAnnouncement = async(req,res,next) => {
    try {
        const { title, description, audience, active } = req.body;
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, { title, description, audience, active }, { new: true, runValidators: true });
        
        if(!announcement) {
            res.status(404);
            throw new Error("Announcement not found.");
        }
        res.status(200).json({ announcement });
    }
    catch(error) {
        next(error);
    }
};

const deleteAnnouncement = async(req,res,next) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        
        if(!announcement) {
            res.status(404);
            throw new Error("Announcement not found.");
        }
        res.status(200).json({ message:"Announcement deleted." });
    }
    catch(error) {
        next(error);
    }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement }