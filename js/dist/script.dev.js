"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("promoVideo");
  var playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", function () {
    video.play().then(function () {
      playBtn.classList.add("hidden");
    })["catch"](function (err) {
      console.log("Ошибка воспроизведения:", err);
    });
  });
  video.addEventListener("click", function () {
    if (video.paused) {
      video.play().then(function () {
        playBtn.classList.add("hidden");
      })["catch"](function (err) {
        console.log("Ошибка воспроизведения:", err);
      });
    } else {
      video.pause();
      playBtn.classList.remove("hidden");
    }
  });
}); /////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  var categoryButtons = document.querySelectorAll(".menu__buttons .menu-button");
  var cards = document.querySelectorAll(".menu__cards-card");
  var originalData = Array.from(cards).map(function (card) {
    return {
      title: card.querySelector(".card__title").textContent,
      desc: card.querySelector("p").textContent,
      imgSrc: card.querySelector("img").getAttribute("src"),
      basePrice: 8.35
    };
  });
  var categoryData = {
    "Meat": {
      title: "Meat Feast",
      desc: "Fillings: Pepperoni, ham, sausage, ground beef, bacon, cheese, tomato sauce.",
      imgSrc: "./images/meatpizza.png",
      basePrice: 12.50
    },
    "Vegetarian": {
      title: "Veggie Delight",
      desc: "Fillings: Bell peppers, mushrooms, onions, olives, tomatoes, spinach, cheese.",
      imgSrc: "./images/vegetarianpizza.png",
      basePrice: 10.75
    },
    "Sea products": {
      title: "Seafood Supreme",
      desc: "Fillings: Shrimp, calamari, mussels, tuna, garlic, cheese, tomato sauce.",
      imgSrc: "./images/seapizza.png",
      basePrice: 15.25
    },
    "Mushroom": {
      title: "Mushroom Magic",
      desc: "Fillings: Portobello, shiitake, button mushrooms, garlic, herbs, cheese.",
      imgSrc: "./images/mushroompizza.png",
      basePrice: 9.90
    }
  };
  var modal = document.getElementById('#orderModal');
  var backButton = document.getElementById('#back-button');

  function resetAllPizzas() {
    cards.forEach(function (card, index) {
      card.querySelector(".card__title").textContent = originalData[index].title;
      card.querySelector("p").textContent = originalData[index].desc;
      card.querySelector("img").setAttribute("src", originalData[index].imgSrc);
      initCardControls(card, originalData[index].basePrice);
    });
  }

  function initCardControls(card, basePrice) {
    var priceEl = card.querySelector(".price span:first-child");
    var minusBtn = card.querySelector(".amount button:nth-child(1)");
    var plusBtn = card.querySelector(".amount button:nth-child(3)");
    var amountEl = card.querySelector(".amount span");
    var sizeButtons = card.querySelectorAll(".sizes .card-button");
    var orderNowBtn = card.querySelector(".passive-button");
    var count = 1;
    var currentBasePrice = basePrice;
    var selectedSize = "28";
    var newMinusBtn = minusBtn.cloneNode(true);
    var newPlusBtn = plusBtn.cloneNode(true);
    minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
    plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);

    var updatePrice = function updatePrice() {
      var finalPrice = (currentBasePrice * count).toFixed(2).replace(".", ",");
      amountEl.textContent = count;
      priceEl.textContent = finalPrice;
    };

    var updateSizePrice = function updateSizePrice(size) {
      var sizeMultiplier = 1;

      switch (size) {
        case "22":
          sizeMultiplier = 0.8;
          break;

        case "28":
          sizeMultiplier = 1;
          break;

        case "33":
          sizeMultiplier = 1.4;
          break;
      }

      currentBasePrice = basePrice * sizeMultiplier;
      updatePrice();
    };

    sizeButtons.forEach(function (button) {
      var newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      newButton.addEventListener("click", function () {
        sizeButtons.forEach(function (btn) {
          return btn.classList.remove("active");
        });
        newButton.classList.add("active");
        selectedSize = newButton.textContent;
        updateSizePrice(selectedSize);
      });
    });
    orderNowBtn.addEventListener("click", function () {
      var pizzaName = card.getElementsByClassName('.card__title').textContent;
      var pizzaSize = card.getElementsByClassName('.sizes .card-button.active').textContent;
      var pizzaQuantity = card.getElementsByClassName('.amount span').textContent;
      var pizzaPrice = card.getElementsByClassName('.price span:first-child').textContent;
      document.getElementsByClassName('modalPizzaInfo').textContent = "".concat(pizzaName, " ").concat(pizzaSize, " cm, x").concat(pizzaQuantity);
      document.getElementsByClassName('modalPrice').textContent = "Total: ".concat(pizzaPrice * pizzaQuantity, "$");
      console.log(modal);
      modal.style.display = 'flex';
      resetAllPizzas();
    });
    backButton.addEventListener('click', function () {
      if (modal) {
        modal.style.display = 'none';
      }
    });
    sizeButtons[1].classList.add("active");
    updateSizePrice(selectedSize);
    newMinusBtn.addEventListener("click", function () {
      if (count > 1) {
        count--;
        updatePrice();
      }
    });
    newPlusBtn.addEventListener("click", function () {
      count++;
      updatePrice();
    });
  }

  if (backButton) {
    backButton.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }

  cards.forEach(function (card, index) {
    initCardControls(card, originalData[index].basePrice);
  });
  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var text = button.textContent.trim();

      if (text === "Show all") {
        cards.forEach(function (card, index) {
          card.querySelector(".card__title").textContent = originalData[index].title;
          card.querySelector("p").textContent = originalData[index].desc;
          card.querySelector("img").setAttribute("src", originalData[index].imgSrc);
          initCardControls(card, originalData[index].basePrice);
        });
        return;
      }

      if (categoryData[text]) {
        var data = categoryData[text];
        cards.forEach(function (card) {
          card.querySelector(".card__title").textContent = data.title;
          card.querySelector("p").textContent = data.desc;
          card.querySelector("img").setAttribute("src", data.imgSrc);
          initCardControls(card, data.basePrice);
        });
        return;
      }

      cards.forEach(function (card) {
        card.querySelector(".card__title").textContent = text;
        card.querySelector("p").textContent = "".concat(text, " pizza description...");
        card.querySelector("img").setAttribute("src", "images/".concat(text.toLowerCase(), ".jpg"));
        initCardControls(card, 8.35);
      });
    });
  });
});