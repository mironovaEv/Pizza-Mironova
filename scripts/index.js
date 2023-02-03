function updateBasketSize() {
  const basket = JSON.parse(localStorage.getItem('basket')) ?? [];
  let basketSize = 0;
  for (const element of basket) {
    basketSize += Number(element.count);
  }
  if (basketSize > 0) {
    $('#create-order-link').text('Оформить заказ (' + basketSize + ')');
  } else {
    $('#create-order-link').text('Оформить заказ');
  }
}
$(document).ready(function () {
  updateBasketSize();
});
