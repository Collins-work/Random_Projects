import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let invoices = [];

// Get all invoices
app.get('/api/invoices', (req, res) => {
    res.json(invoices);
});

// Get single invoice
app.get('/api/invoices/:id', (req, res) => {
    const invoice = invoices.find(inv => inv.id === req.params.id);
    if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
});

// Create invoice
app.post('/api/invoices', (req, res) => {
    const invoice = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    invoices.push(invoice);
    res.status(201).json(invoice);
});

// Update invoice
app.put('/api/invoices/:id', (req, res) => {
    const index = invoices.findIndex(inv => inv.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Invoice not found' });
    }
    invoices[index] = {
        ...invoices[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    res.json(invoices[index]);
});

// Delete invoice
app.delete('/api/invoices/:id', (req, res) => {
    const index = invoices.findIndex(inv => inv.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Invoice not found' });
    }
    invoices.splice(index, 1);
    res.status(204).send();
});

export default app;
