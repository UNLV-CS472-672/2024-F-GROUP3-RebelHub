import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "./ImageInput.module.css";

const ImageInput: FC = () => {
    const { register, watch, resetField, setValue } = useFormContext();

    const [image] = watch(["image"]);
    const [preview] = useFilePreview(image);

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
            </div>
            
            <input
                style={{ "display": "none"}}
                id="image"
                type="file"
                {...register("image")}
                accept=".png, .jpg, .jpeg"
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
  
    useEffect(() => {
        try {
            setImgSrc(new URL(file));
        } catch (error) {
            if (file && file[0]) {
                const newUrl = URL.createObjectURL(file[0]);
          
                if (newUrl !== imgSrc) {
                  setImgSrc(newUrl);
                }
            } else {
                setImgSrc(null);
            }
      }
    }, [file]);
  
    return [imgSrc, setImgSrc];
}

export default ImageInput;
