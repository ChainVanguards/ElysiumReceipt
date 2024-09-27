let lastKnownBalance = null;
let balanceCheckInterval = null;
const receiverAddress = '0xb2033f3c854e54cb7cd1a2ee1f5bae39ec859b3734c071e4330208099204bb7b';

async function fetchBalance(address) {
    try {
        const response = await fetch(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resources`);
        const resources = await response.json();
        const coinType = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
        const coinResource = resources.find(resource => resource.type === coinType);
        return coinResource ? parseInt(coinResource.data.coin.value, 10) : 0;
    } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
    }
}

async function checkBalanceChange() {
    const currentBalance = await fetchBalance(receiverAddress);

    if (currentBalance !== null && lastKnownBalance !== null && currentBalance > lastKnownBalance) {
        console.log(`Balance increased: ${lastKnownBalance / 1000000} APT -> ${currentBalance / 1000000} APT`);
        document.getElementById('confirm_data').disabled = false;
        clearInterval(balanceCheckInterval);
    } else {
        console.log(`No change in balance detected. Current balance: ${currentBalance / 1000000} APT`);
    }

    lastKnownBalance = currentBalance;
}

async function startWatchingBalance() {
    console.log(`Initial balance: ${lastKnownBalance / 1000000} APT`);

    balanceCheckInterval = setInterval(checkBalanceChange, 5000);
}

async function sendTransactionAndStartWatching() {
    const address = await connectPetraWallet();
    if (!address) return;

    const isRegistered = await isCoinStoreRegistered(address);
    if (!isRegistered) await registerCoinStore();

    const transaction = {
        arguments: [receiverAddress, '1000000'],
        function: '0x1::coin::transfer',
        type: 'entry_function_payload',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
    };

    try {
        const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('Transaction submitted:', pendingTransaction);

        startWatchingBalance();

    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

window.addEventListener('load', async () => {
    const address = await connectPetraWallet();
    if (address) {
        document.getElementById('walletAddress').textContent = address;

        lastKnownBalance = await fetchBalance(receiverAddress);
        console.log(`Initial balance fetched on page load: ${lastKnownBalance / 1000000} APT`);
    }
});

document.getElementById('invoice-payment').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('confirm_data').disabled = true;
        sendTransactionAndStartWatching();
    }
});