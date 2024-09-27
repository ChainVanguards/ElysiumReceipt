module MyPlatform::Confirmations {
    use aptos_framework::aptos_account;
    use aptos_framework::signer;

    // Define the struct with resource behavior
    struct Confirmation has key {
        confirmed: bool,
    }

    // Entry function to confirm the transaction
    public entry fun confirm_transaction(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<Confirmation>(addr)) {
            move_to(account, Confirmation { confirmed: true });
        } else {
            abort 1; // Already confirmed
        }
    }

    // Check if the address has confirmed
    public fun is_confirmed(addr: address): bool {
        exists<Confirmation>(addr)
    }
}
