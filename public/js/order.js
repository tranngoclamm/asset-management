function handleTransaction() {
    var numberTrElements = document.getElementsByClassName('number_tr');
    // Tạo một mảng để lưu trữ các giá trị 'data-value'
    var dataValues = [];
// Lặp qua từng phần tử và lấy giá trị 'data-value'
    for (var i = 0; i < numberTrElements.length; i++) {
    var dataValue = numberTrElements[i].getAttribute('data-value');
    dataValues.push(dataValue);
}
    console.log(dataValues)
    let amount = document.getElementById('total-cart').dataset.value;
    console.log(amount)
    let orderId = Math.floor(Math.random() * 1000000);
    let bankCode = "VNBANK";
    let language = "vn";
    axios.post("/order", { amount, orderId, bankCode, language, dataValues })
        .then(response => {
            let url = response.data;
            window.open(url);
        })
        .catch(error => {
            console.error(error);
        });
}