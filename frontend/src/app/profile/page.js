"use client";
import axios from 'axios';
import React from 'react';
import './profile.css'
import profilepic from '../public/spork.png'

export default function Profile () {
	return(
		<body>
			<div className='ProfileHeader'>
				<div className='ProfilePicture'>
					<button className="Photo" title="Change profile photo">
						<img src={profilepic} alt="profile pic"/>
					</button>
					<h1 className='ProfileName'> NAME </h1>
				</div>
				<div className='SecondDivision'>
					<ul className='Settings'>
						<li><button>Edit Profile</button></li>
						<li><button>Archives</button></li>
						<li><button>Settings</button></li>
					</ul>
					<ul className='PFF'>
						<li><a>10 Posts</a></li>
						<li><a>20 Followers</a></li>
						<li><a>20 Following</a></li>
					</ul>
					<p className='ProfileDescription'>
						This is for the description of whatever, testing the length of this is going to be a fun time!
					</p>
					
				</div>
			</div>
			<div className='PostChoices'>
				<ul>
					<li><button><a>Posts</a></button></li>
					<li><button><a>Saved</a></button></li>
					<li><button><a>Tagged</a></button></li>
				</ul>
			</div>
		</body>
	)
		
}