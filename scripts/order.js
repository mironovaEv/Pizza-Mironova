function updateBasketSize () {
  const basket = JSON.parse(localStorage.getItem('basket')) ?? []
  let basketSize = 0
  for (const element of basket) {
    basketSize += Number(element.count)
  }

  if (basketSize > 0) {
    $('#create-order-link').text('Оформить заказ (' + basketSize + ')')
  } else {
    $('#create-order-link').text('Оформить заказ')
  }
}

async function loadBasket () {
  const basket = JSON.parse(localStorage.getItem('basket')) ?? []
  for (const pizza of basket) {
    const response = await fetch('https://shift-winter-2023-backend.onrender.com/api/pizza/' + pizza.id)
    const pizzaInfo = await response.json()
    const template = $('#basket-item-template')
    const block = template.clone()
    block.find('.pizza-item-name').text(pizzaInfo.name)
    block.find('.pizza-item-img').attr('src', pizzaInfo.img)
    block.find('.pizza-item-price').text(Number(pizzaInfo.price.default) * pizza.count + ' ₽')
    block.find('.pizza-items-count').attr('pizza-id', pizzaInfo.id)
    block.find('.pizza-items-count').val(pizza.count)
    block.attr('pizza-id', pizzaInfo.id)
    block.removeClass('d-none')
    pizza.price = pizzaInfo.price.default
    localStorage.setItem('basket', JSON.stringify(basket))
    const orderSum = Number($('#order-sum').text())
    const orderCount = Number($('#order-count').text())
    $('#order-sum').text(orderSum + Number(pizzaInfo.price.default) * pizza.count)
    $('#order-count').text(orderCount + pizza.count)
    $('#pizza-items').append(block)
  }
}

function deletePizzaItem (id) {
  const basket = JSON.parse(localStorage.getItem('basket'))
  const element = basket.find((x) => x.id == id)
  const index = basket.indexOf(element)
  if (index >= 0) {
    basket.splice(index, 1)
  }
  localStorage.setItem('basket', JSON.stringify(basket))
  updateBasketSize()
}

function updateItemSum (id, count) {
  const basket = JSON.parse(localStorage.getItem('basket'))
  const element = basket.find((x) => x.id == id)
  element.count = count
  localStorage.setItem('basket', JSON.stringify(basket))
  return element.count * element.price
}
function updateBasketSumAndCount () {
  const basket = JSON.parse(localStorage.getItem('basket'))
  let basketSum = 0
  let basketCount = 0
  for (const item of basket) {
    basketSum += Number(item.count) * Number(item.price)
    basketCount += Number(item.count)
  }
  return { sum: basketSum, count: basketCount }
}
function showResult () {
  $('.number-input').addClass('d-none')
  $('.delete-button').addClass('d-none')
  $('.form').addClass('d-none')
  $('.form-title').addClass('d-none')
  $('.create-order-button').addClass('d-none')
  $('.result-container').removeClass('d-none')
  $('.item-count-result').removeClass('d-none')
  const basket = JSON.parse(localStorage.getItem('basket')) ?? []
  for (const item of basket) {
    $('[pizza-id="' + item.id + '"]')
      .find('.item-count-result')
      .text(item.count + ' шт.')
  }
  localStorage.setItem('basket', null)
}
function checkLength (min, max, field) {
  if (field.length < min) {
    return 'Минимальное количество символов: ' + min
  }
  if (field.length > max) {
    return 'Максимальное количество символов: ' + max
  } else {
    return ''
  }
}

function showError (field, message) {
  $('[name="' + field.name + '"]').css('border', '1px red solid')
  $('.' + field.name + '-valid-feedback').text(message)
  $('.' + field.name + '-valid-feedback').css('color', 'red')
}
function showOk (field) {
  $('[name="' + field.name + '"]').css('border', '1px green solid')
  $('.' + field.name + '-valid-feedback').text('')
}
function validate (array) {
  let flag = true
  for (const field of array) {
    if (checkLength(field.min, field.max, field.value) != '') {
      showError(field, checkLength(field.min, field.max, field.value))
      flag = false
    } else {
      showOk(field)
    }
  }
  return flag
}
function checkBirthDate (birthDate) {
  const today = new Date().toISOString()
  const datePlus18 = new Date(birthDate)
  datePlus18.setFullYear(datePlus18.getFullYear() + 18)
  if (birthDate == '') {
    $('#inputBirthDate').css('border', 'red 1px solid')
    $('.birthDate-valid-feedback').text('Пожалуйста, укажите дату рождения.')
    $('.birthDate-valid-feedback').css('color', 'red')
    return false
  } else if (Number(birthDate.substr(0, 4)) < 1900 || new Date(birthDate + 'T00:00:00.000Z') > new Date(today)) {
    $('#inputBirthDate').css('border', 'red 1px solid')
    $('.birthDate-valid-feedback').text('Введена некорректная дата.')
    $('.birthDate-valid-feedback').css('color', 'red')
    return false
  } else if (datePlus18 > new Date()) {
    $('#inputBirthDate').css('border', 'red 1px solid')
    $('.birthDate-valid-feedback').text('Получателю должно быть больше 18 лет.')
    $('.birthDate-valid-feedback').css('color', 'red')
    return false
  } else {
    $('.birthDate-valid-feedback').text('')
    $('#inputBirthDate').css('border', 'green 1px solid')
    return true
  }
}
function checkEmptyBasket () {
  const basket = JSON.parse(localStorage.getItem('basket')) ?? []
  if (basket.length < 1) {
    $('.submit-feedback').text('Ваша корзина пуста.')
    $('.submit-feedback').css('color', 'red')
    return false
  } else {
    $('.submit-feedback').text('')
    return true
  }
}

async function createOrder () {
  const firstname = $('#inputFirstname').val().trim()
  const lastname = $('#inputLastname').val().trim()
  const city = $('#inputCity').val().trim()
  const street = $('#inputStreet').val().trim()
  const house = $('#inputHouse').val().trim()
  const birthDate = $('#inputBirthDate').val()
  let apartment = $('#inputApartment').val().trim()
  let checkApartment = false
  if ($('#apartmentCheck').prop('checked')) {
    checkApartment = true
    apartment = ''
    showOk({ min: 1, max: 10, value: apartment, name: 'apartment' })
  } else {
    checkApartment = validate([{ min: 1, max: 10, value: apartment, name: 'apartment' }])
  }
  const checkDate = !!checkBirthDate(birthDate)
  const checkBasket = !!checkEmptyBasket()
  if (
    validate([
      { min: 2, max: 30, value: firstname, name: 'firstname' },
      { min: 2, max: 30, value: lastname, name: 'lastname' },
      { min: 2, max: 50, value: city, name: 'city' },
      { min: 2, max: 60, value: street, name: 'street' },
      { min: 1, max: 10, value: house, name: 'house' }
    ]) &&
    checkApartment &&
    checkDate &&
    checkBasket
  ) {
    const basket = JSON.parse(localStorage.getItem('basket')) ?? []
    const pizzas = []
    for (const element of basket) {
      for (let i = 0; i < element.count; i++) {
        const pizza = new Object({ id: Number(element.id), size: 'small', crust: '' })
        pizzas.push(pizza)
      }
    }
    if ($('#apartmentCheck').checked) apartment = ''
    const comment = $('#inputComment').val()
    const registrationAddress = JSON.stringify({ city, street, house, apartment })
    const data = {
      pizzas,
      details: {
        user: {
          firstname,
          lastName: lastname,
          birthDate,
          registrationAddress
        },
        address: {
          city,
          street,
          house,
          apartment,
          comment
        }
      }
    }
    const url = 'https://shift-winter-2023-backend.onrender.com/api/pizza/createOrder'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      showResult()
    }
  }
}

$(document).ready(function () {
  loadBasket()
  updateBasketSize()
  $('body').on('click', '.plus', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id')
    const count = $(this).parents('.number-input').find('.pizza-items-count').val()
    $(this)
      .parents('.number-input')
      .find('.pizza-items-count')
      .val(Number(count) + 1)
    const newSum = updateItemSum(id, Number(count) + 1)
    $(this)
      .parents('#basket-item-template')
      .find('.pizza-item-price')
      .text(newSum + ' ₽')
    updateBasketSize()
    $('#order-sum').text(updateBasketSumAndCount().sum)
    $('#order-count').text(updateBasketSumAndCount().count)
  })
  $('body').on('click', '.minus', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id')
    const count = $(this).parents('.number-input').find('.pizza-items-count').val()
    if (count > 1) {
      $(this)
        .parents('.number-input')
        .find('.pizza-items-count')
        .val(Number(count) - 1)
      const newSum = updateItemSum(id, Number(count) - 1)
      $(this)
        .parents('#basket-item-template')
        .find('.pizza-item-price')
        .text(newSum + ' ₽')
      updateBasketSize()
      $('#order-sum').text(updateBasketSumAndCount().sum)
      $('#order-count').text(updateBasketSumAndCount().count)
    }
  })
  $('body').on('click', '.delete-button', function () {
    const id = $(this).parents('#basket-item-template').attr('pizza-id')
    deletePizzaItem(id)
    $(this).parents('#basket-item-template').remove()
    $('#order-sum').text(updateBasketSumAndCount().sum)
    $('#order-count').text(updateBasketSumAndCount().count)
  })
  $('body').on('change', '.pizza-items-count', function () {
    let count = $(this).val()
    if (count < 1) {
      $(this).val(1)
      count = 1
    }

    const id = $(this).parents('#basket-item-template').attr('pizza-id')
    const newSum = updateItemSum(id, Number(count))
    $(this)
      .parents('#basket-item-template')
      .find('.pizza-item-price')
      .text(newSum + ' ₽')
    $('#order-sum').text(updateBasketSumAndCount().sum)
    $('#order-count').text(updateBasketSumAndCount().count)
    updateBasketSize()
  })
  $('.create-order-button').click(function () {
    createOrder()
  })
})
