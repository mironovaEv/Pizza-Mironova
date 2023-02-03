async function loadMenu(category) {
  $('#pizza-items-container').empty();
  const response = await fetch(
    'https://shift-winter-2023-backend.onrender.com/api/pizza?' + new URLSearchParams({ classifications: category }),
  );
  const pizzas = await response.json();
  const template = $('#menu-item-template');
  for (const pizza of pizzas) {
    const block = template.clone();
    const ingredients = pizza.ingredients;
    const basket = JSON.parse(localStorage.getItem('basket'));
    if (basket) {
      const element = basket.find((x) => x.id == pizza.id);
      if (element) {
        block.find('.add-to-basket-button').addClass('selected-pizza');
      }
    }
    block.find('.pizza-name').text(pizza.name);
    block.find('.pizza-price').text(pizza.price.default + ' ₽');
    block.find('.pizza-img').attr('src', pizza.img);
    block.find('.pizza-ingredients').text(ingredients.join(', '));
    block.attr('pizza-id', pizza.id);
    block.removeClass('d-none');
    $('#pizza-items-container').append(block);
  }
}
function deleteSelectedCategory() {
  const selectedElems = document.getElementsByClassName('selected-category');
  while (selectedElems.length) selectedElems[0].classList.remove('selected-category');
}

function addToBasket(id) {
  let basket = JSON.parse(localStorage.getItem('basket'));
  if (!basket) basket = [];
  basket.push({ id, count: 1, price: 0 });
  localStorage.setItem('basket', JSON.stringify(basket));
}
function deleteFromBasket(id) {
  const basket = JSON.parse(localStorage.getItem('basket'));
  const element = basket.find((x) => x.id === id);
  const index = basket.indexOf(element);
  if (index >= 0) {
    basket.splice(index, 1);
  }
  // console.log(basket);
  localStorage.setItem('basket', JSON.stringify(basket));
}
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

$(document).ready(function () {
  updateBasketSize();
  // localStorage.setItem('basket', null);
  loadMenu();
  $('#new-button').click(function () {
    deleteSelectedCategory();
    $('#new-button').addClass('selected-category');
    loadMenu('new');
  });
  $('#spicy-button').click(function () {
    deleteSelectedCategory();
    $('#spicy-button').addClass('selected-category');
    loadMenu('spicy');
  });
  $('#vegetarian-button').click(function () {
    deleteSelectedCategory();
    $('#vegetarian-button').addClass('selected-category');
    loadMenu('vegetarian');
  });
  $('#recommend-button').click(function () {
    deleteSelectedCategory();
    $('#recommend-button').addClass('selected-category');
    loadMenu('');
  });
  $('body').on('click', '.add-to-basket-button', function () {
    if ($(this).hasClass('selected-pizza')) {
      $(this).removeClass('selected-pizza');
      deleteFromBasket($(this).parents('#menu-item-template').attr('pizza-id'));
    } else {
      addToBasket($(this).parents('#menu-item-template').attr('pizza-id'));
      $(this).addClass('selected-pizza');
    }
    updateBasketSize();
  });
});
