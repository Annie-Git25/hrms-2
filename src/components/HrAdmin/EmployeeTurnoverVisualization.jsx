// src/components/HrAdmin/EmployeeTurnoverVisualization.jsx
import React, { useState, useEffect } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import supabase from "../../services/supabase";
import styles from "../../styles/DashboardComponents.module.css"; 
import LoadingSpinner from "../LoadingSpinner"; 
import ErrorMessage from "../ErrorMessage"; 

const EmployeeTurnoverVisualization = () => {
    const [turnoverData, setTurnoverData] = useState([]);
    const [reasonsData, setReasonsData] = useState([]);
    const [stats, setStats] = useState({ overallRate: 0, avgTenure: 0, totalDepartures: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchTurnoverData = async () => {
            setLoading(true);
            setError(null);

            try {
                const startDate = `${year}-01-01`;
                const endDate = `${year}-12-31`;

                // ✅ Fetch terminated employees & their hire dates
                const { data: terminations, error: termError } = await supabase
                    .from("terminations")
                    .select(`
                        termination_date, reason_for_leaving, type, employee_id,
                        employees (hire_date, company_id)
                    `)
                    .gte("termination_date", startDate)
                    .lte("termination_date", endDate);

                if (termError) throw termError;

                const monthlyTurnoverMap = new Map();
                const reasonsCountMap = new Map();
                let totalDepartures = 0;
                let totalTenureDays = 0;

                terminations.forEach(term => {
                    totalDepartures++;

                    // 🔹 Group by Month-Year
                    const month = new Date(term.termination_date).getMonth();
                    const monthKey = `${year}-${(month + 1).toString().padStart(2, "0")}`;
                    if (!monthlyTurnoverMap.has(monthKey)) {
                        monthlyTurnoverMap.set(monthKey, { voluntary: 0, involuntary: 0, total: 0 });
                    }
                    monthlyTurnoverMap.get(monthKey)[term.type]++;
                    monthlyTurnoverMap.get(monthKey).total++;

                    // 🔹 Count Reasons
                    const reason = term.reason_for_leaving || "Unknown";
                    reasonsCountMap.set(reason, (reasonsCountMap.get(reason) || 0) + 1);

                    // 🔹 Calculate Average Tenure
                    if (term.employees?.hire_date) {
                        const hireDate = new Date(term.employees.hire_date);
                        const terminationDate = new Date(term.termination_date);
                        totalTenureDays += (terminationDate - hireDate) / (1000 * 60 * 60 * 24);
                    }
                });

                const formattedMonthlyData = Array.from(monthlyTurnoverMap.entries()).map(([month, data]) => ({
                    name: month, ...data
                }));

                const formattedReasonsData = Array.from(reasonsCountMap.entries()).map(([reason, value]) => ({
                    name: reason, value
                }));

                // ✅ Fetch active employee count for turnover rate calculation
                const { count: activeEmployeesCount, error: countError } = await supabase
                    .from("employees")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "active");

                if (countError) throw countError;

                setTurnoverData(formattedMonthlyData);
                setReasonsData(formattedReasonsData);
                setStats({
                    overallRate: activeEmployeesCount > 0 ? ((totalDepartures / activeEmployeesCount) * 100).toFixed(2) : 0,
                    avgTenure: totalDepartures > 0 ? (totalTenureDays / totalDepartures / 365).toFixed(1) : 0,
                    totalDepartures
                });

            } catch (err) {
                console.error("Error fetching turnover data:", err.message);
                setError("Failed to load turnover data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTurnoverData();
    }, [year]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className={styles.turnoverContainer}>
            <h2>Employee Turnover Rate - {year}</h2>

            <div className={styles.charts}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={turnoverData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="voluntary" fill="#FF7300" />
                        <Bar dataKey="involuntary" fill="#387908" />
                        <Bar dataKey="total" fill="#253D90" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        {reasonsData.map((entry, index) => (
                            <Pie 
                                data={reasonsData} 
                                cx="50%" cy="50%" labelLine={false} label 
                                outerRadius={80} fill="#FFC20E" dataKey="value"
                            >
                                {reasonsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`#${(Math.random() * 0xFFFFFF << 0).toString(16)}`} />
                                ))}
                            </Pie>
                        ))}
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.stats}>
                <p><strong>Overall Turnover Rate:</strong> {stats.overallRate}%</p>
                <p><strong>Average Tenure:</strong> {stats.avgTenure} years</p>
                <p><strong>Total Departures:</strong> {stats.totalDepartures}</p>
            </div>
        </div>
    );
};

export default EmployeeTurnoverVisualization;