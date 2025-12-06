document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("promoVideo");
    const playBtn = document.getElementById("playBtn");

    playBtn.addEventListener("click", () => {
        video.play().then(() => {
            playBtn.classList.add("hidden");
        }).catch(err => {
            console.log("Ошибка воспроизведения:", err);
        });
    });

    video.addEventListener("click", () => {
        if (video.paused) {
            video.play().then(() => {
                playBtn.classList.add("hidden");
            }).catch(err => {
                console.log("Ошибка воспроизведения:", err);
            });
        } else {
            video.pause();
            playBtn.classList.remove("hidden");
        }
    });
});

/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".menu__buttons .menu-button");
    const cards = document.querySelectorAll(".menu__cards-card");

    const originalData = Array.from(cards).map(card => ({
        title: card.querySelector(".card__title").textContent,
        desc: card.querySelector("p").textContent,
        imgSrc: card.querySelector("img").getAttribute("src"),
        basePrice: 8.35 
    }));

    const categoryData = {
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

    const modal = document.getElementById('#orderModal');
    const backButton = document.getElementById('#back-button');
    function showModal(card){
        const pizzaName = card.querySelector('.card__title').textContent;
        const pizzaSize = card.querySelector('.sizes .active').textContent;
        const pizzaQuantity = card.querySelector('.amount span').textContent;
        const pizzaPrice = card.querySelector('.price span:first-child').textContent.replace(',','.');

        document.getElementById('#modal-info').textContent = `${pizzaName} ${pizzaSize} cm, x${pizzaQuantity}`;
        document.getElementById('#modal-price').textContent = `Total: ${(+pizzaPrice).toFixed(2)}$`;
        modal.style.display = 'flex';
        setTimeout (()=>{resetAllPizzas()},1);
    }
    function resetAllPizzas() {
        cards.forEach((card, index) => {
            card.querySelector(".card__title").textContent = originalData[index].title;
            card.querySelector("p").textContent = originalData[index].desc;
            card.querySelector("img").setAttribute("src", originalData[index].imgSrc);
            initCardControls(card, originalData[index].basePrice);
        });
    }

    function initCardControls(card, basePrice) {
        const priceEl = card.querySelector(".price span:first-child");
        const minusBtn = card.querySelector(".amount button:nth-child(1)");
        const plusBtn = card.querySelector(".amount button:nth-child(3)");
        const amountEl = card.querySelector(".amount span");
        const sizeButtons = card.querySelectorAll(".sizes .card-button");
        const orderNowBtn=card.querySelector(".passive-button");

        let count = 1;
        let currentBasePrice = basePrice;
        let selectedSize = "28";
        
        const newMinusBtn = minusBtn.cloneNode(true);
        const newPlusBtn = plusBtn.cloneNode(true);
        minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
        plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);

        const updatePrice = () => {
            const finalPrice = (currentBasePrice * count).toFixed(2).replace(".", ",");
            amountEl.textContent = count;
            priceEl.textContent = finalPrice;
        };

        const updateSizePrice = (size) => {
            let sizeMultiplier = 1;
            
            switch(size) {
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

        sizeButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener("click", () => {
                sizeButtons.forEach(btn => btn.classList.remove("active"));
                newButton.classList.add("active");
                
                selectedSize = newButton.textContent;
                updateSizePrice(selectedSize);
            });
        });

        orderNowBtn.addEventListener("click",()=>{
            showModal(card);
        })
        backButton.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
            }
        });
        sizeButtons[1].classList.add("active");

        updateSizePrice(selectedSize);

        newMinusBtn.addEventListener("click", () => {
            if (count > 1) {
                count--;
                updatePrice();
            }
        });

        newPlusBtn.addEventListener("click", () => {
            count++;
            updatePrice();
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    cards.forEach((card, index) => {
        initCardControls(card, originalData[index].basePrice);
    });

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const text = button.textContent.trim();

            if (text === "Show all") {
                cards.forEach((card, index) => {
                    card.querySelector(".card__title").textContent = originalData[index].title;
                    card.querySelector("p").textContent = originalData[index].desc;
                    card.querySelector("img").setAttribute("src", originalData[index].imgSrc);
                    initCardControls(card, originalData[index].basePrice);
                });
                return;
            }

            if (categoryData[text]) {
                const data = categoryData[text];
                cards.forEach(card => {
                    card.querySelector(".card__title").textContent = data.title;
                    card.querySelector("p").textContent = data.desc;
                    card.querySelector("img").setAttribute("src", data.imgSrc);
                    initCardControls(card, data.basePrice);
                });
                return;
            }

            cards.forEach(card => {
                card.querySelector(".card__title").textContent = text;
                card.querySelector("p").textContent = `${text} pizza description...`;
                card.querySelector("img").setAttribute("src", `images/${text.toLowerCase()}.jpg`);
                initCardControls(card, 8.35);
            });
        });
    });

});

document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку бургер-меню и меню
    const burgerMenu = document.querySelector('.burger-menu');
    const headerMenu = document.querySelector('.header_menu');
    
        burgerMenu.addEventListener('click', function() {
            if (burgerMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active-menu');
            }else{
                burgerMenu.classList.add('active-menu');
            }
        });

        const menuItems = headerMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                burgerMenu.classList.remove('active-menu');
            });
        });
        
        document.addEventListener('click', function(event) {
            if (!burgerMenu.contains(event.target) && burgerMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active-menu');
            }
        });
});