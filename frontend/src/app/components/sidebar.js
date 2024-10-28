import React from 'react'
import './sidebar.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Sidebar() {
    return(
        <div className='sidebar'>
            <div className='logo'>
                <Image
                    width={250} 
                    height={100} 
                    src="/UNLV.png"
                    className='logo'
                />
            </div>
            <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className='link'>Home</Link>
            <Link href="/profile" className='link'>Explore</Link>
            <Link href="/profile" className='link'>Hubs</Link>
            <Link href="/profile" className='link'>Messages</Link>
            <Link href="/profile" className='link'>Notifications</Link>
            <Link href="/profile" className='link'>Calendar</Link>
            <Link href="/profile" className='link'>Post</Link>
            <Link href="/profile" className='link'>Profile</Link>
        </div>
    )
}