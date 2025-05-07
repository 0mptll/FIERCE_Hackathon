import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, Check, AlertCircle } from "lucide-react";

const BASE_URL = "http://localhost:8080/api/utility-bill/upload";

const UtilityBillUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        billType: "electricity",
        billAmount: "",
        billDate: "",
        provider: "",
        consumerNumber: "",
        address: "",
    });
    const [error, setError] = useState(null);

    // Check localStorage for user and upload status
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const uploadComplete = localStorage.getItem("uploadComplete");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user?.id) {
                setUserId(user.id);
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }

        if (uploadComplete === "true") {
            setSuccess(true);
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (
            !selectedFile.type.startsWith("image/") &&
            selectedFile.type !== "application/pdf"
        ) {
            setError("Invalid file type. Please upload a PDF, JPG, or PNG.");
            setFile(null);
            return;
        }

        if (selectedFile.size > 5242880) {
            setError("File size too large. Please upload a file smaller than 5MB.");
            setFile(null);
            return;
        }

        setError(null);
        setFile(selectedFile);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        if (!file) {
            setError("Please upload a utility bill document.");
            setProcessing(false);
            return;
        }

        const {
            billType,
            provider,
            billAmount,
            billDate,
            consumerNumber,
            address,
        } = formData;

        if (!billType || !provider || !billAmount || !billDate || !consumerNumber || !address) {
            setError("Please fill in all required fields.");
            setProcessing(false);
            return;
        }

        try {
            const billData = new FormData();
            billData.append("userId", userId);
            billData.append("billType", billType);
            billData.append("provider", provider);
            billData.append("consumerNumber", consumerNumber);
            billData.append("address", address);
            billData.append("billDate", billDate);
            billData.append("billAmount", billAmount);
            billData.append("file", file);

            const response = await axios.post(BASE_URL, billData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Upload Successful:", response.data);
            setSuccess(true);
            localStorage.setItem("uploadComplete", "true"); // ✅ Persist success
            setProcessing(false);

            // Optional: redirect logic can be triggered manually by the user
            // or retained until they choose to navigate elsewhere

        } catch (error) {
            console.error("Error uploading utility bill:", error);
            const errorMessage =
                error.response?.data || error.message || "An error occurred.";
            setError(errorMessage);
            setProcessing(false);
        }
    };

    if (!userId) {
        return <div className="text-center py-5">Loading user details...</div>;
    }

    return (
        <div className="container py-5">
            <h2 className="mb-2">Upload Utility Bill</h2>
            <p className="text-muted mb-4">
                Upload your utility bills to verify your address and improve your location consistency score.
            </p>

            {success && (
                <div className="alert alert-success">
                    Bill uploaded successfully! You can safely refresh the page or return later.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Bill Type</label>
                    <select
                        className="form-select"
                        name="billType"
                        value={formData.billType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="electricity">Electricity Bill</option>
                        <option value="water">Water Bill</option>
                        <option value="gas">Gas Bill</option>
                        <option value="internet">Internet Bill</option>
                        <option value="phone">Phone Bill</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label">Service Provider</label>
                    <input
                        type="text"
                        className="form-control"
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                        placeholder="e.g., BSES, Jio, Airtel"
                        required
                    />
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Bill Amount (INR)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="billAmount"
                            value={formData.billAmount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Bill Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="billDate"
                            value={formData.billDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Consumer Number / Account ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="consumerNumber"
                        value={formData.consumerNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Address (as shown on bill)</label>
                    <textarea
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="form-label">Upload Bill Document</label>
                    <div
                        className={`upload-zone ${file ? "border-primary bg-light" : ""}`}
                        onClick={() =>
                            document.getElementById("billFileUpload").click()
                        }
                    >
                        {file ? (
                            <div className="text-center">
                                <Check size={32} className="text-success mb-2" />
                                <p className="mb-1">{file.name}</p>
                                <p className="text-muted small mb-0">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        ) : (
                            <div>
                                <Upload size={32} className="text-primary mb-2" />
                                <p className="mb-1">Click to upload or drag and drop</p>
                                <p className="text-muted small mb-0">
                                    Supported formats: PDF, JPG, PNG (Max: 5MB)
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="billFileUpload"
                            className="d-none"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mb-4 d-flex align-items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="d-grid">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Processing...
                            </>
                        ) : (
                            "Upload and Verify Bill"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UtilityBillUpload;
