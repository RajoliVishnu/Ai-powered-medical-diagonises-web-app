import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, LogOut, Home, Stethoscope, Menu, X, Phone, CreditCard, Info, Users, Shield, Calendar, FileText, Pill, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      const hash = path.slice(path.indexOf('#'));
      return location.pathname === '/' && location.hash === hash;
    }
    return location.pathname === path;
  };

  const mainNavigationItems = [
    { path: '/', label: 'Home', icon: Home, description: 'Main page' },
    { path: '/dashboard', label: 'Dashboard', icon: Users, description: 'Your health overview' },
    { path: '/diseases', label: 'Health Check', icon: Heart, description: 'Check your health' },
  ];

  const servicesNavigationItems = [
    { path: '/doctors', label: 'Find Doctors', icon: Stethoscope, description: 'Consult specialists' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, description: 'Schedule consultations' },
    { path: '/medical-records', label: 'Medical Records', icon: FileText, description: 'View your history' },
    { path: '/prescriptions', label: 'Prescriptions', icon: Pill, description: 'Manage medications' },
    { path: '/disease-prescriptions', label: 'Disease Prescriptions', icon: FileText, description: 'View by condition' },
    { path: '/transaction-history', label: 'Transaction History', icon: CreditCard, description: 'View payment history' },
  ];

  const otherNavigationItems = [
    { path: '/subscription', label: 'Plans', icon: CreditCard, description: 'Subscription plans' },
    { path: '/about', label: 'About Us', icon: Info, description: 'Learn about us' },
    { path: '/contact', label: 'Help & Support', icon: Phone, description: 'Get help' }
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg shadow-sm">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-extrabold font-display bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    MediCare AI
                  </span>
                  <div className="text-xs text-gray-500">Healthcare for Everyone</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Main Navigation */}
              {user && mainNavigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className="flex flex-col items-center px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Stethoscope className="h-5 w-5 mb-1" />
                  <div className="flex items-center">
                    <span className="font-medium">Services</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                </button>

                {isServicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {servicesNavigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Navigation */}
              {user && otherNavigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {/* User Info - Desktop */}
                  <div className="hidden md:flex items-center space-x-3 px-3 py-2 glass rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 text-xs">Patient</div>
                    </div>
                  </div>
                  
                  {/* Logout Button - Desktop */}
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 btn-gradient rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  {/* User Info - Mobile */}
                  <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 text-sm">Welcome back!</div>
                    </div>
                  </div>

                  {/* Main Navigation Items - Mobile */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Main</h3>
                    {mainNavigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Services Navigation Items - Mobile */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Services</h3>
                    {servicesNavigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Other Navigation Items - Mobile */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Other</h3>
                    {otherNavigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Logout - Mobile */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs text-gray-500">Sign out of your account</div>
                    </div>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Login to Your Account
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 btn-gradient text-white rounded-lg transition-colors text-center font-medium"
                  >
                    Create New Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Help Banner for Remote Users */}
      {user && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Need Help?</span>
                <span className="hidden sm:inline">Call our support team: +91-1800-123-4567 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <Link to="/help" className="text-blue-600 hover:text-blue-800 font-medium">
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;