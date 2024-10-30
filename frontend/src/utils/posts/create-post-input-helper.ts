import { FieldErrors, FieldValues } from "react-hook-form";

// Outputs the error, if there is one, that belongs to the input name.
export function findInputError(errors: FieldErrors<FieldValues>, name: string) {
    const filtered = Object.keys(errors)
        .filter(key => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] })
        }, {})
    return filtered;
}

// Takes the filtered errors object and checks if there are any errors.
export function isFormInvalid(filteredErrors: {}) {
    return Object.keys(filteredErrors).length > 0;
}
