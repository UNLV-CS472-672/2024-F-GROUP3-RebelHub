import { getCommentsListUrl, getEditPostUrl } from "@/utils/url-segments";
import api from "../../utils/api";

const calculate_time_factor = (timestamp) => {
    if (timestamp >= (timezone.now() - timedelta(hours=4))) return 5;
    else if (timestamp >= (timezone.now() - timedelta(hours=12))) return 4.5;
    else if (timestamp >= (timezone.now() - timedelta(hours=24))) return 4;
    else if (timestamp >= (timezone.now() - timedelta(days=3))) return 3;
    else if (timestamp >= (timezone.now() - timedelta(weeks=1))) return .5;
    else if (timestamp >= (timezone.now() - timedelta(weeks=2))) return .1;
    else if (timestamp >= (timezone.now() - timedelta(weeks=4))) return .01;
    else if (timestamp >= (timezone.now() - timedelta(weeks=8))) return .0025;
    else return .0001;
}

const calculate_hot_score = (likes, comments, timestamp) => {
    likes_score = likes * calculate_time_factor(timestamp)
    comments_score = 0
    for (let comment in comments)
        comments_score += calculate_time_factor(comment.timestamp)
    return likes_score + comments_score
}

const set_hot_score = async (posts) => {
    for (let post of posts){
        comments = [];
        try {
            const response = await api.get(getCommentsListUrl(post.id)); 
            comments = response.data;
            console.log(response.data);
            console.log("Successful fetch of comments");
        } catch (error) { console.log("Error fetching comments: ", error); }
        new_hot_score = calculate_hot_score(post.likes.length, comments, post.timestamp);
        try {
            const response = await api.patch(getEditPostUrl(post.id), { hot_score: new_hot_score });
            console.log(response.data);
            console.log("Successful update of hot score");
        } catch (error) { console.log("Error updating hot score: ", error)}; 
    }
}

export default set_hot_score;

