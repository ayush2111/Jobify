import React from 'react'
import links from '../utils/link'
import { NavLink } from 'react-router-dom'
export const Navlink = ({toggleSidebar}) => {
  return (
    <div className='nav-links'>
    {links.map((link)=>{
      const{text,path,id,icon}=link
      return(
        <NavLink
        to={path}
        className={({isActive})=> isActive?'nav-link active':'nav-link'}
        key={id}
        onClick={toggleSidebar}>
          <span className='icon'>{icon}</span>
          {text}
        </NavLink>
      )
    })}
    </div>
  )
}
