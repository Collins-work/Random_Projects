import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceDisplay from './components/InvoiceDisplay';

function App() {
    const [invoice, setInvoice] = useState(null);

    return (
        <div className="app">
            <header className="app-header">
                <h1>🧾 BillCraft</h1>
                <p>From items to totals — billing made simple.</p>
            </header>

            <div className={`app-content ${invoice ? 'has-invoice' : ''}`}>
                <InvoiceForm onInvoiceGenerated={setInvoice} invoice={invoice} />
                <InvoiceDisplay invoice={invoice} />
            </div>
        </div>
    );
}

export default App;
