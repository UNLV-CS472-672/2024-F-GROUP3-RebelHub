"use client"
import React, { useState, useEffect } from 'react';
import './profileedit.css';
import RebelHubNavBar from '../../../components/navbar/RebelHubNavBar';
import ProtectedRoute from '../../../components/Accounts/ProtectedRoutes'
import { getProfileUrl } from '@/utils/url-segments';
import api from '@/utils/api';
import Sidebar from '../../../components/sidebar/sidebar';
import { useRouter } from 'next/navigation';




export default function ProfileEdit(){
    const router = useRouter();

    const [name, setName] = useState('Name');
    const [bio, setBio] = useState('Lorem ipsum dolor sit amet.');
    const [profilePic, setProfilePicture] = useState(null);
    const [currpfp, setCurrPfp] = useState(null)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProfile = async () => {
    
          try {
              const response = await api.get(getProfileUrl())
              if(response.status == 200){
                setName(response.data.name);
                setBio(response.data.bio);
                setCurrPfp(`http://localhost:8000${response.data.pfp}`);
              }
          } catch (error) {
              console.error('Error fetching profile:', error);
          }
        };
      fetchProfile();
    
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
          setName(value);
        } else if (name === 'bio') {
          setBio(value);
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setProfilePicture(file);
        }
    };
    
    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
    
        if (profilePic) {
          formData.append('pfp', profilePic);
        }
    
        try {
          const response = await api.put(getProfileUrl(), formData);
    
          console.log('Profile updated successfully:', response.data);
          setProfilePicture(response.data.pfp); 
          router.push('/profile'); 
          router.refresh();
        } catch (error) {
          console.log(profilePic);

          console.error('Error updating profile:', error.response.data);
        } finally {
          setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <RebelHubNavBar />
                <div style = {{ display:'flex' }}>
                    <Sidebar/>
                    <div className="container">
                        <form onSubmit={(e) => e.preventDefault()}>
                        <div className="profile">
                            <div className="profile-pic">
                                <img src={currpfp} alt="Profile" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="change-pic" 
                                />
                            </div>
                            <div className="profile-info">
                                <h2>Edit Profile</h2>
                                    <div className="input-group">
                                        <label>Name</label>
                                        <input 
                                            type={"text"} 
                                            id={"name"} 
                                            name="name"
                                            value={name} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Bio</label>
                                        <textarea 
                                            name="bio"
                                            id={"bio"} 
                                            value={bio} 
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <button onClick={handleSave}>Save Changes</button>
                                    </div>
                            </div>
                          </div>
                          </form>
                  </div>
              </div>
          </div>
        </ProtectedRoute>
        
    );
};
