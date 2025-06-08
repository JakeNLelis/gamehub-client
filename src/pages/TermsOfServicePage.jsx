import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Scale,
  Users,
  Gavel,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const TermsOfServicePage = () => {
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Welcome to GameHub! These terms govern your use of our gaming
            platform and services.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Last updated: June 8, 2025</p>
            <p className="mt-1">Effective Date: June 8, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Agreement */}
          <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/30 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                Agreement to Terms
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                By accessing and using GameHub ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
              </p>
              <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  <strong>Important:</strong> If you do not agree to abide by
                  the above, please do not use this service. Your continued use
                  of GameHub constitutes acceptance of these terms.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Service Description
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                GameHub is a free gaming platform that provides:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Core Features
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Browse free-to-play games database</li>
                    <li>• Create and manage user profiles</li>
                    <li>• Write and read game reviews</li>
                    <li>• Save games to favorites</li>
                    <li>• Upload and manage profile avatars</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">
                    Authentication
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Google OAuth 2.0 sign-in</li>
                    <li>• Secure JWT token system</li>
                    <li>• Protected user data</li>
                    <li>• Account management tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              User Accounts and Registration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Account Requirements
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You must be at least 13 years old to create an account
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You must have a valid Google account for authentication
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>You may only create one account per person</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      You are responsible for keeping your account secure
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Account Responsibilities
                </h3>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Provide accurate and truthful information</li>
                    <li>• Maintain the security of your account credentials</li>
                    <li>• Notify us immediately of any unauthorized use</li>
                    <li>• Use the service in compliance with these terms</li>
                    <li>• Keep your profile information up to date</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">
                Acceptable Use Policy
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  You MAY:
                </h3>
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                  <ul className="space-y-2 text-green-300 text-sm">
                    <li>✓ Write honest reviews about games</li>
                    <li>✓ Share your gaming experiences respectfully</li>
                    <li>
                      ✓ Use the platform for personal, non-commercial purposes
                    </li>
                    <li>✓ Upload appropriate profile pictures</li>
                    <li>✓ Engage constructively with other users' content</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  You MAY NOT:
                </h3>
                <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                  <ul className="space-y-2 text-red-300 text-sm">
                    <li>
                      ✗ Post offensive, abusive, or discriminatory content
                    </li>
                    <li>
                      ✗ Upload inappropriate, copyrighted, or illegal images
                    </li>
                    <li>✗ Attempt to hack, disrupt, or abuse the service</li>
                    <li>✗ Create fake reviews or manipulate ratings</li>
                    <li>✗ Share personal information of other users</li>
                    <li>✗ Use the service for commercial spam or promotion</li>
                    <li>✗ Impersonate other users or entities</li>
                    <li>✗ Attempt to circumvent security measures</li>
                    <li>✗ Upload malware or malicious content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Content Policy */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Content Policy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  User-Generated Content
                </h3>
                <p className="text-gray-300 mb-4">
                  When you post reviews, upload avatars, or create other content
                  on GameHub:
                </p>
                <ul className="space-y-2 text-gray-300 ml-4 text-sm">
                  <li>• You retain ownership of your content</li>
                  <li>
                    • You grant us a license to display and distribute it on the
                    platform
                  </li>
                  <li>
                    • You are responsible for ensuring you have the right to
                    post the content
                  </li>
                  <li>
                    • You agree that your content complies with our community
                    guidelines
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Review Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Encouraged
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Detailed, helpful reviews</li>
                      <li>• Personal gaming experiences</li>
                      <li>• Constructive criticism</li>
                      <li>• Specific gameplay feedback</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Prohibited
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Hate speech or discrimination</li>
                      <li>• Spam or irrelevant content</li>
                      <li>• False or misleading information</li>
                      <li>• Personal attacks on others</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Avatar Upload Policy
                </h3>
                <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
                  <ul className="space-y-2 text-yellow-300 text-sm">
                    <li>• Must be appropriate for all audiences</li>
                    <li>
                      • Cannot contain copyrighted material without permission
                    </li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Supported formats: JPG, PNG, GIF</li>
                    <li>• No nudity, violence, or offensive imagery</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Intellectual Property
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  GameHub Platform
                </h3>
                <p className="text-gray-300 text-sm">
                  The GameHub platform, including its design, code, features,
                  and branding, is owned by us and protected by intellectual
                  property laws. You may not copy, modify, or distribute our
                  platform without permission.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Game Data
                </h3>
                <p className="text-gray-300 text-sm">
                  Game information and images are sourced from the FreeToGame
                  API and respective game publishers. We do not claim ownership
                  of game content, trademarks, or copyrights.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Copyright Infringement
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  If you believe content on GameHub infringes your copyright,
                  please contact us with:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm ml-4">
                  <li>• Description of the copyrighted work</li>
                  <li>• Location of the infringing content</li>
                  <li>• Your contact information</li>
                  <li>• A statement of good faith belief</li>
                  <li>• Electronic or physical signature</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Privacy and Data Protection
            </h2>

            <div className="space-y-4">
              <p className="text-gray-300">
                Your privacy is important to us. Our collection, use, and
                protection of your personal information is governed by our
                Privacy Policy.
              </p>

              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2">
                  Key Points:
                </h3>
                <ul className="space-y-1 text-blue-300 text-sm">
                  <li>• We use Google OAuth for secure authentication</li>
                  <li>• Your reviews and favorites are stored securely</li>
                  <li>• You can delete your account and data at any time</li>
                  <li>• We never sell your personal information</li>
                </ul>
              </div>

              <p className="text-gray-300 text-sm">
                Please read our{" "}
                <Link
                  to="/privacy-policy"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Privacy Policy
                </Link>{" "}
                for detailed information about how we handle your data.
              </p>
            </div>
          </section>

          {/* Service Availability */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Service Availability
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Service Provision
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  We strive to provide a reliable service, but cannot guarantee
                  100% uptime. We may temporarily suspend the service for:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm ml-4">
                  <li>• Scheduled maintenance</li>
                  <li>• Security updates</li>
                  <li>• Technical improvements</li>
                  <li>• Emergency fixes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Service Modifications
                </h3>
                <p className="text-gray-300 text-sm">
                  We reserve the right to modify, suspend, or discontinue any
                  part of the service at any time. We will provide reasonable
                  notice when possible.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">
                Disclaimers and Limitations
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-orange-300 mb-2">
                  Service "As Is"
                </h3>
                <p className="text-orange-300 text-sm">
                  GameHub is provided "as is" without warranties of any kind. We
                  do not guarantee that the service will be error-free, secure,
                  or continuously available.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Game Information
                </h3>
                <p className="text-gray-300 text-sm">
                  Game data is sourced from third-party APIs and may not always
                  be accurate or up-to-date. We are not responsible for the
                  accuracy of game information or availability of external game
                  links.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  User Content
                </h3>
                <p className="text-gray-300 text-sm">
                  We are not responsible for user-generated content including
                  reviews, comments, or uploaded images. Users are solely
                  responsible for their content and its compliance with
                  applicable laws.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Gavel className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">
                Account Termination
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Voluntary Termination
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  You may delete your account at any time through your profile
                  settings. Account deletion will:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm ml-4">
                  <li>• Permanently remove your profile data</li>
                  <li>• Delete all your reviews and favorites</li>
                  <li>• Remove uploaded avatars from our servers</li>
                  <li>• Cannot be undone</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Termination by GameHub
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  We may suspend or terminate your account if you:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm ml-4">
                  <li>• Violate these Terms of Service</li>
                  <li>• Engage in abusive or harmful behavior</li>
                  <li>• Post inappropriate or illegal content</li>
                  <li>• Attempt to compromise the platform's security</li>
                  <li>
                    • Use the service for unauthorized commercial purposes
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-red-300 mb-2">
                  Appeals Process
                </h3>
                <p className="text-red-300 text-sm">
                  If your account is suspended or terminated, you may appeal the
                  decision by contacting our support team within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Legal and Governing Law
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Jurisdiction
                </h3>
                <p className="text-gray-300 text-sm">
                  These Terms of Service are governed by the laws of [Your
                  Jurisdiction]. Any disputes will be resolved in the courts of
                  [Your Jurisdiction].
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Dispute Resolution
                </h3>
                <p className="text-gray-300 text-sm">
                  We encourage users to contact us directly to resolve any
                  issues. For disputes that cannot be resolved directly, users
                  agree to binding arbitration before pursuing legal action.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Severability
                </h3>
                <p className="text-gray-300 text-sm">
                  If any provision of these terms is found to be unenforceable,
                  the remaining provisions will continue to be valid and
                  enforceable.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-400/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Contact Information
            </h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong>Email:</strong> legal@gamehub.com
              </p>
              <p>
                <strong>Support:</strong> support@gamehub.com
              </p>
              <p>
                <strong>Response Time:</strong> We aim to respond within 48
                hours
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Changes to These Terms
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                We may update these Terms of Service from time to time. When we
                do:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4 text-sm">
                <li>• We will update the "Last updated" date</li>
                <li>• We will notify users of significant changes</li>
                <li>• Changes become effective immediately upon posting</li>
                <li>• Continued use constitutes acceptance of new terms</li>
              </ul>
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mt-4">
                <p className="text-blue-300 text-sm">
                  We recommend checking this page periodically for any updates
                  to stay informed about our terms and policies.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
