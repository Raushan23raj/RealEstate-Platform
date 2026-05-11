import React, { useState } from "react";
import { navbarStyles as s } from "../../assets/dummyStyles.js";
import Logo from "./Logo.jsx";
import { useAuth } from "../../context/authcontext.jsx";
import { Link } from "react-router-dom";
import { HiX, HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const { user, logout } = useAuth();

      //to toggle the menu for mobile
      const toggleMenu = () => setIsOpen(!isOpen);

      //navlinks
      const navLinks = (
            <>
                  {(!user || user.role !== "buyer") && (
                        <Link to="/properties" className={s.navLink} onClick={() => setIsOpen(false)}>
                              Browse Properties
                        </Link>
                  )}
                  {user?.role === "buyer" && (
                        <>
                              <Link to="/" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Home
                              </Link>
                              <Link to="/properties" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Properties
                              </Link>
                              <Link to="/whishList" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Wishlist
                              </Link>
                              <Link to="/chat" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Messages
                              </Link>
                              <Link to="/contact" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Contact us
                              </Link>
                        </>
                  )}
                  {user?.role === "seller" && (
                        <Link to="/dashboard" className={s.navLink} onClick={() => setIsOpen(false)}>
                              Dashboard
                        </Link>
                  )}
                  {user?.role === "admin" && (
                        <Link to="/admin-dashboard" className={s.navLink} onClick={() => setIsOpen(false)}>
                              Admin Panel
                        </Link>
                  )}
                  {!user && (
                        <>
                              <Link to="/login" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Login
                              </Link>
                              <Link to="/registeruser" className={s.navLink} onClick={() => setIsOpen(false)}>
                                    Register
                              </Link>
                        </>
                  )}
            </>
      )

      return (
            <>
                  <nav className={s.nav}>
                        <div className={s.container}>
                              <div className={s.grid}>
                                    <div className='justify-self-start'>
                                          <Logo />
                                    </div>
                                    <div className={s.desktopMenu}>{navLinks}</div>
                                    <div className={s.rightSection}>
                                          {user ? (
                                                <div className={s.userSection}>
                                                      <Link to="/profile" className="flex items-center">
                                                            <img src={
                                                                  user.profilePic ||
                                                                  `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                                                            }
                                                                  alt="Profile"
                                                                  className={s.avatar} />
                                                      </Link>
                                                      <button onClick={logout} className={s.logoutButton}>
                                                            Logout
                                                      </button>
                                                </div>
                                          ) : null}
                                          {/* mobile toggle */}
                                          <div className={s.mobileToggle} onClick={toggleMenu}>
                                                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </nav>
                  <div className={s.backdrop(isOpen)} onClick={() => setIsOpen(false)}></div>
                  <div className={s.drawer(isOpen)}>
                        <div className={s.drawerHeader}>
                              <Logo onClick={() => setIsOpen(false)} />
                              <HiX size={28} onClick={() => setIsOpen(false)}
                                    className={s.drawerCloseIcon}
                              />
                        </div>
                        <div className={s.drawerNavLinks}>{navLinks}</div>
                        {user && (
                              <div className={s.drawerUserSection}>
                                    <div className={s.drawerUserInfo}>
                                          <img ssrc={
                                                user.profilePic ||
                                                `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                                          }
                                                alt="Profile"
                                                className={s.drawerAvatar}
                                          />
                                          <div>
                                                <div className={s.drawerUserName}>{User.name}</div>
                                                <div className={s.drawerUserEmail}>{User.emial}</div>
                                          </div>
                                    </div>
                                    <button onClick={logout} className={s.drawerLogoutButton}>
                                      Logout
                                    </button>
                                    </div>

                        )}
                  </div>
            </>
      )
}

export default Navbar
