import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Update the image state
            setImage(file);

            // Generate a preview URL from the file
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const
  return (
    <div>
      
    </div>
  )
}

export default ProfilePhotoSelector
