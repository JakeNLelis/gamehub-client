import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Cookie,
  Database,
  UserCheck,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to GameHub</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Your privacy is important to us. This policy explains how GameHub
            collects, uses, and protects your personal information.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Last updated: June 8, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Information We Collect
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Account Information
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Google Account Data:</strong> When you sign in
                      with Google, we collect your name, email address, and
                      profile picture from your Google account.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Profile Information:</strong> Any additional
                      information you choose to add to your GameHub profile,
                      including custom avatars you upload.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Usage Data
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Game Reviews:</strong> Reviews you write,
                      including ratings, titles, and content.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Favorites:</strong> Games you add to your
                      favorites list.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>App Usage:</strong> How you interact with GameHub,
                      including pages visited and features used.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Technical Data
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Device Information:</strong> Browser type,
                      operating system, and device identifiers.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Log Data:</strong> IP addresses, access times, and
                      error logs for security and debugging purposes.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                How We Use Your Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Service Provision
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Create and manage your account</li>
                    <li>• Personalize your gaming experience</li>
                    <li>• Store your reviews and favorites</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Communication
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Send important account updates</li>
                    <li>• Respond to your inquiries</li>
                    <li>• Notify about new features</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Security & Safety
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Protect against fraud and abuse</li>
                    <li>• Monitor for security threats</li>
                    <li>• Maintain platform integrity</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Improvement</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Analyze usage patterns</li>
                    <li>• Fix bugs and improve performance</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">
                Information Sharing
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">
                  We DO NOT sell your personal data
                </h3>
                <p className="text-gray-300 text-sm">
                  GameHub never sells, rents, or trades your personal
                  information to third parties for commercial purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  We may share information only in these limited cases:
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Public Content:</strong> Reviews and ratings you
                      post are visible to other users as part of the service.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Providers:</strong> Trusted third-party
                      providers who help us operate GameHub (Google OAuth,
                      hosting services).
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Legal Requirements:</strong> When required by law
                      or to protect our rights and safety.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Business Transfer:</strong> In the event of a
                      merger, acquisition, or sale of assets.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Security Measures
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Encrypted data transmission (HTTPS)</li>
                  <li>• Secure JWT token authentication</li>
                  <li>• Rate limiting to prevent abuse</li>
                  <li>• Regular security audits</li>
                  <li>• Secure file storage for avatars</li>
                  <li>• Input validation and sanitization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Data Retention
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Account data: Until you delete your account</li>
                  <li>• Reviews: Preserved for community value</li>
                  <li>• Log data: 90 days for security purposes</li>
                  <li>• Backup data: 30 days after account deletion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Cookie className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">
                Your Rights and Choices
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Account Control
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Update your profile information</li>
                  <li>• Change or remove your avatar</li>
                  <li>• Edit or delete your reviews</li>
                  <li>• Manage your favorites list</li>
                  <li>• Delete your account completely</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Data Rights
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Request a copy of your data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Request data deletion</li>
                  <li>• Withdraw consent (where applicable)</li>
                  <li>• Object to certain processing</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> When you delete your account, we
                permanently remove your personal data, reviews, and favorites.
                This action cannot be undone.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Third-Party Services
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Google OAuth
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  We use Google OAuth for secure authentication. Your
                  interaction with Google is governed by Google's Privacy
                  Policy.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  View Google's Privacy Policy
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  FreeToGame API
                </h3>
                <p className="text-gray-300 text-sm">
                  Game data is sourced from the FreeToGame API. We do not share
                  your personal information with this service.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-300 mb-4">
              GameHub is not intended for children under 13 years of age. We do
              not knowingly collect personal information from children under 13.
            </p>
            <p className="text-gray-300 text-sm">
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately so we can remove such information.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or your
              personal data, please contact us:
            </p>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong>Email:</strong> privacy@gamehub.com
              </p>
              <p>
                <strong>Response Time:</strong> We aim to respond within 48
                hours
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Policy Updates
            </h2>
            <p className="text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. When we do,
              we will:
            </p>
            <ul className="space-y-2 text-gray-300 ml-4 text-sm">
              <li>
                • Update the "Last updated" date at the top of this policy
              </li>
              <li>
                • Notify you of significant changes via email or app
                notification
              </li>
              <li>• Post the updated policy on our website</li>
            </ul>
            <p className="text-gray-300 text-sm mt-4">
              Your continued use of GameHub after any changes indicates your
              acceptance of the updated Privacy Policy.
            </p>
          </section>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
