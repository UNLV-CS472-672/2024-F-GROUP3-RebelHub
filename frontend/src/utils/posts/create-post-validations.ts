export const TITLE_VALIDATION = {
    label: "Post Title",
    type: "text",
    id: "title",
    placeholder: "Enter the title of your post...",
    name: "title",
    multiline: false,
    validation: {
        required: {
            value: true,
            message: "Required",
        },
    },
};

export const HUB_VALIDATION = {
    label: "Hub to Post",
    type: "text",
    id: "hub",
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
    id: "message",
    placeholder: "Enter the message content of your post...",
    name: "message",
    multiline: true,
    validation: {
        required: {
            value: true,
            message: "Required",
        },
    },
}
