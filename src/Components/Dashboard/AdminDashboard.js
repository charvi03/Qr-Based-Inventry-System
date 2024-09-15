import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import { FaPencilAlt, FaTrashAlt, FaTimes, FaDownload } from "react-icons/fa";
import ScanQRCode from "../ScanQRCode/ScanQRCode";

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    sno: "",
    name: "",
    partNumber: "",
    dateReceived: "",
    balanceItems: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setUsername(localStorage.getItem("username"));
      fetchItems(); // Fetch items on load
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://qr-based-inventry-system.onrender.com/api/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://qr-based-inventry-system.onrender.com/api/items/generateQR",
        formData
      );
      setItems([...items, response.data]);
      setIsModalOpen(false);
      setFormData({
        sno: "",
        name: "",
        partNumber: "",
        dateReceived: "",
        balanceItems: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem && editItem._id) {
        const response = await axios.put(
          `https://qr-based-inventry-system.onrender.com/api/items/${editItem._id}`,
          editItem
        );

        // Fetch the updated item with the new QR code
        const updatedItem = await axios.get(`https://qr-based-inventry-system.onrender.com/api/items/${editItem._id}`);

        setItems(
          items.map((item) =>
            item._id === updatedItem.data._id ? updatedItem.data : item
          )
        );
        setIsEditModalOpen(false);
        setEditItem(null);
      }
    } catch (err) {
      console.error("Error updating item", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://qr-based-inventry-system.onrender.com/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  const handleDownload = (qrCodeUrl) => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    link.click();
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsScanModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <h1>Admin Dashboard</h1>
        <div className={styles["navbar-right"]}>
          <button className={styles["logout-button"]} onClick={handleLogout}>
            Logout
          </button>
          <span className={styles["welcome-message"]}>
            {username ? `Welcome, ${username}` : "Loading..."}
          </span>
        </div>
      </nav>

      {/* Action Buttons */}
      <div className={styles["action-buttons"]}>
        <button onClick={() => setIsModalOpen(true)}>Generate QR</button>
        <button onClick={() => setIsScanModalOpen(true)}>Scan QR</button>
      </div>

      {/* Items List Table */}
      <div className={styles["table-container"]}>
        <h2>Items List</h2>
        <table>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Name of the Item</th>
              <th>Part Number</th>
              <th>Date Received</th>
              <th>Date Dispatched</th>
              <th>Balance Items</th>
              <th>QR Code</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.sno}</td>
                  <td>{item.name}</td>
                  <td>{item.partNumber}</td>
                  <td>{new Date(item.dateReceived).toLocaleDateString()}</td>
                  <td>
                    {item.dateDispatch
                      ? new Date(item.dateDispatch).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{item.balanceItems}</td>
                  <td>
                    <div className={styles["qr-container"]}>
                      <img src={item.qrCode} alt="QR Code" />
                      <FaDownload onClick={() => handleDownload(item.qrCode)} />
                    </div>
                  </td>
                  <td className={styles["change-icons"]}>
                    <FaPencilAlt
                      className={styles.icon}
                      onClick={() => {
                        setEditItem(item);
                        setIsEditModalOpen(true);
                      }}
                    />
                    <FaTrashAlt
                      className={styles.icon}
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for QR Generation */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <FaTimes className={styles["modal-close"]} onClick={closeModals} />
            <h2>Generate QR Code</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="sno">Serial Number:</label>
              <input
                type="number"
                id="sno"
                name="sno"
                placeholder="Serial Number"
                value={formData.sno}
                onChange={handleChange}
                required
              />
              <label htmlFor="name">Name of the Item:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name of the Item"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="partNumber">Part Number:</label>
              <input
                type="text"
                id="partNumber"
                name="partNumber"
                placeholder="Part Number"
                value={formData.partNumber}
                onChange={handleChange}
                required
              />
              <label htmlFor="dateReceived">Date Received:</label>
              <input
                type="date"
                id="dateReceived"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Current date
                required
              />
              <label htmlFor="balanceItems">Number of Items:</label>
              <input
                type="number"
                id="balanceItems"
                name="balanceItems"
                placeholder="Number of Items"
                value={formData.balanceItems}
                onChange={handleChange}
                required
              />
              <button type="submit">Generate QR</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for QR Scanning */}
      {isScanModalOpen && (
        <div className={styles.modal}>
            {/* <FaTimes className={styles["modal-close"]} onClick={closeModals} /> */}
            <ScanQRCode onCloseModal={closeModals} fetchItems={fetchItems} />
        </div>
      )}

      {/* Modal for Editing Item */}
      {isEditModalOpen && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <div className={styles["modal-content"]}>
              <FaTimes
                className={styles["modal-close"]}
                onClick={closeModals}
              />
              <h2>Edit Item</h2>
              <form onSubmit={handleEditSubmit}>
                <label htmlFor="sno">Serial Number:</label>
                <input
                  type="number"
                  id="sno"
                  name="sno"
                  placeholder="Serial Number"
                  value={editItem?.sno || ""}
                  onChange={handleEditChange}
                  required
                />
                <label htmlFor="name">Name of the Item:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name of the Item"
                  value={editItem?.name || ""}
                  onChange={handleEditChange}
                  required
                />
                <label htmlFor="partNumber">Part Number:</label>
                <input
                  type="text"
                  id="partNumber"
                  name="partNumber"
                  placeholder="Part Number"
                  value={editItem?.partNumber || ""}
                  onChange={handleEditChange}
                  required
                />
                <label htmlFor="dateReceived">Date Received:</label>
                <input
                  type="date"
                  id="dateReceived"
                  name="dateReceived"
                  value={editItem?.dateReceived?.slice(0, 10) || ""}
                  onChange={handleEditChange}
                  required
                />
                <label htmlFor="dateDispatch">Date Dispatched:</label>
                <input
                  type="date"
                  id="dateDispatch"
                  name="dateDispatch"
                  value={editItem?.dateDispatch?.slice(0, 10) || ""} // Change dateDispatched to dateDispatch
                  onChange={handleEditChange}
                  min={new Date().toISOString().split("T")[0]} // Use current date as the minimum value
                />
                <label htmlFor="balanceItems">Number of Items:</label>
                <input
                  type="number"
                  id="balanceItems"
                  name="balanceItems"
                  placeholder="Number of Items"
                  value={editItem?.balanceItems || ""}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
