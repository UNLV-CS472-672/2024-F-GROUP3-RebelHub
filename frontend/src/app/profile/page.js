// pages/profile.js
// import { useState } from 'react';
import Sidebar from '../components/sidebar';
import Image from 'next/image';
import './profile.css';


export default function Profile() {
//   const [profilePic, setProfilePic] = useState('/profile-pic.jpg'); // Default profile picture
//   const [view, setView] = useState('posts'); // State to manage selected view

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePic(reader.result);
//       };
//       reader.readAsDataURL(file); // Convert image to base64 URL
//     }
//   };

  return (
    <div style={{ display: 'flex', backgroundColor:'#37474f'}}>
      <Sidebar />
      <div className="content">
        <header className="header">
          <h1>SearchBar?</h1>
        </header>
        <main className="body">
          <div className="profileInfo">
            <label htmlFor="profilePicInput" className="profileImageLabel">
              <Image
                src="/spork.png"
                alt="Profile Picture"
                width={200}
                height={200}
                className="profileImage"
              />
            </label>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
            //   onChange={handleImageChange}
              className="profilePicInput"
              style={{ display: 'none' }}
            />
            <div className="userDetails">
              <div className='sectioncount'>
                <div className='counter'>
                  {/* edit later */}
                  <span className='countervalue'>10</span>
                  <span className='counterlabel'> Posts</span>
                </div>
                <div className='counter'>
                  {/* edit later */}
                  <span className='countervalue'>5</span>
                  <span className='counterlabel'> Hubs</span>
                </div>

              </div>

              <h2>John Jane Doe</h2>
              <p>@johnjanedoe</p>
              <p>User Bio I have no clue how long it needs to be in order for it to fit</p>
            
            </div>
          </div>

          <div className="actionButtons">
            <button className="actionButton">Edit Profile</button>
            <button className="actionButton">Settings</button>
            <button className="actionButton">View Archives</button>
          </div>


          <div className='divider'></div>
          <div className="viewToggle">
            <button className='posttabs'
            //   className={view === 'posts' ? styles.activeButton : styles.button}
            //   onClick={() => setView('posts')}
            >
              Posts
            </button>
            <button className='posttabs'
            //   className={view === 'archived' ? styles.activeButton : styles.button}
            //   onClick={() => setView('archived')}
            >
              Saved
            </button>
            <button className='posttabs'
            //   className={view === 'tagged' ? styles.activeButton : styles.button}
            //   onClick={() => setView('tagged')}
            >
              Tagged
            </button>
          </div>


        </main>
      </div>
    </div>
  );
}
