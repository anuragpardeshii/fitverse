import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const BACKEND_URL = "https://fit-verse-backend.vercel.app";
  const login = () => {
    sessionStorage.setItem("loginRedirectUrl", window.location.pathname);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      sessionStorage.removeItem("loginRedirectUrl");
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthError("Logout failed. Please try again.");
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/auth/user`, {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache", // Add cache control
        },
      });

      if (data?.id) {
        setUser({
          ...data,
          id: data.id, // Consistent ID field
          profilePicture: data.profilePicture,
        });
        fetchBalance(data.id);
        setAuthError(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setAuthError("Authentication failed. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/balance/${userId}`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      if (data.success) {
        setBalance(data.balance);
      } else {
        console.error("Failed to fetch balance:", data.message);
        setBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    }
  };

  const refreshBalance = async () => {
    if (user?.id) {
      await fetchBalance(user.id); // Changed from user._id to user.id
      console.log("Balance refreshed via AuthContext");
    } else {
      console.log("Cannot refresh balance: user not available.");
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleBalanceUpdate = (event) => {
      if (event.detail && typeof event.detail.balance === "number") {
        setBalance(event.detail.balance);
      }
    };
    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchBalance(user.id); // Changed from user._id to user.id
    } else {
      setBalance(0);
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        balance,
        loading,
        login,
        logout,
        setBalance,
        refreshBalance,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
