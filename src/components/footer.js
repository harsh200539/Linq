"use client";

import logo from '../images/logo-light.webp';
import { Linkedin } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import Image from "next/image";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === '/' || pathname === '/home' || pathname === '/about-us' || pathname === '/services' || pathname === '/careers' || pathname === '/contact';

  const handleNavClick = (sectionId, route = null) => {
    if (isHomePage && !route) {
      scrollToSection(sectionId);
    } else {
      router.push('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="py-5 bg-linq-dark text-linq-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8 mb-4 mb-md-0 d-flex flex-column flex-md-row align-items-md-center">
            <div className="me-md-4 mb-3 mb-md-0 footer-logo">
              <Link href="/">
                <Image
                  src={logo}
                  width={100}
                  height={40}
                  style={{ cursor: 'pointer', margin: '10px', height: 'auto' }}
                  alt="LINQ Logo"
                />
              </Link>
            </div>
          </div>

          <div className="col-md-4 text-md-end">
            <p className="small mb-2">Follow us</p>
            <div className="d-flex gap-2 justify-content-md-end">
              <a href="https://www.linkedin.com/company/linq-corporate-solutions-pvt-ltd" target="_blank" rel="noopener noreferrer">
                <Linkedin size={36} color="#ffffff" strokeWidth={1.25} />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-md-6 small text-muted text-linq-white">
            © 2026 LINQ Corporate Solutions Pvt. Ltd. All rights reserved.
          </div>
          <div className="col-md-6 text-md-end small text-linq-white">
            <button className="btn btn-link me-3 text-linq-white text-decoration-none p-0" style={{ fontSize: 'inherit' }}>Terms</button>
            <button className="btn btn-link me-3 text-linq-white text-decoration-none p-0" style={{ fontSize: 'inherit' }}>Privacy</button>
            <button className="btn btn-link text-linq-white text-decoration-none p-0" style={{ fontSize: 'inherit' }}>Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
