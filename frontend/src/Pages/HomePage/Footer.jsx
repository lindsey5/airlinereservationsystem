const Footer = () => {
    return (
<div className="bg-[rgba(255,49,49,0.9)] w-full">
  <div className="container mx-auto p-6">
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="mb-8 lg:mb-0">
        <div className="flex justify-center">
          <img className='rounded-[50%] h-[120px]' src="/icons/tcu_airlines.jpg" alt="logo" />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Partner with CloudPeak Airlines
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
              <img
                  alt="Payment partner VISA"
                  src="https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339277845-57216452ce8a7cda236fa5392b9dc8a1.png?tr=h-19,q-75,w-57"
                  className="w-12 h-auto inline-block"
                />
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
              <img
                  alt="Payment partner MasterCard"
                  src="https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339280874-69888d44b71faf69435ee533506d91e2.png?tr=h-19,q-75,w-57"
                  className="w-12 h-auto inline-block"
                />
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
              <img alt="Payment partner Gcash"
                src="https://cdn.media.amplience.net/i/cebupacificair/GCash-276x96?fmt=auto&maxW=1920&maxH=1920&h=80&qlt=100"
                className="w-12 h-auto inline-block" />
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
              <img
                  alt="Payment partner Maya"
                  src="/icons/paymaya.png"
                  className="w-12 h-auto inline-block"
                />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:space-x-8 mb-8 lg:mb-0 flex-1 justify-evenly">
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-white">About CloudPeak Airlines</h2>
          <ul className="mt-2 text-white list-none pl-0 leading-8">
              <li><a href="" className="text-white font-medium hover:underline-offset-4">About us</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Contact Us</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Help Center</a></li>
              <li><a href="/our-team" className="text-white font-medium hover:underline-offset-4">Our Team</a></li>
          </ul>
        </div>
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-white">Other</h2>
          <ul className="mt-2 text-white list-none pl-0 leading-8">
              <li><a href="/terms-and-conditions" className="text-white font-medium hover:underline-offset-4">Terms & Conditions</a></li>
              <li><a href="/FAQ" className="text-white font-medium hover:underline-offset-4">FAQ</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center md:text-left">
        <h2 className="text-2xl font-semibold text-white">Follow us on</h2>
        <div className="flex justify-center md:justify-start mt-2 space-x-4">
          <a href="#" className="text-white">
            <i className="fab fa-facebook-square fa-2x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-youtube-square fa-2x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-tiktok fa-2x" text-white></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}

export default Footer;