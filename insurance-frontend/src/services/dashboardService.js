export async function getDashboard() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/api/dashboard", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.text();
}
