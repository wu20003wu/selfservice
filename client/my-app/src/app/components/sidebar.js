'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { 
  Home, 
  Settings, 
  Shield, 
  User, 
  Menu,
  Ticket,
  BicepsFlexed  ,
} from 'lucide-react';

export default function Sidebar() {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
    
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [currentPath]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.sub);
      }
    }
  }, []);

  const navItems = [
    { href: "/", label: "Tickets", icon: <Ticket className="w-5 h-5" /> },
    { href: "/selfservice", label: "Selfservice", icon: <BicepsFlexed className="w-5 h-5" /> },
    { href: "/admin", label: "Admin", icon: <Shield className="w-5 h-5" /> },
    { href: "/login", label: "Login", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-all duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        w-64`}>

        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">
            OMS Support
          </h1>
        </div>

        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                ${currentPath === item.href 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {item.icon}
              <span className="opacity-100">
                {item.label}
              </span>
            </Link>
          ))}
          <div className="mt-4 p-3 text-sm text-gray-600">
            {username && `Logged in as: ${username}`}
          </div>
        </nav>
      </aside>
    </>
  );
}