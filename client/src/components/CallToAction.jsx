export default function CallToAction() {
    return (
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
          <h2 className='text-2xl'>
            Want to learn more about JavaScript?
          </h2>
          <p className='text-gray-500 my-2'>
            Checkout these resources with 100 JavaScript Projects
          </p>
          <a href="https://www.100jsprojects.com" target='_blank' rel='noopener noreferrer' className="bg-purple-600 text-white px-6 py-3 rounded-tl-xl rounded-bl-none inline-block hover:bg-purple-700 transition duration-300">
            100 JavaScript Projects
          </a>
        </div>
        <div className="p-7 flex-1">
          <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" alt="JavaScript" className="w-full h-auto sm:h-full rounded-tr-3xl rounded-br-3xl" />
        </div>
      </div>
    );
  }
  