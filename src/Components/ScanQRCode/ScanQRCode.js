import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import QrScanner from "react-qr-scanner"; // Import QR scanner
import jsQR from "jsqr"; // For image QR scanning
import styles from "./ScanQRCode.module.css"; // Adjust as necessary

const ScanQRCode = ({ onCloseModal, fetchItems }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedQRFile, setUploadedQRFile] = useState(null); // State for uploaded file

  const closeModals = () => {
    onCloseModal();
    setScanResult(null);
    setError(null);
    setUploadedQRFile(null);
  };
  // Handle live QR scan
  const handleScan = async (data) => {
    if (data) {
      setScanResult(data.text); // QR Code scanned result
      try {
        const response = await axios.post(
          "https://qr-based-inventry-system.onrender.com/api/items/scanQR",
          {
            qrCodeData: data.text,
          }
        );

        if (response.status === 200) {
          alert("Item updated successfully!"); // Notify user of success
          fetchItems(); // Refresh item list after successful scan
        } else {
          setError("Failed to update the item.");
        }
      } catch (err) {
        setError(`Error: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
    setError(err.message);
  };

  // File upload and QR code decoding
  const handleQRFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedQRFile(file);
    decodeQRFromImage(file);
  };

  const decodeQRFromImage = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setScanResult(code.data); // Successfully decoded QR code
          handleUpdateItemWithQRCode(code.data); // Send decoded data to backend
        } else {
          setError("No QR code found in the uploaded image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateItemWithQRCode = async (qrCodeData) => {
    if (qrCodeData) {
      try {
        const response = await axios.post(
          "https://qr-based-inventry-system.onrender.com/api/items/scanQR",
          {
            qrCodeData,
          }
        );

        if (response.status === 200) {
          alert("Item updated successfully!");
          fetchItems(); // Refresh the items list
        } else {
          setError("Failed to update the item.");
        }
      } catch (err) {
        setError(`Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      setError("QR code data is invalid or empty.");
    }
  };

  const previewStyle = {
    height: 200,
    width: 300,
  };

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>Scan QR Code</h2>
        <FaTimes className={styles["modal-close"]} onClick={closeModals} />
        {/* Live QR Scan */}
        <QrScanner
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
        {/* File Upload for QR Scan */}
        <div className={styles["file-upload-section"]}>
          <label htmlFor="qrUpload">Upload QR Code:</label>
          <input
            type="file"
            id="qrUpload"
            accept="image/*"
            onChange={handleQRFileUpload}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {scanResult && (
          <p className={styles.result}>Scan Result: {scanResult}</p>
        )}
      </div>
    </div>
  );
};

export default ScanQRCode;
