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
    block.find('.pizza-item-price').text(Number(pizzaInfo.price.default) * pizza.count + ' ₽');
    block.find('.pizza-items-count').attr('pizza-id', pizzaInfo.id);
    block.find('.pizza-items-count').val(pizza.count);
    block.attr('pizza-id', pizzaInfo.id);
    block.removeClass('d-none');
    pizza.price = pizzaInfo.price.default;
    localStorage.setItem('basket', JSON.stringify(basket));
    const orderSum = Number($('#order-sum').text());
    const orderCount = Number($('#order-count').text());
    $('#order-sum').text(orderSum + Number(pizzaInfo.price.default) * pizza.count);
    $('#order-count').text(orderCount + pizza.count);
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

function updateItemSum(id, count) {
  const basket = JSON.parse(localStorage.getItem('basket'));
  const element = basket.find((x) => x.id == id);
  element.count = count;
  localStorage.setItem('basket', JSON.stringify(basket));
  return element.count * element.price;
}
function updateBasketSumAndCount() {
  const basket = JSON.parse(localStorage.getItem('basket'));
  let basketSum = 0;
  let basketCount = 0;
  for (const item of basket) {
    basketSum += Number(item.count) * Number(item.price);
    basketCount += Number(item.count);
  }
  return { sum: basketSum, count: basketCount };
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
    const newSum = updateItemSum(id, Number(count) + 1);
    $(this)
      .parents('#basket-item-template')
      .find('.pizza-item-price')
      .text(newSum + ' ₽');
    updateBasketSize();
    $('#order-sum').text(updateBasketSumAndCount().sum);
    $('#order-count').text(updateBasketSumAndCount().count);
  });
  $('body').on('click', '.minus', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id');
    const count = $(this).parents('.number-input').find('.pizza-items-count').val();
    if (count > 1) {
      $(this)
        .parents('.number-input')
        .find('.pizza-items-count')
        .val(Number(count) - 1);
      const newSum = updateItemSum(id, Number(count) - 1);
      $(this)
        .parents('#basket-item-template')
        .find('.pizza-item-price')
        .text(newSum + ' ₽');
      updateBasketSize();
      $('#order-sum').text(updateBasketSumAndCount().sum);
      $('#order-count').text(updateBasketSumAndCount().count);
    }
  });
  $('body').on('click', '.delete-button', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id');
    deletePizzaItem(id);
    $(this).parents('#basket-item-template').remove();
    $('#order-sum').text(updateBasketSumAndCount().sum);
    $('#order-count').text(updateBasketSumAndCount().count);
  });
  $('body').on('change', '.pizza-items-count', function () {
    updateBasketSize();
  });
});
