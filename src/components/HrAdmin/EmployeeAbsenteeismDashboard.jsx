// src/components/HrAdmin/EmployeeAbsenteeismDashboard.jsx
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import supabase from "../../services/supabase";
import styles from "../../styles/DashboardComponents.module.css";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

const EmployeeAbsenteeismDashboard = () => {
    const [absenteeismData, setAbsenteeismData] = useState([]);
    const [tardinessData, setTardinessData] = useState([]);
    const [topOffenders, setTopOffenders] = useState([]);
    const [stats, setStats] = useState({ totalAbsentDays: 0, avgAbsenteeismRate: 0, totalLateArrivals: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState("monthly");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchAttendanceData = async () => {
            setLoading(true);
            setError(null);

            try {
                let startDate = `${selectedYear}-01-01`;
                let endDate = `${selectedYear}-12-31`;

                const { data: attendanceRecords, error: attError } = await supabase
                    .from("attendance")
                    .select(`
                        date, status, clock_in_time,
                        employees ( id, name, department )
                    `)
                    .gte("date", startDate)
                    .lte("date", endDate);

                if (attError) throw attError;

                const { count: totalEmployees, error: empCountError } = await supabase
                    .from("employees")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "active");

                if (empCountError) throw empCountError;

                let totalAbsentDays = 0;
                let totalLateArrivals = 0;
                const employeeOffenses = new Map();
                const monthlyTrends = new Map();

                attendanceRecords.forEach(record => {
                    const employeeId = record.employees?.id;
                    const employeeName = record.employees?.name;
                    const employeeDept = record.employees?.department;
                    const recordDate = new Date(record.date);
                    const monthKey = `${recordDate.getFullYear()}-${(recordDate.getMonth() + 1).toString().padStart(2, "0")}`;

                    if (!employeeOffenses.has(employeeId)) {
                        employeeOffenses.set(employeeId, { absences: 0, late: 0, name: employeeName, department: employeeDept });
                    }
                    const offenseData = employeeOffenses.get(employeeId);

                    if (!monthlyTrends.has(monthKey)) {
                        monthlyTrends.set(monthKey, { absent: 0, late: 0, totalWorkDays: totalEmployees * 22 });
                    }
                    const trendData = monthlyTrends.get(monthKey);

                    if (record.status === "absent") {
                        totalAbsentDays++;
                        offenseData.absences++;
                        trendData.absent++;
                    }
                    if (record.status === "late") {
                        totalLateArrivals++;
                        offenseData.late++;
                        trendData.late++;
                    }
                });

                const sortedOffenders = Array.from(employeeOffenses.values())
                    .sort((a, b) => (b.absences + b.late) - (a.absences + a.late))
                    .slice(0, 10);

                const formattedTrends = Array.from(monthlyTrends.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([month, data]) => ({
                        name: month,
                        absenteeismRate: totalEmployees > 0 ? ((data.absent / (totalEmployees * 22)) * 100).toFixed(2) : 0,
                        tardinessRate: totalEmployees > 0 ? ((data.late / (totalEmployees * 22)) * 100).toFixed(2) : 0,
                    }));

                const avgAbsenteeismRate = totalEmployees > 0 ? ((totalAbsentDays / (totalEmployees * 260)) * 100).toFixed(2) : 0;

                setAbsenteeismData(formattedTrends);
                setTardinessData(formattedTrends);
                setTopOffenders(sortedOffenders);
                setStats({
                    totalAbsentDays: totalAbsentDays,
                    avgAbsenteeismRate: parseFloat(avgAbsenteeismRate),
                    totalLateArrivals: totalLateArrivals,
                });

            } catch (err) {
                console.error("Error fetching absenteeism data:", err.message);
                setError("Failed to load absenteeism data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [timePeriod, selectedYear]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className={styles.dashboardComponent}>
            <h2>Employee Absenteeism Dashboard - {selectedYear}</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={absenteeismData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="absenteeismRate" stroke="#FF7300" />
                    <Line type="monotone" dataKey="tardinessRate" stroke="#387908" />
                </LineChart>
            </ResponsiveContainer>

            <div className={styles.stats}>
                <p><strong>Total Absent Days:</strong> {stats.totalAbsentDays}</p>
                <p><strong>Average Absenteeism Rate:</strong> {stats.avgAbsenteeismRate}%</p>
                <p><strong>Total Late Arrivals:</strong> {stats.totalLateArrivals}</p>
            </div>

            <div className={styles.offendersTable}>
                <h3>Top 10 Offenders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Absences</th>
                            <th>Late Arrivals</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topOffenders.map(offender => (
                            <tr key={offender.name}>
                                <td>{offender.name}</td>
                                <td>{offender.department}</td>
                                <td>{offender.absences}</td>
                                <td>{offender.late}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeAbsenteeismDashboard;