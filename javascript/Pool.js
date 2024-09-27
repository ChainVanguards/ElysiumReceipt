let transactionPollingInterval;

async function connectPetraWallet() {
    if (typeof window.aptos === 'undefined') {
        alert("Please install the Petra wallet extension to continue.");
        window.open('https://petra.app/', '_blank');
        return;
    }

    try {
        const response = await window.aptos.connect();
        const account = await window.aptos.account();
        console.log("Connected account:", account.address);

        return account.address;

    } catch (error) {
        console.error("Error connecting to Petra wallet:", error);
        return null;
    }
}

async function isCoinStoreRegistered(address) {
    try {
        const response = await fetch(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`);
        return response.ok;
    } catch (error) {
        console.error("Error checking CoinStore registration:", error);
        return false;
    }
}

async function registerCoinStore() {
    const payload = {
        type: 'entry_function_payload',
        function: '0x1::managed_coin::register',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: []
    };

    try {

        const transaction = await window.aptos.signAndSubmitTransaction(payload);
        console.log("CoinStore for AptosCoin registered:", transaction);
    } catch (error) {
        console.error("Error registering CoinStore:", error);
    }
}

async function sendTransactionAndStartPolling() {
    const address = await connectPetraWallet();
    if (!address) return;

    const isRegistered = await isCoinStoreRegistered(address);
    if (!isRegistered) {
        await registerCoinStore();
    }

    const transaction = {
        arguments: ['0xb2033f3c854e54cb7cd1a2ee1f5bae39ec859b3734c071e4330208099204bb7b', '1000000'],
        function: '0x1::coin::transfer',
        type: 'entry_function_payload',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
    };

    try {
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('Transaction submitted, checking for confirmation...');
        transactionPollingInterval = setInterval(async () => {
            await checkTransactionStatus(pendingTransaction.hash, address);
        }, 5000);

    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

document.getElementById('invoice-payment').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('confirm_data').disabled = true;
        sendTransactionAndStartPolling();
    }
});