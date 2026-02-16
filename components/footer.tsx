export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white font-bold text-xl">Egraph</span>
            </div>
            <p className="text-gray-400 text-sm">
              Email Intelligence Graph for Sales Leaders
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Team</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rafif Rizal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Syafiq</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a  className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a  className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a  className="text-gray-400 hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2026 Egraph. All rights reserved. Built for Sales Leaders.</p>
        </div>
      </div>
    </footer>
  );
}
