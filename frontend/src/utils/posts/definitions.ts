export type Post = {
    id: number,
    author: string,
    title: string,
    message: string,
    timestamp: Date,
    hub: number,
    likes: number[],
    dislikes: number[],
    is_author: boolean,
    is_disliked: boolean,
    is_liked: boolean,
}
