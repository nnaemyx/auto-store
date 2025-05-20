// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

const InstagramIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.125 18C31.125 14.6094 31.1229 12.1794 30.8745 10.3315C30.6304 8.51621 30.1667 7.43234 29.3672 6.63281C28.5677 5.83328 27.4838 5.36958 25.6685 5.12549C23.8206 4.87705 21.3906 4.875 18 4.875C14.6094 4.875 12.1794 4.87705 10.3315 5.12549C8.51621 5.36958 7.43234 5.83328 6.63281 6.63281C5.83328 7.43234 5.36958 8.51621 5.12549 10.3315C4.87705 12.1794 4.875 14.6094 4.875 18C4.875 21.3906 4.87705 23.8206 5.12549 25.6685C5.36958 27.4838 5.83328 28.5677 6.63281 29.3672C7.43234 30.1667 8.51621 30.6304 10.3315 30.8745C12.1794 31.1229 14.6094 31.125 18 31.125C21.3906 31.125 23.8206 31.1229 25.6685 30.8745C27.4838 30.6304 28.5677 30.1667 29.3672 29.3672C30.1667 28.5677 30.6304 27.4838 30.8745 25.6685C31.1229 23.8206 31.125 21.3906 31.125 18ZM33.375 18C33.375 21.3266 33.3772 23.9348 33.104 25.9673C32.8264 28.0323 32.2453 29.6707 30.958 30.958C29.6707 32.2453 28.0323 32.8264 25.9673 33.104C23.9348 33.3772 21.3266 33.375 18 33.375C14.6734 33.375 12.0652 33.3772 10.0327 33.104C7.96773 32.8264 6.32929 32.2453 5.04199 30.958C3.7547 29.6707 3.17363 28.0323 2.896 25.9673C2.62281 23.9348 2.625 21.3266 2.625 18C2.625 14.6734 2.62281 12.0652 2.896 10.0327C3.17363 7.96773 3.7547 6.32929 5.04199 5.04199C6.32929 3.7547 7.96773 3.17363 10.0327 2.896C12.0652 2.62281 14.6734 2.625 18 2.625C21.3266 2.625 23.9348 2.62281 25.9673 2.896C28.0323 3.17363 29.6707 3.7547 30.958 5.04199C32.2453 6.32929 32.8264 7.96773 33.104 10.0327C33.3772 12.0652 33.375 14.6734 33.375 18Z" fill="currentColor"/>
    <path d="M23.625 18C23.625 14.8934 21.1066 12.375 18 12.375C14.8934 12.375 12.375 14.8934 12.375 18C12.375 21.1066 14.8934 23.625 18 23.625C21.1066 23.625 23.625 21.1066 23.625 18ZM25.875 18C25.875 22.3492 22.3492 25.875 18 25.875C13.6508 25.875 10.125 22.3492 10.125 18C10.125 13.6508 13.6508 10.125 18 10.125C22.3492 10.125 25.875 13.6508 25.875 18Z" fill="currentColor"/>
    <path d="M26.2485 11.25L26.0947 11.2427C25.3384 11.1658 24.7485 10.5266 24.7485 9.75C24.7485 8.97339 25.3384 8.33419 26.0947 8.25732L26.2485 8.25L26.2617 8.25C27.0901 8.25 27.7617 8.92157 27.7617 9.75C27.7617 10.5784 27.0901 11.25 26.2617 11.25L26.2485 11.25Z" fill="currentColor"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.125 18C31.125 14.6094 31.1229 12.1794 30.8745 10.3315C30.6304 8.51621 30.1667 7.43234 29.3672 6.63281C28.5677 5.83328 27.4838 5.36958 25.6685 5.12549C23.8206 4.87705 21.3906 4.875 18 4.875C14.6094 4.875 12.1794 4.87705 10.3315 5.12549C8.51621 5.36958 7.43234 5.83328 6.63281 6.63281C5.83328 7.43234 5.36958 8.51621 5.12549 10.3315C4.87705 12.1794 4.875 14.6094 4.875 18C4.875 21.3906 4.87705 23.8206 5.12549 25.6685C5.36958 27.4838 5.83328 28.5677 6.63281 29.3672C7.43234 30.1667 8.51621 30.6304 10.3315 30.8745C12.1794 31.1229 14.6094 31.125 18 31.125C21.3906 31.125 23.8206 31.1229 25.6685 30.8745C27.4838 30.6304 28.5677 30.1667 29.3672 29.3672C30.1667 28.5677 30.6304 27.4838 30.8745 25.6685C31.1229 23.8206 31.125 21.3906 31.125 18ZM33.375 18C33.375 21.3266 33.3772 23.9348 33.104 25.9673C32.8264 28.0323 32.2453 29.6707 30.958 30.958C29.6707 32.2453 28.0323 32.8264 25.9673 33.104C23.9348 33.3772 21.3266 33.375 18 33.375C14.6734 33.375 12.0652 33.3772 10.0327 33.104C7.96773 32.8264 6.32929 32.2453 5.04199 30.958C3.7547 29.6707 3.17363 28.0323 2.896 25.9673C2.62281 23.9348 2.625 21.3266 2.625 18C2.625 14.6734 2.62281 12.0652 2.896 10.0327C3.17363 7.96773 3.7547 6.32929 5.04199 5.04199C6.32929 3.7547 7.96773 3.17363 10.0327 2.896C12.0652 2.62281 14.6734 2.625 18 2.625C21.3266 2.625 23.9348 2.62281 25.9673 2.896C28.0323 3.17363 29.6707 3.7547 30.958 5.04199C32.2453 6.32929 32.8264 7.96773 33.104 10.0327C33.3772 12.0652 33.375 14.6734 33.375 18Z" fill="currentColor"/>
    <path d="M8.625 21.75C8.625 18.2292 11.4792 15.375 15 15.375C15.3081 15.375 15.6121 15.3969 15.9097 15.4395C16.5245 15.5276 16.9512 16.0975 16.8633 16.7124C16.7753 17.3275 16.2054 17.7555 15.5903 17.6675C15.3981 17.64 15.2011 17.625 15 17.625C12.7218 17.625 10.875 19.4718 10.875 21.75C10.875 24.0282 12.7218 25.875 15 25.875C17.2782 25.875 19.125 24.0282 19.125 21.75V9C19.125 8.37868 19.6287 7.875 20.25 7.875C20.8713 7.875 21.375 8.37868 21.375 9C21.375 10.0325 21.93 11.0526 22.8838 11.8491C23.8385 12.6464 25.0882 13.125 26.25 13.125C26.8713 13.125 27.375 13.6287 27.375 14.25C27.375 14.8713 26.8713 15.375 26.25 15.375C24.5123 15.375 22.7613 14.6789 21.4409 13.5762C21.4184 13.5573 21.3973 13.5367 21.375 13.5176V21.75C21.375 25.2708 18.5208 28.125 15 28.125C11.4792 28.125 8.625 25.2708 8.625 21.75Z" fill="currentColor"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="18" fill="currentColor" />
    <path d="M25.8 14.1C25.6 13.3 25 12.7 24.2 12.5C22.7 12.1 18 12.1 18 12.1C18 12.1 13.3 12.1 11.8 12.5C11 12.7 10.4 13.3 10.2 14.1C9.8 15.6 9.8 18 9.8 18C9.8 18 9.8 20.4 10.2 21.9C10.4 22.7 11 23.3 11.8 23.5C13.3 23.9 18 23.9 18 23.9C18 23.9 22.7 23.9 24.2 23.5C25 23.3 25.6 22.7 25.8 21.9C26.2 20.4 26.2 18 26.2 18C26.2 18 26.2 15.6 25.8 14.1ZM16.5 21V15L21.5 18L16.5 21Z" fill="white"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="18" fill="currentColor" />
    <path d="M20.5 18H22V15.5H20.5V14.5C20.5 14.1 20.7 13.9 21.1 13.9H22V12H20.5C19.1 12 18.5 12.7 18.5 13.8V15.5H17V18H18.5V24H20.5V18Z" fill="white"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Layout */}
        <div className="hidden lg:inline-flex w-full">
          <div className="w-full bg-[#F5F5F5] rounded-[40px] p-[60px]">
            <div className="flex justify-between w-full">
              <Image
                src="/images/footer logo.png"
                alt="Auto Store NG"
                width={210}
                height={80}
                className=""
              />
              <div className="max-w-[478px]">
                <p className="text-gray-700 text-sm">
                  At Autostores.ng, we believe no auto-related need should go
                  unmet — no matter how specific, urgent, or complex. Whether
                  you know exactly what you&apos;re looking for or need expert
                  guidance, we make the process seamless, cost-effective, and
                  dependable.
                </p>
                {/* Social Media Links */}
                <div className="flex gap-4 mt-4">
                  <a
                    href="https://www.instagram.com/autostores.ng?igsh=d25zNTVoaXVweThu&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://www.tiktok.com/@autostores.ng?_t=ZM-8wBa9yyaqJx&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <TikTokIcon />
                  </a>
                  <a
                    href="https://youtube.com/@autostoreng?si=DQD_H4uZw1cCnzXN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <YouTubeIcon />
                  </a>
                  <a
                    href="https://www.facebook.com/share/16AkkJgea1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FacebookIcon />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-between  w-full mt-30">
              <div className="">
                <h3 className="text-gray-800 font-medium mb-4">Categories</h3>
                <div className="flex flex-col">
                  <Link
                    href="/interior"
                    className="text-gray-800 mb-2"
                  >
                    Interior accessories
                  </Link>
                  <Link href="/exterior" className="text-gray-800">
                    Exterior accessories
                  </Link>
                </div>
              </div>
              {/* Contact Info */}
              <div className="flex flex-col items-center">
                <h3 className="text-gray-800 font-medium mb-2">Contact Us</h3>
                <Link
                  href="mailto:support@autostores.ng"
                  className="text-gray-800 underline mb-2"
                >
                  support@autostores.ng
                </Link>
                <Link
                  href="mailto:info@autostores.ng"
                  className="text-gray-800 underline mb-2"
                >
                  info@autostores.ng
                </Link>
                <p className="text-gray-800">+234 903 975 6266</p>
              </div>

              {/* Terms and Privacy */}
              <div className="flex flex-col items-end">
                <h3 className="text-gray-800 font-medium mb-2">
                  Terms of agreement
                </h3>
                <Link href="/about" className="text-gray-800 mb-2">
                  About Us
                </Link>
                <Link href="/cookies" className="text-gray-800 mb-2">
                  Cookies
                </Link>
                <Link href="/privacy-policy" className="text-gray-800 mb-2">
                  Privacy Policy
                </Link>
                <Link href="/faqs" className="text-gray-800 mb-2">
                  FAQs
                </Link>
                <Link href="/maintenance" className="text-gray-800 mb-2">
                  Vehicle Maintenance
                </Link>
                <Link href="/custom-order" className="text-gray-800">
                  Custom Order
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-col mt-20">


          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            Copyright 2025 Auto Store. All rights reserved.
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col rounded-[24px] px-[10px] py-[60px] bg-[#F5F5F5]">
          {/* Logo and Description */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/footer logo.png"
              alt="Auto Store NG"
              width={129}
              height={49.32}
              className="mb-4"
            />
          </div>

          <p className="text-gray-700 text-sm mb-6 text-center">
            At Autostores.ng, we believe no auto-related need should go unmet —
            no matter how specific, urgent, or complex. Whether you know exactly
            what you&apos;re looking for or need expert guidance, we make the
            process seamless, cost-effective, and dependable.
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://www.instagram.com/autostores.ng?igsh=d25zNTVoaXVweThu&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.tiktok.com/@autostores.ng?_t=ZM-8wBa9yyaqJx&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://youtube.com/@autostoreng?si=DQD_H4uZw1cCnzXN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://www.facebook.com/share/16AkkJgea1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FacebookIcon />
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-gray-800 font-medium mb-2">Contact Us</h3>
            <Link
              href="mailto:support@autostores.ng"
              className="text-gray-800 underline mb-2"
            >
              support@autostores.ng
            </Link>
            <Link
              href="mailto:info@autostores.ng"
              className="text-gray-800 underline mb-2"
            >
              info@autostores.ng
            </Link>
            <p className="text-gray-800">+234 903 975 6266</p>
          </div>

          {/* Two Column Layout for Categories and Terms */}
          <div className="flex gap-4 justify-between mb-8">
            <div className="flex flex-col">
              <h3 className="text-gray-800 font-medium mb-2">Categories</h3>
              <Link href="/interior" className="text-gray-800 mb-2">
                Interior accessories
              </Link>
              <Link href="/exterior" className="text-gray-800">
                Exterior accessories
              </Link>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-800 font-medium mb-2">
                Terms of agreement
              </h3>
              <Link href="/about" className="text-gray-800 mb-2">
                About Us
              </Link>
              <Link href="/cookies" className="text-gray-800 mb-2">
                Cookies
              </Link>
              <Link href="/privacy-policy" className="text-gray-800 mb-2">
                Privacy Policy
              </Link>
              <Link href="/faqs" className="text-gray-800 mb-2">
                FAQs
              </Link>
              <Link href="/maintenance" className="text-gray-800 mb-2">
                Vehicle Maintenance
              </Link>
              <Link href="/custom-order" className="text-gray-800">
                Custom Order
              </Link>
            </div>
          </div>

          {/* Smaller Logo */}
        </div>
        <div className="lg:hidden mt-[60px]">


          {/* Copyright */}
          <div className="text-center text-xs text-gray-600">
            Copyright 2025 Auto Store. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
