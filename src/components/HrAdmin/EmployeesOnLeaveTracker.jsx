// src/components/HrAdmin/EmployeesOnLeaveTracker.jsx
import React, { useState, useEffect } from "react";
import supabase from "../../services/supabase";
import styles from "../../styles/DashboardComponents.module.css";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

const EmployeesOnLeaveTracker = () => {
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState({ onLeaveToday: 0, upcomingLeaves: 0, leaveTypeBreakdown: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDepartment, setFilterDepartment] = useState("");
    const [filterLeaveType, setFilterLeaveType] = useState("");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
        const fetchLeaves = async () => {
            setLoading(true);
            setError(null);

            try {
                let query = supabase
                    .from("leave_requests")
                    .select(`
                        id, leave_type, start_date, end_date, status,
                        employees ( id, name, department )
                    `)
                    .eq("status", "approved");

                if (filterDepartment) query = query.eq("employees.department", filterDepartment);
                if (filterLeaveType) query = query.eq("leave_type", filterLeaveType);

                const { data, error: leaveError } = await query;
                if (leaveError) throw leaveError;

                let onLeaveTodayCount = 0;
                let upcomingLeavesCount = 0;
                const leaveTypeBreakdown = {};

                const formattedLeaves = data.map(leave => {
                    const startDate = new Date(leave.start_date);
                    const endDate = new Date(leave.end_date);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999);

                    if (today >= startDate && today <= endDate) onLeaveTodayCount++;
                    if (startDate > today && startDate <= new Date(today.setDate(today.getDate() + 7))) upcomingLeavesCount++;

                    leaveTypeBreakdown[leave.leave_type] = (leaveTypeBreakdown[leave.leave_type] || 0) + 1;

                    return {
                        ...leave,
                        employeeName: leave.employees?.name,
                        department: leave.employees?.department,
                        daysRemaining: Math.max(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)), 0)
                    };
                });

                setLeaves(formattedLeaves);
                setStats({ onLeaveToday: onLeaveTodayCount, upcomingLeaves: upcomingLeavesCount, leaveTypeBreakdown });

            } catch (err) {
                console.error("Error fetching leave data:", err.message);
                setError("Failed to load leave tracker data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, [filterDepartment, filterLeaveType]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className={styles.dashboardComponent}>
            <h2>Employees on Leave</h2>
            <div className={styles.filtersContainer}>
                <select onChange={(e) => setFilterDepartment(e.target.value)} value={filterDepartment}>
                    <option value="">All Departments</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    {/* Add dynamic departments */}
                </select>

                <select onChange={(e) => setFilterLeaveType(e.target.value)} value={filterLeaveType}>
                    <option value="">All Leave Types</option>
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    {/* Add dynamic leave types */}
                </select>
            </div>

            <div className={styles.leaveStats}>
                <p><strong>On Leave Today:</strong> {stats.onLeaveToday}</p>
                <p><strong>Upcoming Leaves (7 Days):</strong> {stats.upcomingLeaves}</p>
                <p><strong>Leave Type Breakdown:</strong></p>
                <ul>
                    {Object.entries(stats.leaveTypeBreakdown).map(([type, count]) => (
                        <li key={type}>{type}: {count}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.leaveTable}>
                {leaves.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave.id}>
                                    <td>{leave.employeeName}</td>
                                    <td>{leave.department}</td>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.start_date}</td>
                                    <td>{leave.end_date}</td>
                                    <td>{leave.daysRemaining}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employees on leave</p>
                )}
            </div>
        </div>
    );
};

export default EmployeesOnLeaveTracker;