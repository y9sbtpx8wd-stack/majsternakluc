import { useEffect, useState } from "react";

export default function AdminPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Načítavam...</p>;

  if (!user.paid) {
    return (
      <div>
        <h2>Admin sekcia</h2>
        <p>Na pridanie inzerátu musíte mať aktívne predplatné.</p>
        <button onClick={() => window.location.href="/payment"}>Zaplať</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Pridať inzerát</h2>
      <form>
        <input type="text" placeholder="Názov inzerátu" />
        <textarea placeholder="Popis"></textarea>
        <input type="number" placeholder="Cena" />
        <button type="submit">Pridať</button>
      </form>
    </div>
  );
}
