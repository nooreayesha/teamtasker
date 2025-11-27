
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const [name, setName] = useState("");

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow rounded space-y-4">
        <h1 className="text-xl font-bold">TeamTasker Login</h1>
        <input 
          className="border p-2 w-full"
          placeholder="Enter name..."
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={()=>signIn(name)}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
