import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1C] font-Int text-white px-6 py-6 ">
      <div className="flex flex-col justify-between items-center gap-6">
        {/* Left: Logo and Address */}
        <div className="space-y-1 max-w-sm">
          <Image
            src="/movira-logo-png2.png"
            width={190}
            height={190}
            alt="Movira Industries Logo"
            priority
          />
        </div>
          <address className="not-italic text-center text-md">
            105 Commerce House, Kala Ghoda, Fort, Mumbai-400001
          </address>

        {/* Middle: Contact Info */}
        <div className="space-y-4 flex flex-col justify-between items-center md:text-center text-sm opacity-90">
          <div className="flex gap-5 pb-2">
            <a href="tel:+918767160087" className="block hover:text-[#C2A356] transition">
              +91 8291 5272 07
            </a>
            <a href="mailto:info@moviraindustries.in" className="block hover:text-[#C2A356] transition">
              info@moviraindustries.in
            </a>
          </div>

          <div>
            <ul className="flex -translate-x-1 gap-6">

              <li>
                <a href="https://www.instagram.com/moviraindustries/" aria-label="Instagram" className="hover:text-[#C2A356] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>

              <li>
                <a href="https://api.whatsapp.com/send?phone=918291527207" target="_blank" aria-label="WhatsApp" className="hover:text-[#C2A356] transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clipRule="evenodd" />
                    <path d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 border-t border-white/10 pt-4 text-xs text-[#cfcfcf] tracking-widest uppercase text-center">
        © {new Date().getFullYear()} Movira Industries. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
