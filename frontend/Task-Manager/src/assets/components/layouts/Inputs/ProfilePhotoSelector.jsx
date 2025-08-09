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

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };
  return <div className="">
    <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className=""
        />

        (!image ? 
        <div className="">
          <LuUser className=""/>
          <button
          type="button"
          className=""
          onClick={onChooseFile}
          >
            <LuUpload />
            </button> 
            </div>
        )  : (
            <div className="">
                <img
                src={previewUrl}
                alt="Profile photo"
                className=""
                />
                <button
                type="button"
                className=""
                onClick={handleRemoveImage}
                >
                <LuTrash />
                </button>
            </div>
        )
  </div>
}

export default ProfilePhotoSelector
