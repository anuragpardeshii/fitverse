import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/auth/user`, {
        withCredentials: true,
      });
      setUser(data);
      if (data?._id) {
        fetchBalance(data._id);
      }
    } catch (error) {
      setUser(null);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/balance/${userId}`, { withCredentials: true }
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
    if (user?._id) {
      await fetchBalance(user._id);
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
    if (user?._id) {
      fetchBalance(user._id);
    } else {
      setBalance(0);
    }
  }, [user?._id]);

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
