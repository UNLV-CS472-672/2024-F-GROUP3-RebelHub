export const URL_SEGMENTS = {
    BACKEND: "http://localhost:8000/",
    FRONTEND: "http://localhost:3000/",

    // #region Hubs
    HUBS_API_BASE: "api/hubs/",
    HUBS_JOINED: "joined/",
    HUBS_MODDING: "modding/",
    HUBS_OWNED: "owned/",
    HUBS_CREATE: "create/",
    HUBS_UPDATE: "/update/",
    HUBS_DELETE: "/delete/",
    HUBS_JOIN: "/join/",
    HUBS_REQUEST_JOIN: "/request_join/",
    HUBS_CANCEL_REQUEST_JOIN: "/cancel_request_join/",
    HUBS_LEAVE: "/leave/",
    HUBS_KICK: "/kick/",
    HUBS_ACCEPT_JOIN: "/accept_join/",
    HUBS_DECLINE_JOIN: "/decline_join/",
    HUBS_MODS_ADD: "/mods/add/",
    HUBS_MODS_REMOVE: "/mods/remove/",
    HUBS_POSTS: "/posts/",
    // #endregion

    // #region Posts
    POSTS_HOME: "posts/",
    POSTS_API_BASE: "api/posts/",
    POSTS_CREATE: "create/",
    POSTS_DELETE: "/delete/",
    POSTS_LIKE: "/like/",
    POSTS_DISLIKE: "/dislike/",
    POSTS_EDIT: "/edit/",
    POSTS_COUNT: "postcount/",
    // #endregion

    // #region Comments
    COMMENTS_BASE: "/comments/",
    COMMENTS_API_BASE: "api/comments/",
    COMMENTS_CREATE: "create/",
    COMMENTS_LIKE: "/like/",
    COMMENTS_DISLIKE: "/dislike/",
    COMMENTS_REPLY: "/reply/",
    // #endregion

    // #region Users
    USERS_HOME: "users/",
    USERS_LOGIN: "/login/",
    USERS_API_BASE: "api/users/",
    USERS_REGISTER: "register/",
    USERS_TOKEN: "token/",
    USERS_REFRESH: "refresh/",
    USERS_CURRENTUSER: "currentUser/",
    // #endregion

    // #region Events
    EVENTS_API_BASE: "api/events/",
    EVENTS_CREATE: "create/",
    EVENTS_DELETE: "/delete/",
    EVENTS_UPDATE: "/update/",
    // #endregion

    //#region Profile
    PROFILE_API: 'api/profile/',
    // #endregion
};

// #region Functions to return a URL for an API call (hubs)

// "http://localhost:8000/api/hubs/"
export function getHubListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE;
}

// "http://localhost:8000/api/hubs/joined/"
export function getJoinedHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_JOINED;
}

// "http://localhost:8000/api/hubs/modding/"
export function getModdingHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_MODDING;
}

// "http://localhost:8000/api/hubs/owned/"
export function getOwnedHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_OWNED;
}

// "http://localhost:8000/api/hubs/<int:id>/"
export function getHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + "/";
}

// "http://localhost:8000/api/hubs/create/"
export function getCreateHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_CREATE;
}

// "http://localhost:8000/api/hubs/<int:id>/delete/"
export function getDeleteHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_DELETE;
}

// "http://localhost:8000/api/hubs/<int:id>/update/"
export function getUpdateHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_UPDATE;
}

// "http://localhost:8000/api/hubs/<int:id>/join/"
export function getJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_JOIN;
}

// "http://localhost:8000/api/hubs/<int:id>/request_join/"
export function getRequestJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_REQUEST_JOIN;
}

// "http://localhost:8000/api/hubs/<int:id>/cancel_request_join/"
export function getCancelRequestJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_CANCEL_REQUEST_JOIN;
}

// "http://localhost:8000/api/hubs/<int:id>/leave/"
export function getLeaveHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_LEAVE;
}

// "http://localhost:8000/api/hubs/<int:id>/kick/"
export function getKickHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_KICK;
}

// "http://localhost:8000/api/hubs/<int:id>/accept_join/"
export function getAcceptoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_ACCEPT_JOIN;
}

// "http://localhost:8000/api/hubs/<int:id>/decline_join/"
export function getDeclineJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_DECLINE_JOIN;
}

// "http://localhost:8000/api/hubs/<int:id>/mods/add/"
export function getModsAddHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_MODS_ADD;
}

// "http://localhost:8000/api/hubs/<int:id>/mods/remove/"
export function getModsRemoveHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_MODS_REMOVE;
}

// "http://localhost:8000/api/hubs/<int:id>/posts/"
export function getPostsHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_POSTS;
}

// #endregion

// #region Functions to return a URL for an API call (posts)

// "http://localhost:8000/api/posts/"
export function getPostListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE;
}

// "http://localhost:8000/api/posts/<int:id>/like/"
export function getLikePostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_LIKE;
}

// "http://localhost:8000/api/posts/<int:id>/dislike/"
export function getDislikePostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_DISLIKE;
}

// "http://localhost:8000/api/posts/<int:id>/"
export function getDetailedPostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + "/";
}

// "http://localhost:8000/api/posts/create/"
export function getCreatePostUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + URL_SEGMENTS.POSTS_CREATE;
}

// "http://localhost:8000/api/posts/<int:id>/delete/"
export function getDeletePostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_DELETE;
}

// "http://localhost:8000/api/posts/<int:id>/edit/"
export function getEditPostUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.POSTS_EDIT;
}

// "http://localhost:8000/api/posts/postcount"
export function getPostCountUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE +  URL_SEGMENTS.POSTS_COUNT;
}

// #endregion

// "http://localhost:8000/api/posts/<int:post_id>/comments/"
export function getCommentsListUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.COMMENTS_BASE;
}

// "http://localhost:8000/api/posts/<int:post_id>/comments/create/"
export function getCreateCommentsUrl(postId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.POSTS_API_BASE + postId + URL_SEGMENTS.COMMENTS_BASE + URL_SEGMENTS.COMMENTS_CREATE;
}

// "http://localhost:8000/api/comments/<int:comment_id>/"
export function getCommentUrl(commentId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.COMMENTS_API_BASE + commentId + "/";
}

// "http://localhost:8000/api/comments/<int:comment_id>/like/"
export function getLikeCommentUrl(commentId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.COMMENTS_API_BASE + commentId + URL_SEGMENTS.COMMENTS_LIKE;
}

// "http://localhost:8000/api/comments/<int:comment_id>/dislike/"
export function getDislikeCommentUrl(commentId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.COMMENTS_API_BASE + commentId + URL_SEGMENTS.COMMENTS_DISLIKE;
}

// "http://localhost:8000/api/comments/<int:comment_id>/reply/"
export function getReplyUrl(commentId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.COMMENTS_API_BASE + commentId + URL_SEGMENTS.COMMENTS_REPLY;
}

// #region Functions to return a URL for an API call (events)

// "http://localhost:8000/api/events/"
export function getEventListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE;
}

// "http://localhost:8000/api/events/create/"
export function getCreateEventURL() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + URL_SEGMENTS.EVENTS_CREATE;
}

// "http://localhost:8000/api/events/<int:id>/update/"
export function getUpdateEventURL(eventId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + eventId + URL_SEGMENTS.EVENTS_UPDATE;
}

// "http://localhost:8000/api/events/<int:id>/delete/"
export function getDeleteEventURL(eventId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + eventId + URL_SEGMENTS.EVENTS_DELETE;
}

// #endregion

// #region Functions to return a URL for an API call (users)

// "http://localhost:8000/api/users/register/"
export function getRegisterUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_REGISTER;
}

// "http://localhost:8000/api/users/token/"
export function getTokenUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_TOKEN;
}

// "http://localhost:8000/api/users/token/refresh/"
export function getTokenRefreshUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_TOKEN + URL_SEGMENTS.USERS_REFRESH;
}

// "http://localhost:8000/api/users/currentUser/"
export function getCurrentUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_CURRENTUSER;
}

// #endregion

// #region Functions to return a URL for a redirect

// "http://localhost:3000/posts/create/"
export function gotoCreatePostPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + URL_SEGMENTS.POSTS_CREATE;
}

// "http://localhost:3000/posts/<int:id>/"
export function gotoDetailedPostPage(postId: number|string) {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + postId + "/";
}

// "http://localhost:3000/posts/"
export function gotoPostListPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME;
}

// "http://localhost:3000/users/login/"
export function gotoLoginPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.USERS_HOME + URL_SEGMENTS.USERS_LOGIN;
}

// #endregion

//#region Functions for profile api

//"http//locatlhost:8000/api/profile/"
export function getProfileUrl(){
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.PROFILE_API
}

// #endregion
