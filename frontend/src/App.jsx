import { useEffect, useState } from "react";
import { api } from "./api";
import { Dialog } from "@headlessui/react";

function App() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    ItemName: "",
    Category: "",
    Quantity: "",
    Unit: "",
    DateAdded: "",
    Status: "",
  });

  // ✅ Fetch items on load
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

  function openModal(item = null) {
    if (item) {
      setEditingItem(item);
      setForm({
        ItemName: item.ItemName,
        Category: item.Category,
        Quantity: item.Quantity,
        Unit: item.Unit,
        Status: item.Status,
        DateAdded: item.DateAdded ? item.DateAdded.split("T")[0] : "",
      });
    } else {
      setEditingItem(null);
      setForm({
        ItemName: "",
        Category: "",
        Quantity: "",
        Unit: "",
        DateAdded: "",
        Status: "",
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, form); // ✅ SQL Server uses "id"
      } else {
        await api.createItem(form);
      }
      closeModal();
      loadItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.deleteItem(id);
      loadItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  // ✅ Extracted table rendering into a function
  function renderTable() {
    return (
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date Added</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.ItemName}</td>
                <td className="border p-2">{item.Category}</td>
                <td className="border p-2">{item.Quantity}</td>
                <td className="border p-2">{item.Unit}</td>
                <td className="border p-2">{item.Status}</td>
                <td className="border p-2">
                  {item.DateAdded
                    ? new Date(item.DateAdded).toLocaleDateString()
                    : ""}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        <button
          onClick={() => openModal()}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Item
        </button>

        {/* ✅ Table function call */}
        {renderTable()}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              {editingItem ? "Edit Item" : "Add Item"}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Item Name"
                value={form.ItemName}
                onChange={(e) =>
                  setForm({ ...form, ItemName: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={form.Category}
                onChange={(e) =>
                  setForm({ ...form, Category: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={form.Quantity}
                onChange={(e) =>
                  setForm({ ...form, Quantity: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Unit"
                value={form.Unit}
                onChange={(e) =>
                  setForm({ ...form, Unit: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <select
                value={form.Status}
                onChange={(e) =>
                  setForm({ ...form, Status: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <input
                type="date"
                value={form.DateAdded}
                onChange={(e) =>
                  setForm({ ...form, DateAdded: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
