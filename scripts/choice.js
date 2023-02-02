$(document).ready(function () {
  LoadMenu();
});

function LoadMenu() {
  $('#pizza-items-container').empty();
  fetch('https://shift-winter-2023-backend.onrender.com/api/pizza')
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const template = $('#menu-item-template');
      const pizzas = JSON.stringify(json);
      for (const pizza of JSON.parse(pizzas)) {
        const block = template.clone();
        const ingredients = pizza.ingredients;
        block.find('.pizza-name').text(pizza.name);
        block.find('.pizza-price').text(pizza.price.default + ' ₽');
        block.find('.pizza-img').attr('src', pizza.img);
        block.removeClass('d-none');
        $('#pizza-items-container').append(block);
      }
    });
}
