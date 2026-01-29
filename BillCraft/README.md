#  Invoice System

A professional full-stack invoice management system built with React and Node.js. Create, calculate, and display invoices with automatic discount and tax calculations.

##  Features

- **Add Invoice Items**: Enter item names, quantities, and prices
- **Automatic Calculations**: Real-time subtotal calculations
- **Discount System**: Apply percentage-based discounts to invoices
- **Tax Calculator**: Automatic VAT/tax calculation (default 7.5%, customizable)
- **Professional Display**: Clean, formatted invoice layout like a receipt
- **Responsive Design**: Works on desktop and mobile devices

##  Custom Features

This system includes a **Discount & Tax Calculator** that:
- Allows custom discount percentages (e.g., 10% off)
- Automatically applies tax (VAT at 7.5% by default, customizable)
- Shows detailed breakdown:
  - Subtotal
  - Discount amount
  - Amount after discount
  - Tax amount
  - Final total

##  Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- Modern CSS with gradient designs

**Backend:**
- Node.js
- Express.js
- In-memory storage
- RESTful API

##  Project Structure

```
invoice-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceForm.jsx
│   │   │   └── InvoiceDisplay.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

2. **Install Backend Dependencies**
```powershell
cd server
npm install
```

3. **Install Frontend Dependencies**
```powershell
cd ../client
npm install
```

### Running the Application

You need to run both the backend and frontend servers:

**Terminal 1 - Start Backend Server:**
```powershell
cd server
npm start
```
Backend will run on http://localhost:5000

**Terminal 2 - Start Frontend Development Server:**
```powershell
cd client
npm run dev
```
Frontend will run on http://localhost:3000

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

##  How to Use

1. **Add Items**:
   - Enter item name (e.g., "Laptop", "Service")
   - Set quantity
   - Set price per unit
   - Click "➕ Add" button

2. **Set Discount & Tax**:
   - Enter discount percentage (0-100)
   - Adjust tax rate if needed (default is 7.5%)

3. **Generate Invoice**:
   - Click "🧾 Generate Invoice" button
   - View the formatted invoice below

4. **Invoice Details**:
   - Unique invoice ID
   - Date and time
   - Itemized list with amounts
   - Subtotal, discount, tax breakdown
   - Final total

## 🔌 API Endpoints

### Get All Invoices
```
GET /api/invoices
```

### Get Single Invoice
```
GET /api/invoices/:id
```

### Create Invoice
```
POST /api/invoices
Body: {
  items: [
    { name: string, quantity: number, price: number }
  ],
  discount: number,      // percentage (0-100)
  taxRate: number        // percentage (0-100)
}
```

### Delete Invoice
```
DELETE /api/invoices/:id
```

### Health Check
```
GET /health
```

##  Example Usage

**Input:**
- Item: Laptop, Qty: 2, Price: $1000
- Item: Mouse, Qty: 3, Price: $25
- Discount: 10%
- Tax: 7.5%

**Calculation:**
- Subtotal: $2,075.00
- Discount (10%): -$207.50
- After Discount: $1,867.50
- Tax (7.5%): +$140.06
- **Total: $2,007.56**

##  Features Highlights

- **Modern UI**: Gradient design with smooth animations
- **Real-time Updates**: Instant calculations as you type
- **Input Validation**: Ensures valid data entry
- **Responsive Layout**: Mobile-friendly design
- **Professional Output**: Invoice format suitable for business use

##  Future Enhancements (Optional)

- PDF export functionality
- Customer information fields
- Invoice history and storage
- Email invoice delivery
- Multiple tax rates
- Currency selection
- Payment tracking

##  Development Notes

- Frontend proxies API requests to backend (configured in vite.config.js)
- In-memory storage means data is lost on server restart
- Use nodemon for development (auto-restart on changes)

## 🤝Contributing

Feel free to fork this project and add your own features!

##  License

This project is open source and available for educational purposes.

