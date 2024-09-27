const currentDate = new Date();

const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById('invoice-date').textContent = formattedDate;

document.getElementById('user-address').value = userName;
document.getElementById('user-phone-number').value = userPhoneNumber;
document.getElementById('user-email').value = userEmail;


document.getElementById('receiver-name').value = receiverName;
document.getElementById('receiver-phone-number').value = receiverPhoneNumber;
document.getElementById('receiver-email').value = receiverEmail;

document.getElementById('work-type').value = workType;
document.getElementById('work-description').value = workDescription;