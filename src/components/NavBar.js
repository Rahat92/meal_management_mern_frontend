import { Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLogoutMutation } from '../features/bikri/bikriApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [navigation, setNavigation] = useState([
    { name: 'Summary', href: '/all-month-stats', current: false },
  ]);
  const [logout, { isSuccess }] = useLogoutMutation();
  const { user } = useSelector((state) => state.auth);
  const [hideNav, setHideNav] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'superadmin' || user.role === 'admin')) {
      setNavigation([
        { name: 'Dashboard', href: '/admin-dashboard', current: true },
        { name: 'Summary', href: '/all-month-stats', current: false },
        { name: 'Expenses', href: '/meal-expense-summary', current: false },
      ]);
    }
  }, [user]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        
        .nav-container {
          font-family: 'Poppins', sans-serif;
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::before {
          width: 100%;
        }
        
        .nav-link.active::before {
          width: 100%;
        }
        
        .mobile-nav {
          animation: slideDown 0.3s ease-out;
          backdrop-filter: blur(10px);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .profile-avatar {
          transition: all 0.3s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        .notification-btn {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .notification-btn:hover {
          transform: scale(1.1);
        }
        
        .logo-img {
          transition: transform 0.3s ease;
        }
        
        .logo-img:hover {
          transform: rotate(5deg) scale(1.05);
        }
        
        .menu-button {
          transition: all 0.3s ease;
        }
        
        .menu-button:hover {
          background: rgba(59, 130, 246, 0.1);
        }
      `}</style>

      <Disclosure as="nav" className="nav-container bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-xl z-[500000] sticky top-0">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton
                onClick={(e) => {
                  e.stopPropagation();
                  setHideNav((prev) => !prev);
                }}
                className="menu-button group relative inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
              </DisclosureButton>
            </div>

            {/* Logo and Navigation Links */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {/* Logo */}
              <div className="flex shrink-0 items-center">
                <Link to="/advance-sheet" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <img
                      alt="Meal Management"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                      className="logo-img relative h-9 w-auto"
                    />
                  </div>
                  <span className="hidden sm:block text-white font-bold text-lg tracking-tight">
                    Meal<span className="text-blue-400">Manager</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:ml-8 sm:block">
                <div className="flex space-x-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'nav-link',
                        item.current
                          ? 'active bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                        'rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Notifications Button */}
              <button
                type="button"
                className="notification-btn relative rounded-full bg-slate-700 p-2 text-slate-400 hover:text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
                {/* Notification badge */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span>
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="profile-avatar relative flex rounded-full bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="User profile"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-9 w-9 rounded-full ring-2 ring-slate-600"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-[11] mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <p className="text-sm font-semibold text-white">Signed in as</p>
                    <p className="text-sm text-blue-100 truncate">{user?.name || 'User'}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        logout();
                      }}
                    >
                      {({ focus }) => (
                        <button
                          className={classNames(
                            focus ? 'bg-blue-50 text-blue-600' : 'text-slate-700',
                            'group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors'
                          )}
                        >
                          <svg
                            className="h-5 w-5 text-slate-400 group-hover:text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="sm:hidden">
          <div
            className={classNames(
              'mobile-nav absolute z-[110000000000] w-full bg-slate-800/95 backdrop-blur-md shadow-2xl border-t border-slate-700',
              !hideNav ? 'block' : 'hidden'
            )}
          >
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHideNav(true);
                  }}
                  className={classNames(
                    item.current
                      ? 'bg-slate-700 text-white border-l-4 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white border-l-4 border-transparent hover:border-blue-400',
                    'block rounded-r-lg px-4 py-3 text-base font-semibold transition-all duration-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
}