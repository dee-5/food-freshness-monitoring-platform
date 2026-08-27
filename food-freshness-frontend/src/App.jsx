import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  // auth state
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  // food state
  const [foodItems, setFoodItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newExpiry, setNewExpiry] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editExpiry, setEditExpiry] = useState("");

  const clearAuthFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
      clearAuthFields();
    } else {
      setMessage("Login failed. Check your email/password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      setMessage("Account created. You can log in now.");
      setAuthMode("login");
      setPassword("");
    } else {
      const err = await response.json().catch(() => null);
      setMessage(err?.detail || "Registration failed. Try a different email.");
    }
  };

  const fetchFoodItems = async () => {
    const response = await fetch(`${API_URL}/food`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setFoodItems(data);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newName,
        category: newCategory,
        quantity: Number(newQuantity),
        expiry_date: newExpiry || null,
      }),
    });

    if (response.ok) {
      setNewName("");
      setNewCategory("");
      setNewQuantity(1);
      setNewExpiry("");
      fetchFoodItems();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditQuantity(item.quantity);
    setEditExpiry(item.expiry_date || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateFood = async (e, id) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/food/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        category: editCategory,
        quantity: Number(editQuantity),
        expiry_date: editExpiry || null,
      }),
    });

    if (response.ok) {
      setEditingId(null);
      fetchFoodItems();
    }
  };

  const handleDeleteFood = async (id) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    const response = await fetch(`${API_URL}/food/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchFoodItems();
    }
  };

  const handleLogout = () => {
    setToken(null);
    setFoodItems([]);
    setEditingId(null);
  };

  useEffect(() => {
    if (token) {
      fetchFoodItems();
    }
  }, [token]);

  // ---------- Logged-out view: login / register ----------
  if (!token) {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "360px" }}>
        <h1>Food Freshness</h1>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => { setAuthMode("login"); setMessage(""); }}
            style={{ fontWeight: authMode === "login" ? "bold" : "normal" }}
          >
            Log In
          </button>
          <button
            onClick={() => { setAuthMode("register"); setMessage(""); }}
            style={{ fontWeight: authMode === "register" ? "bold" : "normal" }}
          >
            Register
          </button>
        </div>

        {authMode === "login" ? (
          <form onSubmit={handleLogin}>
            <div>
              <label>Email: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: "10px" }}>
              Log In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>Email: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <label>Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" style={{ marginTop: "10px" }}>
              Create Account
            </button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    );
  }

  // ---------- Logged-in view: inventory ----------
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Your Food Inventory</h1>
      <button onClick={handleLogout}>Log Out</button>

      <form onSubmit={handleAddFood} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <input
          type="date"
          value={newExpiry}
          onChange={(e) => setNewExpiry(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {foodItems.map((item) =>
          editingId === item.id ? (
            <li key={item.id} style={{ marginBottom: "10px" }}>
              <form onSubmit={(e) => handleUpdateFood(e, item.id)} style={{ display: "inline" }}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
                <input
                  type="date"
                  value={editExpiry}
                  onChange={(e) => setEditExpiry(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </form>
            </li>
          ) : (
            <li key={item.id} style={{ marginBottom: "10px" }}>
              {item.name} — {item.category} — Qty: {item.quantity} — Expires: {item.expiry_date || "N/A"}{" "}
              <button onClick={() => startEdit(item)}>Edit</button>{" "}
              <button onClick={() => handleDeleteFood(item.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;