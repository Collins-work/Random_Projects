import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for invoices
let invoices = [];

// Routes

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Invoice System API',
        version: '1.0.0',
        endpoints: {
            invoices: '/api/invoices',
            health: '/health'
        }
    });
});

// Get all invoices
app.get('/api/invoices', (req, res) => {
    res.json(invoices);
});

// Get a single invoice by ID
app.get('/api/invoices/:id', (req, res) => {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
});

// Create a new invoice
app.post('/api/invoices', (req, res) => {
    const { items, discount, taxRate } = req.body;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items are required' });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
    }, 0);

    // Calculate discount amount
    const discountPercent = discount || 0;
    const discountAmount = subtotal * (discountPercent / 100);

    // Calculate amount after discount
    const afterDiscount = subtotal - discountAmount;

    // Calculate tax
    const tax = taxRate || 7.5;
    const taxAmount = afterDiscount * (tax / 100);

    // Calculate final total
    const total = afterDiscount + taxAmount;

    // Create invoice
    const invoice = {
        id: uuidv4(),
        items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discountPercent.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        taxRate: parseFloat(tax.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        createdAt: new Date().toISOString()
    };

    invoices.push(invoice);
    res.status(201).json(invoice);
});

// Delete an invoice
app.delete('/api/invoices/:id', (req, res) => {
    const index = invoices.findIndex(inv => inv.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Invoice not found' });
    }

    invoices.splice(index, 1);
    res.json({ message: 'Invoice deleted successfully' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
