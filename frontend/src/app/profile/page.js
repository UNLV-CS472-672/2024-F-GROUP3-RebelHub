"use client";
import Sidebar from '../../components/sidebar/sidebar';
import RebelHubNavBar from '../../components/navbar/RebelHubNavBar';
import './profile.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes'
import api from '@/utils/api'
import { getPostCountUrl, getProfileUrl } from '@/utils/url-segments';
import { useRouter } from 'next/navigation'



export default function Profile( { currentPictureUrl, userId }) {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [postCount, setPostCount] = useState(0);

  const editProfileButton = () =>{
    router.push("/profile/editprofile")
  }

  useEffect(() => {
    const fetchProfile = async () => {

      try {
          const response = await api.get(getProfileUrl())
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
          const response = await api.get(getPostCountUrl())
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
        <RebelHubNavBar />
        <div style={{ display: 'flex', backgroundColor:'#37474f'}}>
          <Sidebar />
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
                      {/* edit later */}
                      <span className='countervalue'>{postCount}</span>
                      <span className='counterlabel'> Posts</span>
                    </div>
                    <div className='counter'>
                      {/* edit later */}
                      <span className='countervalue'>{profile.hubs_count}</span>
                      <span className='counterlabel'> Hubs</span>
                    </div>

                  </div>

                  <h2>{profile.name}</h2>
                  <p>@{profile.username}</p>
                  <p>{profile.bio}</p>
                
                </div>
              </div>

              <div className='actionButtons'>
                <button className='actionButton' onClick={editProfileButton}>Edit Profile</button>
              </div>


              <div className='divider'></div>
              <div className='viewToggle'>
                <button className='posttabs'
                //   className={view === 'posts' ? styles.activeButton : styles.button}
                //   onClick={() => setView('posts')}
                >
                  Posts
                </button>
                <button className='posttabs'
                //   className={view === 'tagged' ? styles.activeButton : styles.button}
                //   onClick={() => setView('tagged')}
                >
                  Media
                </button>
              </div>


            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
