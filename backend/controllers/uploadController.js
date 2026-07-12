const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400)
            throw new Error("Please upload an image")
        }

        res.status(200).json({ message: "Image uploaded successfully",
            image: { url: req.file.path, publicId: req.file.filename }
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = { uploadImage }