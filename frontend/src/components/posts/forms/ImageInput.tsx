import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "./ImageInput.module.css";
import { displayPicture } from "@/utils/url-segments";

const ImageInput: FC = () => {
    const { register, watch, resetField, setValue } = useFormContext();

    const [image] = watch(["image"]);
    const [preview, setPreview] = useFilePreview(image);

    const handleDiscard = () => {
        setValue("image", null);
    }

    const handleReset = () => {
        resetField("image");
    }

    return (
        <div className={styles.imageInputContainer}>
            <div className={styles.buttonContainer}>
                <label htmlFor="image" className={styles.labelButton}>
                    {image !== null ? 
                        (
                            <h3>
                                Change Image
                            </h3>
                        ) : (
                            <h3>
                                Upload Image
                            </h3>
                        )
                    }
                </label>
                <button  className={styles.labelButton} type="button" onClick={handleReset}>
                    Reset Image
                </button>
                <button className={styles.labelButton} type="button" onClick={handleDiscard}>
                    Remove Image
                </button>
            </div>
            
            <input
                style={{ "display": "none"}}
                id="image"
                type="file"
                {...register("image")}
            />

            <img
                className={styles.previewImage}
                src={preview} 
            />
        </div>
    );
}

function useFilePreview(file) {
    const [imgSrc, setImgSrc] = useState(null);
  
    // Tries to create a URL for the input file.
    // If it fails, then input file is a URL to the backend and can
    // directly be displayed.
    useEffect(() => {
        try {
            if (file && file[0]) {
                const newUrl = URL.createObjectURL(file[0]);
          
                if (newUrl !== imgSrc) {
                  setImgSrc(newUrl);
                }
            } else {
                setImgSrc(null);
            }
        } catch (error) {
            setImgSrc(displayPicture(file));
        }
    }, [file]);
  
    return [imgSrc, setImgSrc];
}

export default ImageInput;
