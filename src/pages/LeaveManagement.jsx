import React, { useState, useEffect } from "react";
import { fetchLeaveBalance, submitLeaveRequest, fetchLeaveHistory } from "../services/leaveService";
import Style from "../styles/LeaveManagement.module.css";

const LeaveManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState(["Vacation", "Sick", "Maternity/Paternity"]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLeaveBalance(await fetchLeaveBalance());
      setLeaveHistory(await fetchLeaveHistory());
    };
    loadData();
  }, []);

  const handleSubmitRequest = async (leaveType, startDate, endDate, reason) => {
    const response = await submitLeaveRequest(leaveType, startDate, endDate, reason);
    if (response.success) alert("Leave request submitted!");
    else alert(`Error: ${response.error}`);
  };

  return (
    <div className={styles.leaveManagement}>
      <h2>Leave Requests</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const leaveType = e.target.leaveType.value;
        const startDate = e.target.startDate.value;
        const endDate = e.target.endDate.value;
        const reason = e.target.reason.value;
        handleSubmitRequest(leaveType, startDate, endDate, reason);
      }}>
        <select name="leaveType">
          {leaveTypes.map(type => <option key={type}>{type}</option>)}
        </select>
        <input type="date" name="startDate" required />
        <input type="date" name="endDate" required />
        <textarea name="reason" placeholder="Reason for leave" required></textarea>
        <button type="submit">Submit Request</button>
      </form>

      <h2>Leave Balance</h2>
      <p>Vacation: {leaveBalance.vacation} days remaining</p>
      <p>Sick: {leaveBalance.sick} days remaining</p>

      <h2>Leave History</h2>
      <ul>
        {leaveHistory.map((entry, idx) => (
          <li key={idx}>{entry.type} | {entry.startDate} - {entry.endDate} | {entry.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveManagement;