# 📦 MiniListInventorySystem

A simple **Inventory Management System** built with **ASP.NET Core Web API**, **React (Vite)**, and **SQL Server**.

---

## 🚀 Features
- 🔑 User registration & login (**JWT authentication**)  
- 📋 Add, View, Edit, Delete, and **paginate items**  
- 🗂 Categories:
  - Office Supplies
  - Stationery & Labels
  - Consumables
  - Cleaning Supplies  
- 📦 Item fields:
  - `ItemName`
  - `Category`
  - `Quantity`
  - `Unit`
  - `Status`
  - `DateAdded`

---

## 🛠️ Tech Stack
- **Frontend**: React + Vite + TailwindCSS  
- **Backend**: ASP.NET Core Web API  
- **Database**: SQL Server (SSMS)  
- **Deployment**: Docker & Docker Compose  

---

## ⚙️ Quick Setup

### 1️⃣ Database (SQL Server)
```sql
CREATE DATABASE MiniItemsDB;
GO
USE MiniItemsDB;
GO

CREATE TABLE MiniItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    Unit NVARCHAR(50) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Available',
    DateAdded DATETIME DEFAULT GETDATE()
);

INSERT INTO MiniItems (ItemName, Category, Quantity, Unit, Status, DateAdded)
VALUES ('Stapler', 'Office Supplies', 20, 'pcs', 'Available', GETDATE());

---
### 2️⃣ Backend
cd backend
dotnet restore
dotnet run


###3️⃣ Frontend
cd frontend
npm install
npm run dev


###4️⃣ Docker
docker-compose up --build

📌 Roadmap
💲 Add item price & compute total value
👥 Role-based access (Admin/User)
📑 Export to CSV/Excel



