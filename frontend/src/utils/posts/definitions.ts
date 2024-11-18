export type Post = {
    id: number,
    author: number,
    title: string,
    message: string,
    timestamp: Date,
    hub: number,
    likes: number[],
    dislikes: number[],
    is_author: boolean,
    is_disliked: boolean,
    is_liked: boolean,
    last_edited: Date|null,
}

export type Hub = {
    id: number,
    name: string,
    description: string,
    owner: number,
    mods: number[],
    members: number[],
    pending_members: number[],
    created_at: Date,
    private_hub: boolean,
}
