'use client';
import Sidebar from '@/components/sidebar/sidebar';
import RebelHubNavBar from '@/components/navbar/RebelHubNavBar';
import UserPosts from '@/components/posts/profile_posts/UserPosts'
import PictureGallery from '@/components/Picture/Picture'

import './profile.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes'
import api from '@/utils/api'
import { getPostCountUrl, getOtherProfileUrl} from '@/utils/url-segments';



export default function Profile( { params } ) {

  const { username } = params;

  const [profile, setProfile] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');




  useEffect(() => {
    const fetchProfile = async () => {

      try {
          const response = await api.get(getOtherProfileUrl(username))
          if(response.status == 200){
            setProfile(response.data);
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
      }
    };

    fetchProfile();
  }, [])

  useEffect(() => {
    const fetchPostCount = async () => {

      try {
          const response = await api.get(getPostCountUrl(username))
          if(response.status == 200){
            setPostCount(response.data.post_count);
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
          setPostCount(0);
      }
    };

    fetchPostCount();
  }, []);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if(!profile){
    return (
      <ProtectedRoute>
        <div>error 404: failed</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        <div style={{ display: 'flex', backgroundColor:'#37474f'}}>
          <div className='content'>
            <main className='body'>
              <div className='profileInfo'>
                <label htmlFor='profilePicInput' className='profileImageLabel'>
                  <img
                    src={`http://localhost:8000${profile.pfp}`}
                    alt='Profile Picture'
                    width={200}
                    height={200}
                    className='profileImage'
                  />
                </label>
                <div className='userDetails'>
                  <div className='sectioncount'>
                    <div className='counter'>
                      <span className='countervalue'>{postCount}</span>
                      <span className='counterlabel'> Posts</span>
                    </div>
                    <div className='counter'>
                      <span className='countervalue'>{profile.hubs_count}</span>
                      <span className='counterlabel'> Hubs</span>
                    </div>

                  </div>

                  <h2>{profile.name}</h2>
                  <p>@{profile.username}</p>
                  <p>{profile.bio}</p>
                
                </div>
              </div>

              <div className='divider'></div>
              <div className='viewToggle'>
                <button className={`posttabs ${activeTab === 'posts' ? 'activeButton' : ''}`}
                  onClick={() => handleTabClick('posts')}
                >
                  Posts
                </button>
                <button className={`posttabs ${activeTab === 'Media' ? 'activeButton' : ''}`}
                  onClick={()=>handleTabClick('Media')}
                >
                  Media
                </button>
              </div>
              <div className='viewToggle'>
                {activeTab === 'posts' ? (
                  <div className='posts'>
                    <UserPosts username={profile.username} name={profile.name} />
                  </div>
                ) : (
                  <div className='photos'>
                    <PictureGallery username={profile.username} />
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
