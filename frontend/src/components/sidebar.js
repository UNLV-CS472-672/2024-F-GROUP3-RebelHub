import React from 'react'
import './sidebar.css'
import Link from 'next/link'

export default function Sidebar() {
    return(
        <div className='sidebar'>
            <div className='logo'>
                <img
                    width={250} 
                    height={100} 
                    src="/UNLV.png"
                    className='logo'
                />
            </div>
            <Link href="/profile" className='link'>Explore</Link>
            <Link href="/profile" className='link'>Hubs</Link>
            <Link href="/profile" className='link'>Calendar</Link>
            <Link href="/profile" className='link'>Post</Link>
        </div>
    )
}
