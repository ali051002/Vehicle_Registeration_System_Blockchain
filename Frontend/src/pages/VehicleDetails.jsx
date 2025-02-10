import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VehicleDetails = () => {
    const { vehicleId } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("🚀 Vehicle Details Page Loaded. Vehicle ID from URL:", vehicleId);

    useEffect(() => {
        if (!vehicleId) {
            console.error("❌ Vehicle ID is missing in URL!");
            setError("Vehicle ID is missing.");
            setLoading(false);
            return;
        }

        const fetchVehicleDetails = async () => {
            console.log("📡 Fetching Vehicle Details for ID:", vehicleId);
        
            try {
                const response = await axios.get(`http://localhost:8085/api/vehicleById`, {
                    params: { vehicleId }
                });
        
                console.log("✅ API Response:", response.data);
        
                if (response.data && typeof response.data === "object" && response.data._id) {
                    setVehicle(response.data);
                } else {
                    console.warn("⚠ No valid vehicle details found.");
                    setError("Vehicle details not found.");
                }
            } catch (err) {
                console.error("❌ Error fetching vehicle details:", err);
                setError("Failed to fetch vehicle details");
            } finally {
                setLoading(false);
            }
        };
        
        fetchVehicleDetails();
    }, [vehicleId]);

    if (loading) {
        console.log("⏳ Loading vehicle details...");
        return <p className="text-center text-blue-400">Loading vehicle details...</p>;
    }
    if (error) {
        console.warn("⚠ Error displayed:", error);
        return <p className="text-center text-red-400">{error}</p>;
    }

    console.log("🎉 Vehicle details successfully loaded:", vehicle);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="max-w-3xl w-full p-8 bg-gray-800 shadow-xl rounded-lg">
                <h2 className="text-4xl font-bold text-gray-100 mb-6 text-center">🚗 Vehicle Details</h2>
                {vehicle ? (
                    <div className="grid grid-cols-2 gap-6 border border-gray-700 p-6 rounded-lg">
                        <p><span className="text-gray-400">🔹 ID:</span> {vehicle._id || "N/A"}</p>
                        <p><span className="text-gray-400">👤 Owner ID:</span> {vehicle.ownerId || "N/A"}</p>
                        <p><span className="text-gray-400">🏷 Make:</span> {vehicle.make || "N/A"}</p>
                        <p><span className="text-gray-400">🚘 Model:</span> {vehicle.model || "N/A"}</p>
                        <p><span className="text-gray-400">📅 Year:</span> {vehicle.year || "N/A"}</p>
                        <p><span className="text-gray-400">🎨 Color:</span> {vehicle.color || "N/A"}</p>
                        <p><span className="text-gray-400">🔩 Chassis #:</span> {vehicle.chassisNumber || "N/A"}</p>
                        <p><span className="text-gray-400">🔧 Engine #:</span> {vehicle.engineNumber || "N/A"}</p>
                        <p>
                            <span className="text-gray-400">📌 Status:</span>
                            <span className={`px-3 py-1 ml-2 text-sm font-semibold rounded-lg 
                                ${vehicle.status === "Registered" ? "bg-green-600 text-white" 
                                : vehicle.status === "Unregistered" ? "bg-yellow-500 text-black" 
                                : "bg-red-500 text-white"}`}>
                                {vehicle.status || "N/A"}
                            </span>
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-red-400">No vehicle data available.</p>
                )}
            </div>
        </div>
    );
    
};

export default VehicleDetails;
