async function getTransactionDetails() {
    const version = document.getElementById('versionInput').value;

    try {
        const response = await fetch(`https://fullnode.mainnet.aptoslabs.com/v1/transactions/by_version/${version}`);
        const txnData = await response.json();

        document.getElementById('invoice-number').textContent = version;
        document.getElementById('transaction-date').textContent = new Date(txnData.timestamp / 1000).toLocaleDateString();
        document.getElementById('invoice-date').textContent = new Date().toLocaleDateString();

        function formatAddress(address) {
            if (address.length > 28) {
                return address.slice(0, 14) + '***' + address.slice(-14);
            }
            return address;
        }

        document.getElementById('user-address').value = formatAddress(txnData.sender);
        document.getElementById('receiver-address').value = formatAddress(txnData.payload.arguments[0]);
        const transactionValueInAPT = (txnData.payload.arguments[1] / 10000000).toFixed(2);
        document.getElementById('transaction-value').textContent = transactionValueInAPT;
        document.getElementById('vm-status').textContent = txnData.vm_status;
        document.getElementById('state-change-hash').textContent = txnData.state_change_hash;
        document.getElementById('event-root-hash').textContent = txnData.event_root_hash;
        document.getElementById('accumulator-root-hash').textContent = txnData.accumulator_root_hash;

    } catch (error) {
        console.error("Error fetching transaction details:", error);
    }
}