function updateBasketSize() {
  const basket = JSON.parse(localStorage.getItem('basket'));
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

async function loadBasket() {
  const basket = JSON.parse(localStorage.getItem('basket'));
  for (const pizza of basket) {
    const response = await fetch('https://shift-winter-2023-backend.onrender.com/api/pizza/' + pizza.id);
    const pizzaInfo = await response.json();
    const template = $('#basket-item-template');
    const block = template.clone();
    block.find('.pizza-item-name').text(pizzaInfo.name);
    block.find('.pizza-item-img').attr('src', pizzaInfo.img);
    block.find('.pizza-item-price').text(pizzaInfo.price.default + ' ₽');
    block.find('.pizza-items-count').attr('pizza-id', pizzaInfo.id);
    block.find('.pizza-items-count').val(pizza.count);
    block.attr('pizza-id', pizzaInfo.id);
    block.removeClass('d-none');
    $('#pizza-items').append(block);
  }
}

function deletePizzaItem(id) {
  const basket = JSON.parse(localStorage.getItem('basket'));
  const element = basket.find((x) => x.id == id);
  const index = basket.indexOf(element);
  if (index >= 0) {
    basket.splice(index, 1);
  }
  localStorage.setItem('basket', JSON.stringify(basket));
  updateBasketSize();
}

function updateBasketSum(id, count) {
  const basket = JSON.parse(localStorage.getItem('basket'));
  basket.find((x) => x.id == id).count = count;
  localStorage.setItem('basket', JSON.stringify(basket));
}

$(document).ready(function () {
  loadBasket();
  updateBasketSize();
  $('body').on('click', '.plus', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id');
    const count = $(this).parents('.number-input').find('.pizza-items-count').val();
    $(this)
      .parents('.number-input')
      .find('.pizza-items-count')
      .val(Number(count) + 1);
    updateBasketSum(id, Number(count) + 1);
    updateBasketSize();
  });
  $('body').on('click', '.minus', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id');
    const count = $(this).parents('.number-input').find('.pizza-items-count').val();
    if (count > 1) {
      $(this)
        .parents('.number-input')
        .find('.pizza-items-count')
        .val(Number(count) - 1);
      updateBasketSum(id, Number(count) - 1);
      updateBasketSize();
    }
  });
  $('body').on('click', '.delete-button', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id');
    deletePizzaItem(id);
    $(this).parents('#basket-item-template').remove();
  });
  $('body').on('change', '.pizza-items-count', function () {
    updateBasketSize();
  });
});
