import { useEffect, useState } from "react";
import { api } from "../api";
import { Dialog } from "@headlessui/react";
import {
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  X,
  Save,
  CheckCircle,
} from "lucide-react";

function HomePage() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [UserName, setUserName] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("Parsed user:", parsedUser); // check what backend sends
        setUserName(parsedUser.userName);
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
  }, []);

  // Fixed categories
  const fixedCategories = [
    "Office Supplies",
    "Cleaning Supplies",
    "Consumables",
    "Stationery & Labels",
  ];

  const fixedUnits = ["Pcs", "Box", "Packs", "Liters", "Ream", "Pad", "Can"];

  // Form state
  const [form, setForm] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    status: "",
    dateAdded: "",
  });

  // Fetch items on mount
  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await api.getAllItems();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  // ---------- CRUD ----------
  function openModal(item = null) {
    if (item) {
      setEditingItem(item);
      setForm({
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        status: item.status,
        dateAdded: item.dateAdded ? item.dateAdded.split("T")[0] : "",
      });
    } else {
      resetForm();
      setEditingItem(null);
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
    resetForm();
  }

  function resetForm() {
    setForm({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      status: "",
      dateAdded: "",
    });
  }

  function openViewModal(item) {
    setViewingItem(item);
  }

  function closeViewModal() {
    setViewingItem(null);
  }

  function openDeleteModal(item) {
    setDeleteTarget(item);
    setIsDeleteOpen(true);
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
    setIsDeleteOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      itemName: form.itemName,
      category: form.category,
      quantity: form.quantity ? parseInt(form.quantity, 10) : 0,
      unit: form.unit,
      status: form.status,
    };

    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, {
          ...payload,
          id: editingItem.id,
          dateAdded: form.dateAdded || editingItem.dateAdded,
        });
        setSuccessMessage("Item updated successfully!");
      } else {
        await api.createItem(payload);
        setSuccessMessage("New item added successfully!");
      }

      closeModal();
      setIsSuccessOpen(true);
      loadItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.deleteItem(deleteTarget.id);
      closeDeleteModal();
      loadItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("user"); // clear saved user
    localStorage.removeItem("token"); // clear token if you stored it
    window.location.href = "/login"; // redirect to login page
  };
  // ---------- Counts ----------
  const categoryCounts = fixedCategories.reduce((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat).length;
    return acc;
  }, {});

  const totalItems = items.reduce((sum, item) => {
    if (item.status === "Available") {
      return sum + (parseInt(item.quantity, 10) || 0);
    }
    return sum;
  }, 0);

  // ---------- Table ----------
  function renderTable() {
    return (
      <div className="overflow-hidden rounded-lg shadow border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date Added</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3">{item.itemName}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.unit}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {item.dateAdded
                      ? new Intl.DateTimeFormat("en-GB").format(
                          new Date(item.dateAdded)
                        )
                      : ""}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => openViewModal(item)}
                      className="p-2 rounded bg-blue-100 text-gray-600 hover:bg-blue-200"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  function ItemCard({ item }) {
    return (
      <div className="p-4 border rounded shadow">
        <h3>{item.ItemName}</h3>
        <p>{item.Category}</p>
        {item.ImageUrl && (
          <img
            src={`https://localhost:5001${item.ImageUrl}`}
            alt={item.ItemName}
            className="w-32 h-32 object-cover mt-2"
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-sky-700 py-2  px-4 text-white">
        <h1 className="text-lg font-bold">Welcome {UserName}</h1>
        <button
          onClick={handleLogout}
          className="bg-sky-500 px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded-lg mt-6">
        {/* Title */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-700 tracking-wide border-b pb-3">
            Mini Inventory System
          </h1>
        </div>

        {/* Totals per fixed category */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {fixedCategories.map((cat) => (
              <div
                key={cat}
                className="bg-sky-50 border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col items-center text-center hover:shadow-md transition"
              >
                <div className="text-xs text-white-500">{cat}</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {categoryCounts[cat]}
                </div>
              </div>
            ))}
            <div className="bg-cyan-600 border border-gray-500 rounded-lg shadow p-3 flex flex-col items-center text-center text-white">
              <div className="text-xs font-medium">Total Items</div>
              <div className="text-lg font-bold mt-1">{totalItems}</div>
            </div>
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 active:scale-95 transition"
          >
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        {renderTable()}
      </div>
      {/* ---------- Add/Edit Modal ---------- */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                {editingItem ? "Edit Item" : "Add Item"}
              </Dialog.Title>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Name full width */}
              <input
                type="text"
                placeholder="Item Name"
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />

              {/* Grid for Category + Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  required
                >
                  <option value="">Category</option>
                  {fixedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  required
                />
              </div>

              {/* Grid for Unit + Status */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  required
                >
                  <option value="">Unit</option>
                  {fixedUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>

                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  required
                >
                  <option value="">Status</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {editingItem && (
                <input
                  type="date"
                  value={form.dateAdded}
                  onChange={(e) =>
                    setForm({ ...form, dateAdded: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              )}

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ---------- View Modal ---------- */}
      <Dialog
        open={!!viewingItem}
        onClose={closeViewModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                Item Details
              </Dialog.Title>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {viewingItem && (
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Item Name:</strong> {viewingItem.itemName}
                </p>
                <p>
                  <strong>Category:</strong> {viewingItem.category}
                </p>
                <p>
                  <strong>Quantity:</strong> {viewingItem.quantity}
                </p>
                <p>
                  <strong>Unit:</strong> {viewingItem.unit}
                </p>
                <p>
                  <strong>Status:</strong> {viewingItem.status}
                </p>
                <p>
                  <strong>Date Added:</strong>{" "}
                  {viewingItem.dateAdded
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(viewingItem.dateAdded)
                      )
                    : ""}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ---------- Delete Confirmation Modal ---------- */}
      <Dialog
        open={isDeleteOpen}
        onClose={closeDeleteModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-200 text-center">
            <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </Dialog.Title>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteTarget?.itemName || "this item"}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ---------- Success Modal ---------- */}
      <Dialog
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-200 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="text-green-500 mb-3" size={40} />
              <p className="text-gray-700 mb-6 text-sm">{successMessage}</p>
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default HomePage;
