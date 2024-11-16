import { getCommentsListUrl } from "@/utils/url-segments";
import api from "../../utils/api";

const calculate_time_factor = (timestamp) => {
    const now = new Date()
    if (timestamp >=  new Date(now.getTime() - (4 * 60 * 60 * 1000))) return 5; // 4 hours
    else if (timestamp >= new Date(now.getTime() - (12 * 60 * 60 * 1000))) return 4.5; // 12 hours
    else if (timestamp >= new Date(now.getTime() - (24 * 60 * 60 * 1000))) return 4; // 24 hours
    else if (timestamp >= new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000))) return 3; // 3 days
    else if (timestamp >= new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))) return .5; // 1 week
    else if (timestamp >= new Date(now.getTime() - (2 * 7 * 24 * 60 * 60 * 1000))) return .1; // 2 weeks
    else if (timestamp >= new Date(now.getTime() - (4 * 7 * 24 * 60 * 60 * 1000))) return .01; // 4 weeks
    else if (timestamp >= new Date(now.getTime() - (8 * 7 * 24 * 60 * 60 * 1000))) return .0025; // 8 weeks
    else return .0001;
}

const calculate_hot_score = (likes, comments, timestamp) => {
    let likes_score = likes * calculate_time_factor(timestamp)
    let comments_score = 0
    for (let comment in comments)
        comments_score += calculate_time_factor(comment.timestamp)
    return likes_score + comments_score
}

const set_hot_score = async (posts) => {
    for (let post of posts){
        let comments = [];
        try {
            const response = await api.get(getCommentsListUrl(post.id)); 
            comments = response.data;
            console.log(response.data);
            console.log("Successful fetch of comments");
        } catch (error) { console.log("Error fetching comments: ", error); }
        calculate_hot_score(post.likes.length, comments, post.timestamp)
    }
}

export default set_hot_score;