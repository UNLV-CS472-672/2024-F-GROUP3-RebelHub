import React, { useEffect, useState } from "react";
import api from '@/utils/api';  // import the configured axios instance
import { getUserPostsUrl } from '@/utils/url-segments';  // import the URL utility function
import './UserPosts.css'

export default function UserPosts({ username, name }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const response = await api.get(getUserPostsUrl(username) + `?page=${pageNum}`);
      console.log("Fetched posts from API:", response.data);

      const newPosts = response.data.results; // Assuming `results` is the key for the paginated posts.
      console.log("New posts:", newPosts);

      // Deduplicate the posts by id
      setPosts((prevPosts) => {
        const combinedPosts = [...prevPosts, ...newPosts];
        const uniquePosts = [
          ...new Map(combinedPosts.map((post) => [post.id, post])).values(),
        ]; 
        console.log("Unique posts after deduplication:", uniquePosts);
        return uniquePosts;
      });

      if (newPosts.length < 5) {
        setHasMorePosts(false);  
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [username, page]);

  const loadMorePosts = () => {
    if (!loading && hasMorePosts) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more posts
    }
  };

  return (
    <div className="posts-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <h3 className="post-title"><a href={`http://localhost:3000/posts/${post.id}`}>{post.title}</a></h3>
            <p className="post-message">{post.message}</p>
            {post.pictures[0] && (
            <div className="post-image">
              <img src={`http://localhost:8000/${post.pictures[0].image}`} alt="Post Image" className="post-image__img" />
            </div>
          )}

            <div className="post-meta">
              <span className="post-author">{name}</span>
              <span className="post-date">{new Date(post.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}

      {loading && <p>Loading...</p>}

      {hasMorePosts && !loading && (
        <button className="load-more" onClick={loadMorePosts}>
          Load More
        </button>
      )}

      {!hasMorePosts && <p className='nomore'>No more posts to load.</p>}
    </div>
  );
}
