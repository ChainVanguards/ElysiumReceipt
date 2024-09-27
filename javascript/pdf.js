window.onload = function() {

    document.getElementById("download").disabled = true;


    function checkBothCheckboxes() {
        const isInvoicePaymentChecked = document.getElementById("invoice-payment").checked;
        const isConfirmDataChecked = document.getElementById("confirm_data").checked;


        if (isInvoicePaymentChecked && isConfirmDataChecked) {
            document.getElementById("download").disabled = false;
        } else {
            document.getElementById("download").disabled = true;
        }
    }

    document.getElementById("invoice-payment").addEventListener("change", checkBothCheckboxes);
    document.getElementById("confirm_data").addEventListener("change", checkBothCheckboxes);

    document.getElementById("download").addEventListener("click", () => {
        const invoice = document.getElementById("invoice");
        var opt = {
            margin: 1,
            filename: 'APTOS_invoice.pdf',
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            }
        };
        html2pdf().from(invoice).set(opt).save();
    });
}