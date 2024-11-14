const Footer = () => {
    return (
<div className="bg-[rgba(255,49,49,0.9)] w-full">
  <div className="container mx-auto p-6">
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="mb-8 lg:mb-0">
        <h1 className="text-4xl font-semibold text-white">
          TCU Airlines
        </h1>
        <div className="mt-4 flex flex-wrap shadow-md flex justify-center rounded-md">
        <a href="" ><img
              alt="IATA Accredited"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2017/12/13/1513150321127-5096be77d2a19401b476853e54ba2cc6.svg?tr=h-35,q-75"
              className="inline-block mr-2 mb-2 w-16 h-auto"
          /></a>
          <a href="" ><img
              alt="BSI Certified"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2021/05/10/1620638808154-e6c02ed786235ab59252628a9aa9b715.png"
              className="inline-block mr-2 mb-2 w-16 h-auto obect-contain"
          /></a>
          <a href="" ><img
              alt="PCI DSS Compliant"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2024/03/21/1711004601798-5a0a152c4bdede9bfe32439875879609.png"
              className="inline-block w-16 h-auto object-contain"
          /></a>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Partner with TCU Airlines
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
            <a href="" ><img
                alt="Payment partner VISA"
                src="https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339277845-57216452ce8a7cda236fa5392b9dc8a1.png?tr=h-19,q-75,w-57"
                className="w-12 h-auto inline-block"
              /></a>
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
            <a href="" ><img
                alt="Payment partner MasterCard"
                src="https://ik.imagekit.io/tvlk/image/imageResource/2019/05/20/1558339280874-69888d44b71faf69435ee533506d91e2.png?tr=h-19,q-75,w-57"
                className="w-12 h-auto inline-block"
              /></a>
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
            <a href="" >
              <img alt="Payment partner Gcash"
                src="https://cdn.media.amplience.net/i/cebupacificair/GCash-276x96?fmt=auto&maxW=1920&maxH=1920&h=80&qlt=100"
                className="w-12 h-auto inline-block" />
              </a>
            </div>
            <div className="bg-white p-2 shadow-md flex justify-center rounded-md">
            <a href="" ><img
                alt="Payment partner Maya"
                src="/icons/paymaya.png"
                className="w-12 h-auto inline-block"
              /></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:space-x-8 mb-8 lg:mb-0">
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-white">About TCU Airlines</h2>
          <ul className="mt-2 text-white list-none pl-0 leading-8">
              <li><a href="" className="text-white font-medium hover:underline-offset-4" >How to Book</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Contact Us</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Help Center</a></li>
              <li><a href="" className="text-white font-medium hover:underline-offset-4">Careers</a></li>
              <li><a href="/about" className="text-white font-medium hover:underline-offset-4">About Us</a></li>
          </ul>
        </div>
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-white">Products</h2>
          <ul className="mt-2 text-white list-none pl-0 leading-8">
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Flights</a></li>
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Airport Transfer</a></li>
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Things to Do</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Other</h2>
          <ul className="mt-2 text-white list-none pl-0 leading-8">
            <li><a href="" className="text-white font-medium hover:underline-offset-4">#ExplorePH</a></li> 
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Privacy Notice</a></li>
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Terms & Conditions</a></li>
            <li><a href="" className="text-white font-medium hover:underline-offset-4">Vulnerability Disclosure Program</a></li>
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
            <i className="fab fa-twitter-square fa-2x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-youtube-square fa-2x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="fab fa-tiktok fa-2x"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}

export default Footer;