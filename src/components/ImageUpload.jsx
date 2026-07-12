import { useRef, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage } from "../api/uploadApi";

function ImageUpload({ value, onChange, label = "Upload Photo" }) {

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const imageUrl = typeof value === "string" ? value : value?.url || "";

    async function handleFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Maximum image size is 5 MB.");
            return;
        }

        try {
            setLoading(true);
            const response = await uploadImage(file);
            onChange(response.image);
            toast.success("Photo uploaded successfully.");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="image-upload">
            <label>{label}</label>
            <div className="image-upload-box" onClick={() => fileInputRef.current.click()}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="image-preview"
                    />
                ) : (
                    <div className="image-placeholder">
                        <ImageIcon size={40} />
                        <p>Choose Image</p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
            />
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
            >
                <Upload size={16} />
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}

export default ImageUpload