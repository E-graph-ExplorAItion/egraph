export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-black/40 shadow-lg shadow-purple-500/10">
		  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
			  <a href="/" className="group">
          <div className="flex items-center gap-3">
            <img src="/hero-graph-removebg-preview.png" className="w-10"/>
          
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl leading-none">Egraph</span>
            <span className="text-purple-400 text-xs font-medium">Email Visualization</span>
          </div>
				  </div>
				  </a>
        <div className="hidden md:flex items-center gap-12">
          <a href="/#features" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium relative group">
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="/#benefits" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium relative group">
            Benefits
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="/#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium relative group">
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
        <a href="/demo" className="btn-primary px-8 py-2.5 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105">
          Demo
        </a>
      </div>
    </nav>
  );
}
