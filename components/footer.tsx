// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Layout */}
        <div className="hidden  lg:inline-flex w-full">
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis
                </p>
              </div>
            </div>
            <div className="flex justify-between  w-full mt-30">
              <div className="">
                <h3 className="text-gray-800 font-medium mb-4">Categories</h3>
                <div className="flex flex-col">
                  <Link
                    href="/categories/interior"
                    className="text-gray-800 mb-2"
                  >
                    Interior accessories
                  </Link>
                  <Link href="/categories/exterior" className="text-gray-800">
                    Exterior accessories
                  </Link>
                </div>
              </div>
              {/* Contact Info */}
              <div className="flex flex-col items-center">
                <h3 className="text-gray-800 font-medium mb-2">Contact Us</h3>
                <Link
                  href="mailto:contactadmintobuy@autostore.com"
                  className="text-gray-800 underline mb-2"
                >
                  contactadmintobuy@autostore.com
                </Link>
                <p className="text-gray-800">+234 70 6878 9878</p>
              </div>

              {/* Terms and Privacy */}
              <div className="flex flex-col items-end">
                <h3 className="text-gray-800 font-medium mb-2">
                  Terms of agreement
                </h3>
                <Link href="/cookies" className="text-gray-800 mb-2">
                  Cookies
                </Link>
                <Link href="/privacy-policy" className="text-gray-800">
                  Privacy Policy
                </Link>
              </div>
              {/* Categories */}
            </div>

            {/* Larger Logo */}
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-col mt-20">
          <div className="flex justify-center mb-8 mx-auto w-full">
            <Image
              src="/images/Auto-Store.png"
              alt="Auto Store NG"
              width={1323}
              height={259}
              className="max-w-full h-auto"
            />
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            Copyright 2025 Auto Store. All rights reserved.
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col rounded-[24px] px-[20px] py-[60px] bg-[#F5F5F5]">
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis
          </p>

          {/* Contact Info */}
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-gray-800 font-medium mb-2">Contact Us</h3>
            <Link
              href="mailto:contactadmintobuy@autostore.com"
              className="text-gray-800 underline mb-2"
            >
              contactadmintobuy@autostore.com
            </Link>
            <p className="text-gray-800">+234 7068789878</p>
          </div>

          {/* Two Column Layout for Categories and Terms */}
          <div className="flex justify-between mb-8">
            <div className="flex flex-col">
              <h3 className="text-gray-800 font-medium mb-2">Categories</h3>
              <Link href="/categories/interior" className="text-gray-800 mb-2">
                Interior accessories
              </Link>
              <Link href="/categories/exterior" className="text-gray-800">
                Exterior accessories
              </Link>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-800 font-medium mb-2">
                Terms of agreement
              </h3>
              <Link href="/cookies" className="text-gray-800 mb-2">
                Cookies
              </Link>
              <Link href="/privacy-policy" className="text-gray-800">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Smaller Logo */}
        </div>
        <div className="lg:hidden mt-[60px]">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/Auto-Store.png"
              alt="Auto Store NG"
              width={361}
              height={71}
              className="mb-4"
            />
          </div>

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
