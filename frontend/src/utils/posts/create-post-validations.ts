export const TITLE_VALIDATION = {
    label: "Post Title",
    type: "text",
    placeholder: "Enter the title of your post...",
    name: "title",
    multiline: false,
    validation: {
        required: {
            value: true,
            message: "Title is required.",
        },
        maxLength: {
            value: 150,
            message: "Post title cannot be more than 150 characters.",
        },
        validate: { 
            notOnlyWhitespace: (value: string) => value.trim() !== "" || "The title cannot contain only whitespace.",
        },
    },
};

export const HUB_VALIDATION = {
    label: "Hub to Post",
    type: "text",
    placeholder: "Enter the hub of your post...",
    name: "hub",
    multiline: false,
    validation: {
        required: {
            value: true,
            message: "Required",
        },
    },
};

export const POST_MESSAGE_VALIDATION = {
    label: "Post Message",
    type: "textarea",
    placeholder: "Enter the message content of your post...",
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
