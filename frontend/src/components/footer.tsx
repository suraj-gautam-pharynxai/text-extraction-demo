 export const Footer = () => {
  return (
    <footer className="w-full bg-gray-900">
        <div className="container px-4 py-12 mx-auto text-center text-white md:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Pharynx-PDF</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">PRODUCT</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                     Desktop
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                     Mobile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Developers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Wordpress Plugin
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    pharynxvision
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Education
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">COMPANY</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Legal & Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center mt-12 space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:underline">
                English
              </a>
              <span className="text-gray-500">© Phrynxai-PDF 2024 • Your PDF Editor</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                <PlayIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:underline">
                <AppleIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:underline">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:underline">
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:underline">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:underline">
                <LinkedinIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}







