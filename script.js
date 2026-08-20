document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* =================================
     HELPERS
  ================================= */

  const $ = (id) => document.getElementById(id);

  const on = (element, event, handler) => {
    if (element) {
      element.addEventListener(event, handler);
    }
  };

  const escapeHtml = (value) => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };


  /* =================================
     ELEMENTS
  ================================= */

  const cartButton = $("cartButton");
  const cartDrawer = $("cartDrawer");
  const closeCart = $("closeCart");
  const overlay = $("overlay");

  const cartItems = $("cartItems");
  const cartCount = $("cartCount");
  const cartTotal = $("cartTotal");
  const checkoutButton = $("checkoutButton");

  const searchButton = $("searchButton");
  const searchModal = $("searchModal");
  const closeSearch = $("closeSearch");
  const searchForm = $("searchForm");
  const searchInput = $("searchInput");
  const searchResult = $("searchResult");

  const checkoutModal = $("checkoutModal");
  const closeCheckout = $("closeCheckout");
  const customerForm = $("customerForm");
  const customerSubmit = $("customerSubmit");
  const checkoutMessage = $("checkoutMessage");

  const paymentModal = $("paymentModal");
  const closePayment = $("closePayment");
  const paymentAmount = $("paymentAmount");
  const paymentProductTotal = $("paymentProductTotal");
  const copyUpi = $("copyUpi");

  const utrId = $("utrId");
  const paymentSuccess = $("paymentSuccess");
  const paymentStatus = $("paymentStatus");

  const successModal = $("successModal");
  const closeSuccess = $("closeSuccess");

  const orderSummary = $("orderSummary");
  const formPrebookAmount = $("formPrebookAmount");

  const newsletterForm = $("newsletterForm");


  /* =================================
     CART DATA
  ================================= */

  let cart = [];


  /* =================================
     NAVIGATION
  ================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const href = link.getAttribute("href");

        if (!href || href === "#") {
          return;
        }

        const target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });


  /* =================================
     CART TOTAL
  ================================= */

  function getPrebookTotal() {

    return cart.reduce(
      (total, item) =>
        total + Number(item.prebook || 0),
      0
    );

  }


  /* =================================
     UPDATE CART
  ================================= */

  function updateCart() {

    if (!cartItems) {
      return;
    }

    cartItems.innerHTML = "";

    const total = getPrebookTotal();

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      `;

      if (cartCount) {
        cartCount.textContent = "";
      }

      if (cartTotal) {
        cartTotal.textContent = "₹0";
      }

      if (checkoutButton) {
        checkoutButton.disabled = true;
      }

      return;
    }


    cart.forEach((item, index) => {

      const product = document.createElement("div");

      product.className = "cart-product";

      product.innerHTML = `

        <div class="cart-product-top">

          <div>

            <strong>
              ${escapeHtml(item.name)}
            </strong>

            <small>
              Size: ${escapeHtml(item.size)}
            </small>

            <small>
              Pre-book: ₹${Number(item.prebook)}
            </small>

          </div>

          <button
            class="remove-item"
            type="button"
            data-index="${index}"
          >
            REMOVE
          </button>

        </div>

      `;

      cartItems.appendChild(product);

    });


    if (cartCount) {
      cartCount.textContent = String(cart.length);
    }

    if (cartTotal) {
      cartTotal.textContent = `₹${total}`;
    }

    if (checkoutButton) {
      checkoutButton.disabled = false;
    }


    cartItems
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          if (
            Number.isInteger(index) &&
            index >= 0 &&
            index < cart.length
          ) {

            cart.splice(index, 1);

            updateCart();

          }

        });

      });

  }


  /* =================================
     OPEN CART
  ================================= */

  function openCart() {

    if (!cartDrawer) {
      return;
    }

    cartDrawer.classList.add("open");

    if (overlay) {
      overlay.classList.add("active");
    }

    document.body.classList.add("no-scroll");

  }


  /* =================================
     CLOSE CART
  ================================= */

  function closeCartDrawer() {

    if (cartDrawer) {
      cartDrawer.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("active");
    }

    document.body.classList.remove("no-scroll");

  }


  on(
    cartButton,
    "click",
    openCart
  );


  on(
    closeCart,
    "click",
    closeCartDrawer
  );


  on(
    overlay,
    "click",
    closeCartDrawer
  );


  /* =================================
     SIZE SELECTION
  ================================= */

  document
    .querySelectorAll(".product-card")
    .forEach(card => {

      const buttons =
        card.querySelectorAll(".sizes button");

      buttons.forEach(button => {

        button.addEventListener("click", () => {

          buttons.forEach(btn => {
            btn.classList.remove("selected");
          });

          button.classList.add("selected");

        });

      });

    });


  /* =================================
     ADD TO CART
  ================================= */

  document
    .querySelectorAll(".add-to-cart")
    .forEach(button => {

      button.addEventListener("click", () => {

        const card =
          button.closest(".product-card");

        if (!card) {
          return;
        }


        const selectedSize =
          card.querySelector(
            ".sizes button.selected"
          );


        if (!selectedSize) {

          alert(
            "Please select a size before adding the product to your cart."
          );

          return;

        }


        const item = {

          id:
            card.dataset.productId,

          name:
            card.dataset.name,

          price:
            Number(card.dataset.price),

          prebook:
            Number(card.dataset.prebook),

          size:
            selectedSize.dataset.size

        };


        cart.push(item);

        updateCart();

        openCart();


        const oldText =
          button.textContent;

        button.textContent =
          "ADDED ✓";


        setTimeout(() => {
          button.textContent = oldText;
        }, 1200);

      });

    });


  /* =================================
     PRODUCT IMAGE GALLERY
  ================================= */

  document
    .querySelectorAll(".product-card")
    .forEach(card => {

      const image =
        card.querySelector(".product-image");

      const previous =
        card.querySelector(".gallery-prev");

      const next =
        card.querySelector(".gallery-next");

      const label =
        card.querySelector(".image-label");


      if (
        !image ||
        !previous ||
        !next ||
        !label
      ) {
        return;
      }


      let showingBack = true;


      function showImage(
        source,
        text,
        isBack
      ) {

        if (!source) {
          return;
        }

        image.style.opacity = "0";

        setTimeout(() => {

          image.src = source;

          image.alt =
            `${card.dataset.name} ${text.toLowerCase()} view`;

          label.textContent = text;

          image.style.opacity = "1";

        }, 100);

        showingBack = isBack;

      }


      function toggleImage() {

        if (showingBack) {

          showImage(
            image.dataset.front,
            "FRONT",
            false
          );

        } else {

          showImage(
            image.dataset.back,
            "BACK",
            true
          );

        }

      }


      showImage(
        image.dataset.back,
        "BACK",
        true
      );


      on(
        previous,
        "click",
        toggleImage
      );

      on(
        next,
        "click",
        toggleImage
      );

      on(
        image,
        "click",
        toggleImage
      );

    });


  /* =================================
     SEARCH
  ================================= */

  on(
    searchButton,
    "click",
    () => {

      if (!searchModal) {
        return;
      }

      searchModal.classList.add("open");

      document.body.classList.add("no-scroll");

      setTimeout(() => {

        if (searchInput) {
          searchInput.focus();
        }

      }, 100);

    }
  );


  on(
    closeSearch,
    "click",
    () => {

      searchModal.classList.remove("open");

      document.body.classList.remove("no-scroll");

    }
  );


  on(
    searchModal,
    "click",
    event => {

      if (event.target === searchModal) {

        searchModal.classList.remove("open");

        document.body.classList.remove("no-scroll");

      }

    }
  );


  on(
    searchForm,
    "submit",
    event => {

      event.preventDefault();

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!query) {

        searchResult.textContent =
          "Please enter a product name.";

        return;

      }


      const products =
        document.querySelectorAll(".product-card");


      let found = false;


      products.forEach(product => {

        const name =
          (
            product.dataset.name || ""
          ).toLowerCase();


        if (name.includes(query)) {

          found = true;

          product.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

      });


      if (found) {

        searchResult.textContent =
          "Product found.";

        setTimeout(() => {

          searchModal.classList.remove("open");

          document.body.classList.remove("no-scroll");

        }, 500);

      } else {

        searchResult.textContent =
          "No matching product found.";

      }

    }
  );


  /* =================================
     CHECKOUT
  ================================= */

  on(
    checkoutButton,
    "click",
    () => {

      if (cart.length === 0) {

        alert(
          "Your cart is empty. Please add a product first."
        );

        return;

      }


      closeCartDrawer();


      if (checkoutModal) {

        checkoutModal.classList.add("open");

        document.body.classList.add("no-scroll");

      }

    }
  );


  /* =================================
     CLOSE CHECKOUT
  ================================= */

  on(
    closeCheckout,
    "click",
    () => {

      checkoutModal.classList.remove("open");

      document.body.classList.remove("no-scroll");

    }
  );


  /* =================================
     CREATE ORDER SUMMARY
  ================================= */

  function createOrderSummary() {

    return cart
      .map(item => {

        return (
          `${item.name} | Size: ${item.size} | ` +
          `Price: ₹${item.price} | ` +
          `Pre-book: ₹${item.prebook}`
        );

      })
      .join("\n");

  }


  /* =================================
     CUSTOMER FORM
     
     Formspree:
     https://formspree.io/f/xpwzgqvl
  ================================= */

  on(
    customerForm,
    "submit",
    async event => {

      event.preventDefault();


      if (cart.length === 0) {

        checkoutMessage.textContent =
          "Your cart is empty.";

        return;

      }


      checkoutMessage.textContent =
        "Submitting your details...";


      if (customerSubmit) {
        customerSubmit.disabled = true;
        customerSubmit.textContent =
          "SUBMITTING...";
      }


      const total =
        getPrebookTotal();


      orderSummary.value =
        createOrderSummary();


      formPrebookAmount.value =
        `₹${total}`;


      const formData =
        new FormData(customerForm);


      try {

        const response =
          await fetch(
            customerForm.action,
            {
              method: "POST",
              body: formData,
              headers: {
                "Accept":
                  "application/json"
              }
            }
          );


        if (!response.ok) {

          throw new Error(
            "Form submission failed."
          );

        }


        /* -----------------------------
           CUSTOMER DETAILS SUCCESS
        ----------------------------- */

        checkoutModal.classList.remove("open");


        paymentAmount.textContent =
          `₹${total}`;


        paymentProductTotal.innerHTML =
          cart
            .map(item =>
              `<div>
                ${escapeHtml(item.name)}
                — Size ${escapeHtml(item.size)}
              </div>`
            )
            .join("");


        paymentStatus.textContent =
          "";


        utrId.value = "";


        paymentSuccess.disabled = true;


        paymentModal.classList.add("open");


        checkoutMessage.textContent = "";


      } catch (error) {

        console.error(error);

        checkoutMessage.textContent =
          "We could not submit your details. Please check your internet connection and try again.";

      } finally {

        if (customerSubmit) {

          customerSubmit.disabled = false;

          customerSubmit.textContent =
            "CONTINUE TO PAYMENT — ₹99";

        }

      }

    }
  );


  /* =================================
     PAYMENT MODAL
  ================================= */

  on(
    closePayment,
    "click",
    () => {

      paymentModal.classList.remove("open");

      document.body.classList.remove("no-scroll");

    }
  );


  /* =================================
     COPY UPI
  ================================= */

  on(
    copyUpi,
    "click",
    async () => {

      const upi =
        "8919131887@axl";


      try {

        await navigator.clipboard.writeText(upi);

        copyUpi.textContent =
          "COPIED ✓";


        setTimeout(() => {

          copyUpi.textContent =
            "COPY UPI ID";

        }, 1500);


      } catch (error) {

        alert(
          `UPI ID: ${upi}`
        );

      }

    }
  );


  /* =================================
     UTR VALIDATION
     
     Complete Order stays disabled
     until UTR is entered.
  ================================= */

  on(
    utrId,
    "input",
    () => {

      const value =
        utrId.value.trim();


      if (value.length > 0) {

        paymentSuccess.disabled = false;

        paymentStatus.textContent =
          "UTR entered. You can now complete your order.";

      } else {

        paymentSuccess.disabled = true;

        paymentStatus.textContent =
          "Please enter the UTR / Transaction ID.";

      }

    }
  );


  /* =================================
     COMPLETE ORDER
  ================================= */

  on(
    paymentSuccess,
    "click",
    () => {

      const utr =
        utrId.value.trim();


      if (!utr) {

        paymentSuccess.disabled = true;

        paymentStatus.textContent =
          "Please enter the UTR / Transaction ID.";

        return;

      }


      /*
        IMPORTANT:

        There is NO second Formspree form here.

        The UTR is simply captured in the
        browser so the customer cannot reach
        the completed screen without entering it.

        You can manually verify the UTR and
        contact the customer using the details
        received through your first Formspree.
      */


      console.log(
        "Order UTR:",
        utr
      );


      paymentModal.classList.remove("open");


      successModal.classList.add("open");


      cart = [];


      updateCart();


      document.body.classList.add("no-scroll");

    }
  );


  /* =================================
     SUCCESS
  ================================= */

  on(
    closeSuccess,
    "click",
    () => {

      successModal.classList.remove("open");

      document.body.classList.remove("no-scroll");

    }
  );


  /* =================================
     NEWSLETTER
  ================================= */

  on(
    newsletterForm,
    "submit",
    event => {

      event.preventDefault();

      const email =
        newsletterForm
          .querySelector("input")
          .value
          .trim();


      if (!email) {
        return;
      }


      alert(
        "Thank you for subscribing!"
      );


      newsletterForm.reset();

    }
  );


  /* =================================
     INITIAL CART
  ================================= */

  updateCart();

});
