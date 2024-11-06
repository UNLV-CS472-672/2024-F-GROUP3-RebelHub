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
};

// #region Functions to return a URL for an API call (hubs)

export function getHubListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE;
}

export function getJoinedHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_JOINED;
}

export function getModdingHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_MODDING;
}

export function getOwnedHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_OWNED;
}

export function getHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + "/";
}

export function getCreateHubsUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + URL_SEGMENTS.HUBS_CREATE;
}

export function getDeleteHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_DELETE;
}

export function getUpdateHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_UPDATE;
}

export function getJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_JOIN;
}

export function getRequestJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_REQUEST_JOIN;
}

export function getCancelRequestJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_CANCEL_REQUEST_JOIN;
}

export function getLeaveHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_LEAVE;
}

export function getKickHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_KICK;
}

export function getAcceptoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_ACCEPT_JOIN;
}

export function getDeclineJoinHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_DECLINE_JOIN;
}

export function getModsAddHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_MODS_ADD;
}

export function getModsRemoveHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_MODS_REMOVE;
}

export function getPostsHubUrl(hubId) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.HUBS_API_BASE + hubId + URL_SEGMENTS.HUBS_POSTS;
}

// #endregion

// #region Functions to return a URL for an API call (posts)

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

// #endregion

// #region Functions to return a URL for an API call (events)

export function getEventListUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE;
}

export function getCreateEventURL() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + URL_SEGMENTS.EVENTS_CREATE;
}

export function getUpdateEventURL(eventId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + eventId + URL_SEGMENTS.EVENTS_UPDATE;
}

export function getDeleteEventURL(eventId: number|string) {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.EVENTS_API_BASE + eventId + URL_SEGMENTS.EVENTS_DELETE;
}

// #endregion

// #region Functions to return a URL for an API call (users)

export function getRegisterUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_REGISTER;
}

export function getTokenUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_TOKEN;
}

export function getTokenRefreshUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_TOKEN + URL_SEGMENTS.USERS_REFRESH;
}

export function getCurrentUserUrl() {
    return URL_SEGMENTS.BACKEND + URL_SEGMENTS.USERS_API_BASE + URL_SEGMENTS.USERS_CURRENTUSER;
}

// #endregion

// #region Functions to return a URL for a redirect

export function gotoCreatePostPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + URL_SEGMENTS.POSTS_CREATE;
}

export function gotoDetailedPostPage(postId: number|string) {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + postId + "/";
}

export function gotoPostListPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME;
}

export function gotoLoginPage() {
    return URL_SEGMENTS.FRONTEND + URL_SEGMENTS.USERS_HOME + URL_SEGMENTS.USERS_LOGIN;
}

// #endregion