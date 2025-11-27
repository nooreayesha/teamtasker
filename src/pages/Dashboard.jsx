
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <div className="space-x-2">
          <button onClick={toggleTheme} className="px-4 py-2 bg-gray-400 rounded">
            {dark ? "Light" : "Dark"} Mode
          </button>
          <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded">
            Sign Out
          </button>
        </div>
      </div>

      <p className="text-lg">Dashboard Content Goes Here</p>
    </div>
  );
}
