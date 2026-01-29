import html2pdf from 'html2pdf.js';

function InvoiceDisplay({ invoice }) {
    const handleExportPDF = () => {
        if (!invoice) return;

        const element = document.getElementById('invoice-content');
        const opt = {
            margin: 10,
            filename: `invoice-${invoice.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (!invoice) {
        return (
            <div className="invoice-display">
                <div className="no-invoice">
                    <div className="no-invoice-icon">📋</div>
                    <p>No invoice generated yet</p>
                    <p style={{ fontSize: '0.9em', marginTop: '10px', color: '#aaa' }}>
                        Add items and click "Generate Invoice" to see your invoice here
                    </p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="invoice-display">
            <div className="export-button-container">
                <button className="btn btn-export" onClick={handleExportPDF}>
                    📥 Export PDF
                </button>
            </div>

            <div id="invoice-content" className="invoice-content">
                <div className="watermark">BillCraft</div>

                <div className="invoice-header">
                    <h2>INVOICE</h2>
                    <p className="invoice-date">
                        Invoice ID: {invoice.id}
                    </p>
                    <p className="invoice-date">
                        Date: {formatDate(invoice.createdAt)}
                    </p>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th className="text-right">Quantity</th>
                            <th className="text-right">Price</th>
                            <th className="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td className="text-right">{item.quantity}</td>
                                <td className="text-right">${item.price.toFixed(2)}</td>
                                <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-summary">
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>

                    {invoice.discount > 0 && (
                        <>
                            <div className="summary-row discount">
                                <span>Discount ({invoice.discount}%):</span>
                                <span>-${invoice.discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>After Discount:</span>
                                <span>${(invoice.subtotal - invoice.discountAmount).toFixed(2)}</span>
                            </div>
                        </>
                    )}

                    <div className="summary-row tax">
                        <span>Tax ({invoice.taxRate}%):</span>
                        <span>+${invoice.taxAmount.toFixed(2)}</span>
                    </div>

                    <div className="summary-row total">
                        <span>TOTAL:</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceDisplay;
