export const COMMENT_VALIDATION = {
    label: "",
    type: "textarea",
    placeholder: "Enter the message content of your comment...",
    name: "message",
    multiline: true,
    validation: {
        required: {
            value: true,
            message: "Message is required.",
        },
        validate: { 
            notOnlyWhitespace: (value: string) => value.trim() !== "" || "The message cannot contain only whitespace.",
        },
    },
}
