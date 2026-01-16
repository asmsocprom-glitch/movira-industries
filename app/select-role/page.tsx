"use client";

import { useState } from "react";

export default function SelectRolePage() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);

    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }
      if(role === "supplier"){
        window.location.href = "/sign-in";
      }
      if (role === "client") {
        window.location.href = "/complete-profile";
        return;
      }

      
      

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-lg">
        <h1 className="text-xl font-semibold mb-4">Select Account Type</h1>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Choose role</option>
          <option value="client">Client</option>
          <option value="supplier">Supplier</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={!role || loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
