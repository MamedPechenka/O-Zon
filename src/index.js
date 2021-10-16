'use strict';
const container = document.querySelector('.goods')
const containercart = document.querySelector('.cart').querySelector('.goods')
const cartRef = document.querySelector('#cart')
let productsInfoCached = []
let currentProducts = []
let categories = []
loadProductsInfo()
async function loadProductsInfo() {
    await fetch('http://localhost/O-Zon/server/server.php')
            .then(response => response.json())
            .then(data => productsInfoCached = data)
            .then(() => currentProducts = Array.from(productsInfoCached))
            .then(() => { 
                productsInfoCached.forEach(value => {
                    console.dir(value.category)
                    if (!categories.includes(value.category))
                        categories.push(value.category)
                })
            })
            .catch(error => { throw new Error('Данные с сервера не были загружены. ' + error) })

    initFilter()
    initSearch()
    initCart()  
    setProducts(productsInfoCached)
    PutInCart()
}
function setProducts(goodsInfoArray) {
    goodsInfoArray.forEach(element => {
        container.innerHTML+=
                `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card">
                    `+(element.sale == true? `<div class="card-sale">🔥Hot sales!🔥</div>`: '')+`
                    <div class="card-img-wrapper">
                        <span class="card-img-top" style="background-image: url('`+element.img+`')"></span>
                    </div>
                    <div class="card-body justify-content-between">
                        <div class="card-price">`+element.price+` ₽</div>
                        <h5 class="card-title">`+element.title+`</h5>
                        <button class="btn btn-primary" onclick = 'PutInCart(this)' value = '${element.id}'>В корзину</button>
                    </div>
                </div>
            </div>`
    });
   
}
function clearProducts() {
    container.innerHTML = ''
}
const pricecart = document.querySelector('.cart-total').querySelector('span')
function sumPrice()
{
    let sum = 0
    for (const key in localStorage) {
        if (key.includes("goodsID")) {
            let number = +key.match(/\d+/)
            var goods = productsInfoCached.find(el=>{
                   return el.id == number
            })
            console.log(productsInfoCached.find(goods=> goods.id == number).price)
            sum += +(productsInfoCached.find(goods=> goods.id == number).price)
        }
            
    }
    return sum
}
function PutInCart(button){
    addProductsToCart(button.value)
    cartCount.textContent = getCountOfProducts()
    let goods = productsInfoCached.find(el=>{
        return el.id == button.value})
        pricecart.textContent = sumPrice()
        containercart.innerHTML +=
                `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card">
                    `+(goods.sale == true? `<div class="card-sale">🔥Hot sales!🔥</div>`: '')+`
                    <div class="card-img-wrapper">
                        <span class="card-img-top" style="background-image: url('`+goods.img+`')"></span>
                    </div>
                    <div class="card-body justify-content-between">
                        <div class="card-price">`+goods.price+` ₽</div>
                        <h5 class="card-title">`+goods.title+`</h5>
                        <button style="background-color: red;"class="kakdela" onclick = 'deleteCart(this)' value = '${goods.id}'>Удалить товар</button>
                    </div>
                </div>
            </div>`
}



const categoryButton = document.querySelector('.catalog-button').querySelector('button')
const catalogWrapperElement = document.querySelector('.catalog')
const catalogElement = catalogWrapperElement.querySelector('.catalog-list')
const minCostElement = document.querySelector('#min')
const maxCostElement = document.querySelector('#max')
const saleCheckboxElement = document.querySelector('#is-goods-sale')
let currentCategory = 'Категория не выбрана'
async function initFilter() {
    categoryButton.onclick = () => catalogWrapperElement.style.display = catalogWrapperElement.style.display == 'none' ? 'block' : 'none'
    categories.push('Категория не выбрана')
    categories.forEach(category => {
        console.log(category)
        let listElement = document.createElement('li')
        listElement.textContent = category
        listElement.onclick = (element) => {
            currentCategory = category
            onFilterTextChanged()
        }
        catalogElement.append(listElement)
    })
    
    minCostElement.oninput = onFilterTextChanged
    maxCostElement.oninput = onFilterTextChanged
    saleCheckboxElement.onchange = onFilterTextChanged
}
function onFilterTextChanged() {
    clearProducts()
    let prod = currentProducts
    console.dir(currentProducts)
    if (saleCheckboxElement.checked) {
    prod  = prod.filter(value => !saleCheckboxElement.checked || saleCheckboxElement.checked && value.sale == true)
    }
    if (!(currentCategory == 'Категория не выбрана')) {
        prod  = prod.filter(value => currentCategory == 'Категория не выбрана' || value.category == currentCategory)
    }
    if (maxCostElement.value || minCostElement.value) {
        prod  = prod.filter(value => !maxCostElement.value && !minCostElement.value ||
            parseInt(minCostElement.value) < parseInt(value.price) && !maxCostElement.value ||
            parseInt(maxCostElement.value) > parseInt(value.price) && !minCostElement.value ||
            parseInt(minCostElement.value) < parseInt(value.price) && parseInt(maxCostElement.value) > parseInt(value.price))
    }
    setProducts(prod)
}
const searchTextElement = document.querySelector('.search-wrapper_input')
const searchButtonElement = document.querySelector('.search-btn').querySelector('button')
async function initSearch() {
    searchButtonElement.onclick = onSearchClick
}                   
function onSearchClick() {
    currentProducts = productsInfoCached.filter(value => value.title.trim().toLowerCase().includes(searchTextElement.value.toLowerCase().trim()))
    onFilterTextChanged()
}
const cart = document.querySelector('.cart')
const cartCount = cartRef.querySelector('.counter')
 function initCart() {
    pricecart.textContent = sumPrice()
    cartRef.onclick = () => cart.style.display = cart.style.display = 'none' ? 'block' : 'none'
    for (const key in localStorage) {
            if (key.includes("goodsID")) {
                let number = +key.match(/\d+/)
                var goods = productsInfoCached.find(el=>{
                       return el.id == number
                })
                if (getCountOfProducts() == 0) {
                    containercart.innerHTML+= `<div id="cart-empty">
					В данный момент корзина пуста
				</div>`
                }
                console.dir(getCountOfProducts())
                containercart.innerHTML += ''
                containercart.innerHTML +=
                `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card">
                    `+(goods.sale == true? `<div class="card-sale">🔥Hot sales!🔥</div>`: '')+`
                    <div class="card-img-wrapper">
                        <span class="card-img-top" style="background-image: url('`+goods.img+`')"></span>
                    </div>
                    <div class="card-body justify-content-between">
                        <div class="card-price">`+goods.price+` ₽</div>
                        <h5 class="card-title">`+goods.title+`</h5>
                        <button style="background-color: red;"class="kakdela" onclick = 'deleteCart(this)' value = '${goods.id}'>Удалить товар</button>
                    </div>
                </div>
            </div>`
            }
        }
        
    cartCount.textContent = getCountOfProducts()
}
const deletecart = document.querySelector(".btn-deletecart")

function deleteCart(btn)
{
    decrementProductsFromCart(btn.value)
    cartCount.textContent = getCountOfProducts()
    pricecart.textContent = sumPrice()
   containercart.removeChild( btn.parentElement.parentElement.parentElement)
}

function addProductsToCart(goodsID) {
        try {
            let count = localStorage.getItem(`goodsID:${goodsID}`)
        localStorage.setItem(`goodsID:${goodsID}`, ++count);
        } catch (error) {
             if (error == QUOTA_EXCEEDED_ERR) {
            alert('Лимит превышен')
        }
    }; 
}
function decrementProductsFromCart(goodsID) {

    // let count = localStorage.getItem(`goodsID:${goodsID}`)
    // if (count == null)
    //     return
    // if (count == 1)
        localStorage.removeItem(`goodsID:${goodsID}`)
    // else
    //     localStorage.setItem(`goodsID:${goodsID}`, --count)        
}
function getCountOfProducts() {
    let countOfProducts = 0;
    for (const key in localStorage) 
        if (key.includes('goodsID'))
        {
            countOfProducts += parseInt(localStorage[key])
        }
    return countOfProducts
}
const cartclose = document.querySelector('.cart-close')
cartClose()
function cartClose()
{   
    cartclose.onclick = () => cart.style.display = 'none'
}
function reDrawCart()
{
            containercart.innerHTML +=
            `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card">
                `+(goods.sale == true? `<div class="card-sale">🔥Hot sales!🔥</div>`: '')+`
                <div class="card-img-wrapper">
                    <span class="card-img-top" style="background-image: url('`+goods.img+`')"></span>
                </div>
                <div class="card-body justify-content-between">
                    <div class="card-price">`+goods.price+` ₽</div>
                    <h5 class="card-title">`+goods.title+`</h5>
                    <button style="background-color: red;"class="btn-deletecart" onclick = 'deleteCart(this)' value = '${goods.id}'>Удалить товар</button>
                </div>
            </div>
        </div>`
}