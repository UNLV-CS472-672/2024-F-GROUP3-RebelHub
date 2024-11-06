import { useFormContext } from "react-hook-form";
import { findInputError, isFormInvalid } from "@/utils/posts/create-post-input-helper";

import styles from "../posts.module.css";

interface ComponentProps {
    label: string,
    type: string,
    id: string,
    placeholder: string,
    name: string,
    validation: any,
    multiline: boolean,
}

/*
    CreatePostInput

    This is a form component that can be customized to dynamically display error messages on
    the form.

    label:          the title of the input component
    type:           the type of input component such as "text"
    id:             used to identify the element
    placeholder:    the value displayed inside of the input element
    name:           the key associated with the input value when submitting a form to the server
    validation:     a set of values such as "validation: { required: { value: true, message: 'Required', }, }"
    multiline:      boolean that states if the input is supposed to be a multiline

    Follow the formatting from utils/posts/create-post-validations.ts to try create a new input.
*/

const CreatePostInput: React.FC<ComponentProps> = ({ label, type, id, placeholder, name, validation, multiline }) => {
    const { register, formState: { errors }, } = useFormContext();

    // Use helper functions from utils/posts/create-post-input-helpers to check for errors
    const inputError = findInputError(errors, name);
    const isInvalid = isFormInvalid(inputError);

    // Javascript is used to determine whether to display error messages or a text area input.
    // ...register is used to pass the validation checks.
    return (
        <div className={styles.createPostInputContainer}>
            <div>
                <h2>
                    {label}
                </h2>
                {isInvalid && (
                    <InputError
                        message={inputError.error.message}
                        key={inputError.error.message}
                    />
                )}
            </div>
            <div>
                {multiline ? (
                    <textarea
                        id={id}
                        className={styles.createPostTextarea}
                        type={type}
                        placeholder={placeholder}
                        {...register(name, validation)}
                    />
                ) : (
                    <input
                        id={id}
                        className={styles.createPostInput}
                        type={type}
                        placeholder={placeholder}
                        {...register(name, validation)}
                    />
                )
                }
            </div>
        </div>
    )
}

const InputError = ({ message }) => {
    // Displays an error message
    return (
        <div className={styles.createPostError}>
            {message}
        </div>
    )
}

export default CreatePostInput;
