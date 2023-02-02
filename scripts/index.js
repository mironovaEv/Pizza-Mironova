function updateBasketSize() {
  const basket = JSON.parse(localStorage.getItem('basket'));
  const basketSize = basket.length;
  if (basketSize > 0) {
    $('#create-order-link').text('Оформить заказ (' + basketSize + ')');
  } else {
    $('#create-order-link').text('Оформить заказ');
  }
}
$(document).ready(function () {
  updateBasketSize();
});
