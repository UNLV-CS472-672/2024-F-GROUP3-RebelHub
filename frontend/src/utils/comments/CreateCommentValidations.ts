export const COMMENT_VALIDATION = {
    label: "",
    type: "textarea",
    id: "message",
    placeholder: "Enter the message content of your comment...",
    name: "message",
    multiline: true,
    validation: {
        required: {
            value: true,
            message: "Required",
        },
    },
}
