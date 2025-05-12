import React from 'react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-red">
              Homepage
            </Link>
            {" / "}
            <span className="font-medium text-gray-700">Privacy Policy</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-700">
                At Autostores.ng, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                  <p className="text-gray-700">
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 mt-2">
                    <li>Create an account</li>
                    <li>Make a purchase</li>
                    <li>Sign up for our newsletter</li>
                    <li>Contact our customer support</li>
                    <li>Submit a custom order request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
                  <p className="text-gray-700">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2 mt-2">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Operating system</li>
                    <li>Pages visited</li>
                    <li>Time and date of visits</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Process your orders and payments</li>
                <li>Communicate with you about your orders</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="text-gray-700">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mt-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for secure transactions</li>
                <li>Shipping partners for order delivery</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-gray-700">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-2 space-y-2">
                <p className="text-gray-700">
                  Email: support@autostores.ng
                </p>
                <p className="text-gray-700">
                  Phone: +234 903 975 6266
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 