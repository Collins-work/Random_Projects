import { useState } from 'react';

function InvoiceForm({ onInvoiceGenerated, invoice }) {
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        name: '',
        quantity: 1,
        price: 0
    });
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(7.5);

    const handleAddItem = () => {
        if (!currentItem.name || currentItem.quantity <= 0 || currentItem.price <= 0) {
            alert('Please fill in all item fields with valid values');
            return;
        }

        setItems([...items, { ...currentItem, id: Date.now() }]);
        setCurrentItem({ name: '', quantity: 1, price: 0 });
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleReset = () => {
        setItems([]);
        setCurrentItem({ name: '', quantity: 1, price: 0 });
        setDiscount(0);
        setTaxRate(7.5);
        onInvoiceGenerated(null);
    };

    const handleGenerateInvoice = async () => {
        if (items.length === 0) {
            alert('Please add at least one item');
            return;
        }

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    discount,
                    taxRate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate invoice');
            }

            const invoiceData = await response.json();
            onInvoiceGenerated(invoiceData);

            // Reset form
            setItems([]);
            setCurrentItem({ name: '', quantity: 1, price: 0 });
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert('Failed to generate invoice. Please try again.');
        }
    };

    return (
        <div className="invoice-form">
            <h2>📝 Add Invoice Items</h2>

            <div className="item-input">
                <div className="form-group">
                    <label>Item Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Laptop, Service, Product"
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={currentItem.quantity}
                        onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.price}
                        onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                    />
                </div>

                <button className="btn btn-add" onClick={handleAddItem}>
                    ➕ Add
                </button>
            </div>

            {items.length > 0 && (
                <div className="items-list">
                    <h3>Items Added:</h3>
                    {items.map((item) => (
                        <div key={item.id} className="item-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{item.name}</strong> - Qty: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                </div>
                                <button className="btn btn-remove" onClick={() => handleRemoveItem(item.id)}>
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="discount-tax-section">
                <div className="form-group">
                    <label>💰 Discount (%)</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label>📊 Tax Rate (%)</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                    />
                </div>
            </div>

            <button
                className="btn btn-generate"
                onClick={handleGenerateInvoice}
                disabled={items.length === 0}
            >
                🧾 Generate Invoice
            </button>

            {invoice && (
                <div className="action-buttons">
                    <button
                        className="btn btn-action"
                        onClick={handleReset}
                    >
                        🔄 Reset
                    </button>
                </div>
            )}
        </div>
    );
}

export default InvoiceForm;
