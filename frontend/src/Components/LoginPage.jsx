import React, { useEffect } from "react";
import { Trophy, BarChart3, Gift, Activity, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { user, login, logout, authError, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const locationAuthError = location.state?.authError;
  const errorMessage = authError || locationAuthError;

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg my-auto"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex w-full flex-col p-8 md:p-12 md:w-2/5">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-8">
                <Activity className="h-10 w-10 text-blue-600" />
                <span className="text-3xl font-bold">
                  <span className="text-gray-900">Fit</span>
                  <span className="text-blue-600">Verse</span>
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back!
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to track your fitness, join challenges, and earn
                rewards.
              </p>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                <p>Login error: {errorMessage}</p>
              </div>
            )}

            <button
              onClick={login}
              className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>

          <div className="hidden md:block md:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 md:p-12">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-6">
                Track Your Fitness Journey
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Activity Tracking
                    </h4>
                    <p className="mt-1 text-blue-100">
                      Log your workouts and track your progress over time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Join Challenges
                    </h4>
                    <p className="mt-1 text-blue-100">
                      Compete with friends and earn rewards for your achievements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-lg">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Earn Rewards
                    </h4>
                    <p className="mt-1 text-blue-100">
                      Get coins for completing challenges and redeem them for prizes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
