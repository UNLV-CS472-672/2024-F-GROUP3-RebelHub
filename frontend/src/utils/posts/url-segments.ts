export const URL_SEGMENTS = {
    BACKEND: "http://localhost:8000/",
    FRONTEND: "http://localhost:3000/",

    POSTS_HOME: "posts/",
    
    POSTS_API_BASE: "api/posts/",
    POSTS_CREATE: "create/",
    POSTS_DELETE: "/delete/",
    POSTS_LIKE: "/like/",
    POSTS_DISLIKE: "/dislike/",
};

// Functions to return a URL for an API call

export function getPostListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE;
}

export function getLikePostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_LIKE;
}

export function getDislikePostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_DISLIKE;
}

export function getDetailedPostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + "/";
}

export function getCreatePostURL() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + URL_SEGMENTS.POSTS_CREATE;
}

export function getDeletePostURL(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_DELETE;
}

// Functions to return a URL for a redirect

export function gotoCreatePostPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + URL_SEGMENTS.POSTS_CREATE;
}

export function gotoDetailedPostPage(postId: number|string) {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + postId + "/";
}

export function gotoPostListPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME;
}
