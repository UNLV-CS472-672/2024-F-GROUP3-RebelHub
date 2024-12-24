import React from 'react'
import './sidebar.css'
import Link from 'next/link'

import margins from "@/utils/Margins.module.css";

export default function Sidebar() {
    
    return(
        <div className={margins.sidebar}>
            <Link href="/profile/" className='link'>My Profile</Link>
            <Link href="/calendar/" className='link'>Calendar</Link>
            <Link href="/explore/" className='link'>Explore</Link>
            <Link href="/hubs/" className='link'>Hubs</Link>
        </div>  
    )
}
