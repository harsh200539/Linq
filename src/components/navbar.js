"use client";

import { Menu, X } from "lucide-react"
import logo from '../images/Logo/logo-light.webp'
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export function Navbar({ bgColor }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const navbarRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const normalizedPath = pathname?.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isHomePage = normalizedPath === '/' || normalizedPath === '/home' || normalizedPath === '/about-us' || normalizedPath === '/services' || normalizedPath === '/careers' || normalizedPath === '/contact' || normalizedPath === '/life-at-linq';

  const dispatchScroll = (pathOrId) => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('linq-manual-scroll', { detail: pathOrId }));
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header
      className="navbar navbar-expand-lg navbar-dark navbar_linq py-3 fixed-top"
      style={bgColor ? { background: bgColor, backgroundColor: bgColor } : {}}
      ref={navbarRef}
    >
      <div className="container">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <Image
            src={logo}
            width={120}
            height={48}
            style={{ cursor: 'pointer', height: 'auto' }}
            alt="LINQ Logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/')}
                >
                  Home
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/')}
                >
                  Home
                </button>
              )}
            </li>
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/about-us"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => {
                    router.push("/about-us");
                    setIsOpen(false);
                  }}
                >
                  About Us
                </button>
              )}
            </li>
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/services"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/services')}
                >
                  What We Do
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/services')}
                >
                  What We Do
                </button>
              )}
            </li>
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/life-at-linq"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/life-at-linq')}
                >
                  Life at Linq
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/life-at-linq')}
                >
                  Life at Linq
                </button>
              )}
            </li>
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/#careers"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('careers')}
                >
                  Careers
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('careers')}
                >
                  Careers
                </button>
              )}
            </li>
            <li className="nav-item mx-2">
              {isMounted ? (
                <Link
                  href="/contact"
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/contact')}
                >
                  Contact Us
                </Link>
              ) : (
                <button
                  className="nav-link text-linq-white bg-transparent border-0"
                  onClick={() => dispatchScroll('/contact')}
                >
                  Contact Us
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
