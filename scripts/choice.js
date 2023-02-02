async function loadMenu (category) {
  $('#pizza-items-container').empty()
  const response = await fetch(
    'https://shift-winter-2023-backend.onrender.com/api/pizza?' + new URLSearchParams({ classifications: category })
  )
  const pizzas = await response.json()
  const template = $('#menu-item-template')
  for (const pizza of pizzas) {
    const block = template.clone()
    const ingredients = pizza.ingredients
    block.find('.pizza-name').text(pizza.name)
    block.find('.pizza-price').text(pizza.price.default + ' ₽')
    block.find('.pizza-img').attr('src', pizza.img)
    block.find('.pizza-ingredients').text(ingredients.join(', '))
    block.removeClass('d-none')
    $('#pizza-items-container').append(block)
  }
}
function deleteSelected () {
  const selectedElems = document.getElementsByClassName('selected')
  while (selectedElems.length) selectedElems[0].classList.remove('selected')
}

$(document).ready(function () {
  loadMenu()
  $('#new-button').click(function () {
    deleteSelected()
    $('#new-button').addClass('selected')
    loadMenu('new')
  })
  $('#spicy-button').click(function () {
    deleteSelected()
    $('#spicy-button').addClass('selected')
    loadMenu('spicy')
  })
  $('#vegetarian-button').click(function () {
    deleteSelected()
    $('#vegetarian-button').addClass('selected')
    loadMenu('vegetarian')
  })
  $('#recommend-button').click(function () {
    deleteSelected()
    $('#recommend-button').addClass('selected')
    loadMenu('')
  })
})
