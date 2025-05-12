import React from 'react';
import Link from 'next/link';

const CookiePolicyPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Cookie Policy</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-red">
              Homepage
            </Link>
            {" / "}
            <span className="font-medium text-gray-700">Cookie Policy</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p className="text-gray-700">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Essential cookies: These cookies are necessary for the website to function properly.</li>
                <li>Performance cookies: These cookies help us understand how visitors interact with our website.</li>
                <li>Functionality cookies: These cookies allow the website to remember choices you make.</li>
                <li>Targeting cookies: These cookies are used to deliver advertisements more relevant to you and your interests.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Session Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you browse our website.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Persistent Cookies</h3>
                  <p className="text-gray-700">
                    These cookies remain on your device for a specified period of time. They help us remember your preferences and improve your experience on our website.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-gray-700">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience on our website. To learn more about cookies and how to manage them, visit www.aboutcookies.org.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicyPage; 