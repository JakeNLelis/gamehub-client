import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  Gamepad2,
  Heart,
  Star,
  MessageSquare,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="relative bg-slate-800 border-t border-slate-700 mt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4">
          <Gamepad2 className="w-24 h-24 text-blue-400 transform rotate-12" />
        </div>
        <div className="absolute top-12 right-8">
          <Star className="w-16 h-16 text-purple-400 transform -rotate-6" />
        </div>
        <div className="absolute bottom-8 left-1/4">
          <Heart className="w-20 h-20 text-pink-400 transform rotate-45" />
        </div>
        <div className="absolute bottom-4 right-1/3">
          <MessageSquare className="w-18 h-18 text-green-400 transform -rotate-12" />
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform rotate-3 shadow-lg">
                  <img src="/joystick.png" alt="" className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                GameHub
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Your ultimate destination for game discovery, reviews, and
              community engagement. Join thousands of gamers worldwide.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="group">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 group-hover:scale-110">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>{" "}
              <a href="#" className="group">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 group-hover:scale-110">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-all duration-300 group-hover:scale-110">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </h4>{" "}
            <ul className="space-y-3">
              <li>
                <Link
                  to="/games"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Browse Games</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Reviews</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg relative">
              Account
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {user ? (
                <>
                  {" "}
                  <li>
                    <Link
                      to="/profile"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {" "}
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>Sign In</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>Sign Up</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-12 pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2025 GameHub. All rights reserved. Made with ❤️ for gamers.
            </p>{" "}
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                to="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
