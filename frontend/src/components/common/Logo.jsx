import React from 'react'
import { Link } from 'react-router-dom'
import { logoStyles as s } from '../../assets/dummyStyles.js'
import { HiOutlineLibrary } from 'react-icons/hi'

const Logo = ({
  fontSize = "1.5rem",
  iconSize = 24,
  showText = true,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <Link to='/'
      {...props}
      className={`${s.link} ${className}`.trim()}
      style={{ fontSize, ...style }}
    >
      <div className={s.iconWrapper}>
        <HiOutlineLibrary size={iconSize} />
      </div>
      {showText && <span className={s.text}>RealEstate</span>}
    </Link>
  )
}

export default Logo