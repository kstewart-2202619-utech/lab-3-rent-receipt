// Name: Krystal Stewart
// ID: 2202619 //
// Lab 3 : Rent Receipt Generator //

// ============================
// RECEIPT HISTORY ARRAY
// ============================
let receiptHistory = [];

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', function() {

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;
    document.getElementById('paymentDate').value = today;

    // Load history from localStorage
    loadHistoryFromStorage();

    // Display on page load
    displayHistory();
});

// ============================
// LOCAL STORAGE FUNCTIONS
// ============================

function loadHistoryFromStorage() {
    const storedHistory = localStorage.getItem('receiptHistory');
    receiptHistory = storedHistory ? JSON.parse(storedHistory) : [];
}

function saveHistoryToStorage() {
    localStorage.setItem('receiptHistory', JSON.stringify(receiptHistory));
}

// ============================
// ADD RECEIPT TO HISTORY
// ============================
function addToHistory(formData) {

    const receipt = {
        id: Date.now(),
        receiptNumber: formData.receiptNumber,
        receiptDate: formData.receiptDate,
        tenantName: formData.tenantName,
        landlordName: formData.landlordName,
        propertyAddress: formData.propertyAddress,
        rentPeriod: formData.rentPeriod,
        rentAmount: formData.rentAmount,
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        transactionRef: formData.transactionRef,
        notes: formData.notes,
        signature: formData.signature,
        createdAt: new Date().toISOString()
    };

    // Add newest receipt to top
    receiptHistory.unshift(receipt);

    // Save to local storage
    saveHistoryToStorage();

    // Refresh history list
    displayHistory();
}

// ============================
// DELETE ONE RECEIPT
// ============================
function deleteReceipt(id) {
    receiptHistory = receiptHistory.filter(r => r.id !== id);

    saveHistoryToStorage();
    displayHistory();

    alert("Receipt deleted successfully.");
}

// ============================
// DELETE ALL RECEIPTS
// ============================
function deleteAllReceipts() {
    if (!confirm("Are you sure you want to delete ALL receipts?")) return;

    receiptHistory = [];
    localStorage.removeItem('receiptHistory');

    displayHistory();
    alert("All receipts deleted.");
}

// ============================
// LOAD RECEIPT INTO VIEWER
// ============================
function loadReceipt(id) {
    const receipt = receiptHistory.find(r => r.id === id);
    if (!receipt) return alert("Receipt not found.");

    updateReceipt(receipt);

    document.getElementById("receiptSection").classList.add("active");
    document.getElementById("receiptSection").scrollIntoView({ behavior: "smooth" });
}

// ============================
// DISPLAY HISTORY
// ============================
function displayHistory() {
    const historyList = document.getElementById('historyList');

    if (receiptHistory.length === 0) {
        historyList.innerHTML = `
            <p class="no-history">No receipts yet. Generate your first receipt!</p>
        `;
        return;
    }

    historyList.innerHTML = receiptHistory.map(receipt => `
        <div class="history-item">
            <div>
                <h4>Receipt #${receipt.receiptNumber}</h4>
                <p><strong>Tenant:</strong> ${receipt.tenantName}</p>
                <p><strong>Amount:</strong> JMD $${receipt.rentAmount.toLocaleString()}</p>
                <p><strong>Date:</strong> ${formatDate(receipt.receiptDate)}</p>
            </div>

            <div class="history-actions">
                <button onclick="loadReceipt(${receipt.id})" class="btn-view">
                    <span class="material-icons">visibility</span>
                    View
                </button>

                <button onclick="deleteReceipt(${receipt.id})" class="btn-delete">
                    <span class="material-icons">delete</span>
                    Delete
                </button>
            </div>
        </div>
    `).join("");
}

// ============================
// FORM SUBMIT (SAVES TO HISTORY)
// ============================
document.getElementById('receiptForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        receiptNumber: document.getElementById('receiptNumber').value,
        receiptDate: document.getElementById('receiptDate').value,
        tenantName: document.getElementById('tenantName').value,
        landlordName: document.getElementById('landlordName').value,
        propertyAddress: document.getElementById('propertyAddress').value,
        rentPeriod: document.getElementById('rentPeriod').value,
        rentAmount: parseFloat(document.getElementById('rentAmount').value),
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentDate: document.getElementById('paymentDate').value,
        transactionRef: document.getElementById('transactionRef').value,
        notes: document.getElementById('notes').value,
        signature: document.getElementById('signature').value
    };

    // Update receipt preview
    updateReceipt(formData);

    // Save to history
    addToHistory(formData);

    // Show preview
    document.getElementById('receiptSection').classList.add('active');
});

// ============================
// GENERATE RECEIPT BUTTON FUNCTION
// ============================
function generateReceipt() {
    alert('Generate Receipt button clicked');

    // Trigger the same behavior as form submit (generate preview)
    document.getElementById('receiptForm').requestSubmit();
}

// ============================
// UPDATE RECEIPT DISPLAY
// ============================
function updateReceipt(formData) {

    document.getElementById('displayReceiptNumber').textContent =
        `Receipt #: ${formData.receiptNumber}`;

    document.getElementById('displayReceiptDate').textContent =
        `Date: ${formatDate(formData.receiptDate)}`;

    document.getElementById('displayTenantName').textContent = formData.tenantName;
    document.getElementById('displayPropertyAddress').textContent = formData.propertyAddress;
    document.getElementById('displayRentPeriod').textContent = formData.rentPeriod;
    document.getElementById('displayPaymentMethod').textContent = formData.paymentMethod;
    document.getElementById('displayPaymentDate').textContent = formatDate(formData.paymentDate);

    document.getElementById('displayRentAmount').textContent =
        `JMD $${formData.rentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    document.getElementById('displaySignature').textContent =
        formData.signature || "Digital/Typed Signature";

    // Optional fields
    if (formData.transactionRef) {
        document.getElementById('transactionRow').style.display = 'grid';
        document.getElementById('displayTransactionRef').textContent = formData.transactionRef;
    } else {
        document.getElementById('transactionRow').style.display = 'none';
    }

    if (formData.notes) {
        document.getElementById('notesRow').style.display = 'grid';
        document.getElementById('displayNotes').textContent = formData.notes;
    } else {
        document.getElementById('notesRow').style.display = 'none';
    }
}

// ============================
// RESET FORM BUTTON
// ============================
document.querySelector('button[type="reset"]').addEventListener('click', function() {
    alert('Clear Form');

    document.getElementById('receiptSection').classList.remove('active');

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;
    document.getElementById('paymentDate').value = today;
});

// ============================
// DATE FORMATTER
// ============================
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================
// PRINT RECEIPT
// ============================
function printReceipt() {
    alert('Print Receipt button clicked');
    window.print();
}

// ============================
// END OF SCRIPT
// ============================