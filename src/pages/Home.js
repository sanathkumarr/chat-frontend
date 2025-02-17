import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-600 to-teal-400 text-white">
      {/* Title Section */}
      <h1 className="text-5xl font-bold mb-6 text-center animate__animated animate__fadeIn">
        Welcome to Real-Time Chat
      </h1>
      <p className="text-lg mb-8 max-w-lg text-center animate__animated animate__fadeIn animate__delay-1s">
        Join now to chat with friends, share ideas, and stay connected in real-time!
      </p>

      {/* Buttons */}
      <div className="flex space-x-6 animate__animated animate__fadeIn animate__delay-2s">
        <Link
          to="/register"
          className="bg-gradient-to-r from-teal-400 to-indigo-500 text-white px-6 py-3 rounded-lg text-xl font-semibold transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg text-xl font-semibold transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
