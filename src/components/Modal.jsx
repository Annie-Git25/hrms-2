//src/cpmponents/Modal.jsx
import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import supabase from "../services/supabase";

const Modal = ({ isOpen, onClose, title, employeeId }) => {
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const { error } = await supabase.from("leave_requests").insert([
      { employee_id: employeeId, leave_type: leaveType, reason, status: "pending" }
    ]);

    if (error) {
      alert(`Error submitting leave request: ${error.message}`);
    } else {
      alert("Leave request submitted successfully!");
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <select onChange={(e) => setLeaveType(e.target.value)}>
          <option value="Vacation">Vacation</option>
          <option value="Sick">Sick</option>
        </select>
        <textarea placeholder="Reason for leave" onChange={(e) => setReason(e.target.value)} />
        <button onClick={handleSubmit} className={styles.submitBtn}>Submit</button>
        <button onClick={onClose} className={styles.closeBtn}>Close</button>
      </div>
    </div>
  );
};

export default Modal;