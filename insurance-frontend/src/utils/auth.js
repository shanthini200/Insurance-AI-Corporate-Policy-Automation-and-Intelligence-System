import { jwtDecode } from "jwt-decode";

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getRole = () => {
  const user = getUser();
  return user?.role?.toUpperCase() || null;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
