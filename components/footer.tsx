import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="md:p-[60px]">
      <div className="bg-[#F5F5F5] md:p-[60px] rounded-[40px]">
        {/* Desktop and Mobile Layout */}
        <div className="w-full flex justify-between md:flex-row flex-col items-center text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/footer logo.png"
              alt="Auto Store"
              width={243.23}
              height={93}
              className="h-16 w-auto"
            />
          </div>
          <p className="text-sm text-gray-700 max-w-[478px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis
          </p>
        </div>
        <div className="flex flex-col items-center md:mt-[120px] md:items-start md:flex-row md:justify-between">

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/interior"
                  className="hover:text-brand-red"
                >
                  Interior accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/category/exterior"
                  className="hover:text-brand-red"
                >
                  Exterior accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information - Center on mobile, middle on desktop */}
          <div className="text-center md:text-center mb-8 md:mb-0">
            <h3 className="font-medium mb-3">Contact Us</h3>
            <a
              href="mailto:contactadmintobuy@autostore.com"
              className="block underline mb-2 hover:text-brand-red"
            >
              contactadmintobuy@autostore.com
            </a>
            <p>+234 70 6878 9878</p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-medium mb-3 md:whitespace-nowrap">
              Terms of agreement
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cookies" className="hover:text-brand-red">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-red">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Auto-Store Text Logo */}
      <div className="mt-12 mb-4 text-center">
        <Image
          src="/images/footer img.png"
          alt="Auto Store"
          width={1320}
          height={381}
          priority
        />
      </div>
    </footer>
  );
};

export default Footer;
