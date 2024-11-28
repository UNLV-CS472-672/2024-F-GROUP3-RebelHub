import React from 'react'
import './sidebar.css'
import Link from 'next/link'

export default function Sidebar() {
    return(
        <div className='sidebar'>
            <Link href="/profile" className='link'>Hubs</Link>
            <Link href="/calendar" className='link'>Calendar</Link>
            <Link href="/posts" className='link'>Post</Link>
        </div>
    )
}
