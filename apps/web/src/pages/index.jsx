import { useState } from "react";
import { useRouter } from "next/router";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    // zavolaj API na login
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const user = await res.json();

    if (user.success) {
      router.push("/AdsPage"); // redirect na AdsPage po logine
    }
  };

  return (
    <div>
      <h1>Majster na kľúč</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {/* Guest view */}
      <button onClick={() => router.push("/AdsPage")}>
        Pokračovať bez prihlásenia
      </button>
    </div>
  );
}
