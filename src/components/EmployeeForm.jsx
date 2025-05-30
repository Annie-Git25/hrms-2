import React, { useState } from "react";

const EmployeeForm = ({ onSubmit, employee, onClose }) => {
  const [name, setName] = useState(employee?.name || "");
  const [position, setPosition] = useState(employee?.position || "");
  const [email, setEmail] = useState(employee?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, position, email });
  };

  return (
    <div>
      <h2>{employee ? "Edit Employee" : "Add New Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Save</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EmployeeForm;