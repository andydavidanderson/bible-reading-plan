interface NavigationProps {
  onPrint: () => void;
}

export const Navigation = ({
  onPrint
}: NavigationProps) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-sm" aria-hidden="true">
                <span className="text-white text-lg">📖</span>
              </div>
              <h1 className="text-2xl font-light text-slate-800">
                Bible Reading Plan
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={onPrint}
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 cursor-pointer transition-all duration-200"
              title="Print Schedule"
              aria-label="Print reading schedule"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
