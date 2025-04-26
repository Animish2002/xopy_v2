import PageNotFoundImg from "./assets/404-Page.jpg";

export default function PageNotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={PageNotFoundImg}
              alt="Page not found illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 ui">
              Lost in the clouds
            </h1>
            <div className="bg-blue-100 dark:bg-blue-900/30 h-1 w-16 mb-6 rounded"></div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Whoops! Looks like you've ventured into uncharted territory. The page you're looking for seems to have floated away.
            </p>
            <div className="flex gap-4">
              <a
                href="/"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Go Home
              </a>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}