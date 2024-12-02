import React from 'react'
import './sidebar.css'
import Link from 'next/link'

export default function Sidebar() {
    return(
        <div className='sidebar'>
            <Link href="/profile/" className='link'>My Profile</Link>
            <Link href="/calendar/" className='link'>Calendar</Link>
            <Link href="/explore/" className='link'>Explore</Link>
            <Link href="/hubs/" className='link'>Hubs</Link>
        </div>
    )
}
