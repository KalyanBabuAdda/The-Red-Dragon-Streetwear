/* =========================================
   THE RED DRAGON STREETWEAR
   COMPLETE JAVASCRIPT
   FIXED CHECKOUT + CART + GALLERY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =========================================
     HELPERS
  ========================================= */

  const get = (id) =>
    document.getElementById(id);


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


  /* =========================================
     ELEMENTS
  ========================================= */

  const cartButton =
    get("cartButton");

  const cartDrawer =
    get("cartDrawer");

  const closeCart =
    get("closeCart");

  const overlay =
    get("overlay");

  const cartItems =
    get("cartItems");

  const cartCount =
    get("cartCount");

  const cartTotal =
    get("cartTotal");

  const checkoutButton =
    get("checkoutButton");


  const searchButton =
    get("searchButton");

  const searchModal =
    get("searchModal");

  const closeSearch =
    get("closeSearch");

  const searchForm =
    get("searchForm");

  const searchInput =
    get("searchInput");

  const searchResult =
    get("searchResult");


  const checkoutModal =
    get("checkoutModal");

  const closeCheckout =
    get("closeCheckout");

  const customerForm =
    get("customerForm");


  const paymentModal =
    get("paymentModal");

  const closePayment =
    get("closePayment");

  const paymentAmount =
    get("paymentAmount");

  const paymentProductTotal =
    get("paymentProductTotal");

  const paymentSuccess =
    get("paymentSuccess");

  const paymentStatus =
    get("paymentStatus");


  const copyUpi =
    get("copyUpi");


  const successModal =
    get("successModal");

  const closeSuccess =
    get("closeSuccess");


  const newsletterForm =
    get("newsletterForm");


  /* =========================================
     NAVIGATION
  ========================================= */

  function scrollToSection(id) {

    const section =
      document.getElementById(id);

    if (!section) {
      return;
    }


    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


    try {

      history.replaceState(
        null,
        "",
        `#${id}`
      );

    } catch (error) {

      console.warn(
        "Could not update URL hash.",
        error
      );

    }

  }


  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const href =
            link.getAttribute("href");

          if (!href) {
            return;
          }


          const targetId =
            href.substring(1);

          if (!targetId) {
            return;
          }


          const target =
            document.getElementById(
              targetId
            );

          if (!target) {
            return;
          }


          event.preventDefault();

          scrollToSection(targetId);

        }
      );

    });


  /* =========================================
     CART
  ========================================= */

  let cart = [];


  function updateCart() {

    if (
      !cartItems ||
      !cartCount ||
      !cartTotal
    ) {
      return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

      cartItems.innerHTML =
        "<p>Your cart is empty.</p>";

      cartCount.textContent = "";

      cartTotal.textContent = "₹0";

      return;

    }


    let prebookTotal = 0;


    cart.forEach((item, index) => {

      prebookTotal +=
        Number(item.prebook) || 0;


      const itemElement =
        document.createElement("div");


      itemElement.className =
        "cart-product";


      itemElement.innerHTML = `

        <div class="cart-product-top">

          <div>

            <strong>
              ${escapeHtml(item.name)}
            </strong>

            <small>
              Size: ${escapeHtml(item.size)}
            </small>

            <small>
              Actual price:
              ₹${Number(item.price) || 0}
            </small>

            <small>
              Pre-book:
              ₹${Number(item.prebook) || 0}
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


      cartItems.appendChild(
        itemElement
      );

    });


    cartCount.textContent =
      cart.length;


    cartTotal.textContent =
      `₹${prebookTotal}`;


    cartItems
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

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

          }
        );

      });

  }


  /* =========================================
     OPEN / CLOSE CART
  ========================================= */

  function openCart() {

    if (!cartDrawer) {
      return;
    }


    cartDrawer.classList.add(
      "open"
    );


    if (overlay) {

      overlay.classList.add(
        "active"
      );

    }


    document.body.classList.add(
      "no-scroll"
    );

  }


  function closeCartDrawer() {

    if (cartDrawer) {

      cartDrawer.classList.remove(
        "open"
      );

    }


    if (overlay) {

      overlay.classList.remove(
        "active"
      );

    }


    document.body.classList.remove(
      "no-scroll"
    );

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


  /* =========================================
     SIZE SELECTION
  ========================================= */

  document
    .querySelectorAll(".product-card")
    .forEach(card => {

      const sizeButtons =
        card.querySelectorAll(
          ".sizes button"
        );


      sizeButtons.forEach(button => {

        button.addEventListener(
          "click",
          () => {

            sizeButtons.forEach(btn => {

              btn.classList.remove(
                "selected"
              );

            });


            button.classList.add(
              "selected"
            );

          }
        );

      });

    });


  /* =========================================
     ADD TO CART
  ========================================= */

  document
    .querySelectorAll(".add-to-cart")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const card =
            button.closest(
              ".product-card"
            );


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


          const product = {

            id:
              card.dataset.productId || "",

            name:
              card.dataset.name ||
              "Product",

            price:
              Number(card.dataset.price) ||
              399,

            prebook:
              Number(card.dataset.prebook) ||
              99,

            size:
              selectedSize.dataset.size ||
              ""

          };


          cart.push(product);


          updateCart();

          openCart();


          button.textContent =
            "ADDED ✓";


          setTimeout(() => {

            button.textContent =
              "ADD TO CART — ₹99 PRE-BOOK";

          }, 1200);

        }
      );

    });


  /* =========================================
     PRODUCT IMAGE GALLERY
     
     BACKSIDE IS DEFAULT
  ========================================= */

  document
    .querySelectorAll(".product-card")
    .forEach(card => {

      const image =
        card.querySelector(
          ".product-image"
        );

      const previous =
        card.querySelector(
          ".gallery-prev"
        );

      const next =
        card.querySelector(
          ".gallery-next"
        );

      const label =
        card.querySelector(
          ".image-label"
        );


      if (
        !image ||
        !previous ||
        !next ||
        !label
      ) {
        return;
      }


      let showingBack = true;


      /*
        Force backside as default.
      */

      const backImage =
        image.dataset.back;


      if (backImage) {

        image.src =
          backImage;

        image.alt =
          `${card.dataset.name || "Product"} back view`;

        label.textContent =
          "BACK";

      }


      function changeImage(
        src,
        alt,
        labelText,
        isBack
      ) {

        if (!src) {
          return;
        }


        image.style.opacity =
          "0";


        setTimeout(() => {

          image.src = src;

          image.alt = alt;

          label.textContent =
            labelText;

          image.style.opacity =
            "1";

        }, 100);


        showingBack =
          isBack;

      }


      function showFront() {

        changeImage(

          image.dataset.front,

          `${card.dataset.name || "Product"} front view`,

          "FRONT",

          false

        );

      }


      function showBack() {

        changeImage(

          image.dataset.back,

          `${card.dataset.name || "Product"} back view`,

          "BACK",

          true

        );

      }


      function toggleImage() {

        if (showingBack) {

          showFront();

        } else {

          showBack();

        }

      }


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


  /* =========================================
     SEARCH
  ========================================= */

  on(
    searchButton,
    "click",
    () => {

      if (!searchModal) {
        return;
      }


      searchModal.classList.add(
        "open"
      );


      document.body.classList.add(
        "no-scroll"
      );


      if (searchInput) {

        setTimeout(
          () => searchInput.focus(),
          100
        );

      }

    }
  );


  on(
    closeSearch,
    "click",
    () => {

      if (searchModal) {

        searchModal.classList.remove(
          "open"
        );

      }


      document.body.classList.remove(
        "no-scroll"
      );

    }
  );


  on(
    searchModal,
    "click",
    event => {

      if (
        event.target === searchModal
      ) {

        searchModal.classList.remove(
          "open"
        );

        document.body.classList.remove(
          "no-scroll"
        );

      }

    }
  );


  on(
    searchForm,
    "submit",
    event => {

      event.preventDefault();


      if (
        !searchInput ||
        !searchResult
      ) {
        return;
      }


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
        document.querySelectorAll(
          ".product-card"
        );


      let found = false;


      products.forEach(product => {

        const name =
          (
            product.dataset.name ||
            ""
          ).toLowerCase();


        if (
          name.includes(query)
        ) {

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

          searchModal.classList.remove(
            "open"
          );

          document.body.classList.remove(
            "no-scroll"
          );

        }, 500);

      } else {

        searchResult.textContent =
          "No matching product found.";

      }

    }
  );


  /* =========================================
     CHECKOUT
  ========================================= */

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


      if (!checkoutModal) {

        alert(
          "Checkout is currently unavailable."
        );

        return;

      }


      closeCartDrawer();


      checkoutModal.classList.add(
        "open"
      );


      document.body.classList.add(
        "no-scroll"
      );

    }
  );


  on(
    closeCheckout,
    "click",
    () => {

      if (checkoutModal) {

        checkoutModal.classList.remove(
          "open"
        );

      }


      document.body.classList.remove(
        "no-scroll"
      );

    }
  );


  /* =========================================
     CUSTOMER DETAILS → PAYMENT
     
     IMPORTANT FIX:
     
     Payment is NOT blocked by Formspree.
     
     If Formspree works:
       → details are submitted
       → payment opens
     
     If Formspree fails:
       → payment still opens
       → customer can continue
  ========================================= */

  on(
    customerForm,
    "submit",
    async event => {

      event.preventDefault();


      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        return;

      }


      const fullNameElement =
        get("fullName");

      const emailElement =
        get("email");

      const addressElement =
        get("address");


      const fullName =
        fullNameElement
          ? fullNameElement.value.trim()
          : "";


      const email =
        emailElement
          ? emailElement.value.trim()
          : "";


      const address =
        addressElement
          ? addressElement.value.trim()
          : "";


      if (
        !fullName ||
        !email ||
        !address
      ) {

        alert(
          "Please complete all customer details."
        );

        return;

      }


      /* =====================================
         CALCULATE ORDER
      ===================================== */

      const orderDetails =
        cart
          .map(item =>
            `${item.name} | Size: ${item.size} | Actual Price: ₹${item.price} | Pre-book: ₹${item.prebook}`
          )
          .join("\n");


      const totalPrebook =
        cart.reduce(
          (sum, item) =>
            sum +
            (Number(item.prebook) || 0),
          0
        );


      const productTotal =
        cart.reduce(
          (sum, item) =>
            sum +
            (Number(item.price) || 0),
          0
        );


      /* =====================================
         FILL HIDDEN FORM FIELDS
      ===================================== */

      const orderDetailsField =
        get("orderDetails");


      const prebookAmountField =
        get("prebookAmount");


      if (orderDetailsField) {

        orderDetailsField.value =
          orderDetails;

      }

/* =========================================
   CUSTOMER DETAILS → PAYMENT
========================================= */

on(
  customerForm,
  "submit",
  async event => {

    event.preventDefault();

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );
      return;
    }

    const fullNameElement =
      get("fullName");

    const emailElement =
      get("email");

    const phoneElement =
      get("phone");

    const addressElement =
      get("address");

    const fullName =
      fullNameElement
        ? fullNameElement.value.trim()
        : "";

    const email =
      emailElement
        ? emailElement.value.trim()
        : "";

    const phone =
      phoneElement
        ? phoneElement.value.trim()
        : "";

    const address =
      addressElement
        ? addressElement.value.trim()
        : "";


    /* =====================================
       VALIDATE CUSTOMER DETAILS
    ===================================== */

    if (
      !fullName ||
      !email ||
      !phone ||
      !address
    ) {

      alert(
        "Please fill in your full name, email, phone number and complete address."
      );

      return;
    }


    /* =====================================
       CALCULATE ORDER
    ===================================== */

    const orderDetails =
      cart
        .map(item =>
          `${item.name} | Size: ${item.size} | Actual Price: ₹${item.price} | Pre-book: ₹${item.prebook}`
        )
        .join("\n");


    const totalPrebook =
      cart.reduce(
        (sum, item) =>
          sum +
          (Number(item.prebook) || 0),
        0
      );


    const productTotal =
      cart.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0),
        0
      );


    /* =====================================
       FILL HIDDEN FORM FIELDS
    ===================================== */

    const orderDetailsField =
      get("orderDetails");

    const prebookAmountField =
      get("prebookAmount");


    if (orderDetailsField) {
      orderDetailsField.value =
        orderDetails;
    }


    if (prebookAmountField) {
      prebookAmountField.value =
        `₹${totalPrebook}`;
    }


    /* =====================================
       SHOW SENDING STATUS
    ===================================== */

    const submitButton =
      customerForm.querySelector(
        'button[type="submit"]'
      );


    if (submitButton) {

      submitButton.disabled = true;

      submitButton.textContent =
        "SENDING DETAILS...";
    }


    /* =====================================
       SEND CUSTOMER DETAILS TO YOU
       
       Payment will NOT open until this
       submission succeeds.
    ===================================== */

    try {

      const formData =
        new FormData(customerForm);


      const response =
        await fetch(
          customerForm.action,
          {
            method: "POST",

            body: formData,

            headers: {
              Accept:
                "application/json"
            }
          }
        );


      if (!response.ok) {

        throw new Error(
          "Formspree submission failed."
        );

      }


      /* =====================================
         PREPARE PAYMENT SCREEN
      ===================================== */

      if (paymentAmount) {

        paymentAmount.textContent =
          `₹${totalPrebook}`;

      }


      if (paymentProductTotal) {

        paymentProductTotal.textContent =
          `₹${productTotal}`;

      }


      if (paymentStatus) {

        paymentStatus.textContent =
          "Customer details received. Please complete your payment and enter your UTR.";

      }


      /* =====================================
         RESET UTR FIELD
      ===================================== */

      const utrInput =
        get("utrId");

      if (utrInput) {

        utrInput.value = "";

      }


      if (paymentSuccess) {

        paymentSuccess.disabled =
          true;

        paymentSuccess.textContent =
          "ENTER UTR TO COMPLETE ORDER";

        paymentSuccess.style.opacity =
          "0.5";

        paymentSuccess.style.cursor =
          "not-allowed";

      }


      /* =====================================
         OPEN PAYMENT
      ===================================== */

      if (checkoutModal) {

        checkoutModal.classList.remove(
          "open"
        );

      }


      if (paymentModal) {

        paymentModal.classList.add(
          "open"
        );

      }


      document.body.classList.add(
        "no-scroll"
      );


    } catch (error) {

      console.error(
        "Customer details submission failed:",
        error
      );


      alert(
        "We could not send your details. Please check your internet connection and try again."
      );


    } finally {

      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          "CONTINUE TO PAYMENT";

      }

    }

  }
);
  on(
    copyUpi,
    "click",
    async () => {

      const upi =
        "8919131887@axl";


      try {

        await navigator.clipboard.writeText(
          upi
        );


        copyUpi.textContent =
          "COPIED ✓";


        setTimeout(() => {

          copyUpi.textContent =
            "COPY UPI ID";

        }, 1500);

      } catch {

        alert(
          `UPI ID: ${upi}`
        );

      }

    }
  );


  /* =========================================
   UTR VALIDATION
========================================= */

const utrInput =
  get("utrId");


on(
  utrInput,
  "input",
  () => {

    if (!paymentSuccess) {
      return;
    }


    const utr =
      utrInput
        ? utrInput.value.trim()
        : "";


    if (utr.length > 0) {

      paymentSuccess.disabled =
        false;

      paymentSuccess.textContent =
        "COMPLETE ORDER ✓";

      paymentSuccess.style.opacity =
        "1";

      paymentSuccess.style.cursor =
        "pointer";

    } else {

      paymentSuccess.disabled =
        true;

      paymentSuccess.textContent =
        "ENTER UTR TO COMPLETE ORDER";

      paymentSuccess.style.opacity =
        "0.5";

      paymentSuccess.style.cursor =
        "not-allowed";

    }

  }
);


/* =========================================
   PAYMENT COMPLETED / ORDER COMPLETION

   IMPORTANT:
   No email is sent here.

   The customer must enter a UTR first.
   You will manually verify the payment
   and send the confirmation email.
========================================= */

on(
  paymentSuccess,
  "click",
  () => {

    if (!paymentSuccess) {
      return;
    }


    const utr =
      utrInput
        ? utrInput.value.trim()
        : "";


    /* =====================================
       UTR IS REQUIRED
    ===================================== */

    if (!utr) {

      alert(
        "Please enter your UTR / Transaction ID before completing the order."
      );

      if (utrInput) {
        utrInput.focus();
      }

      return;
    }


    /* =====================================
       SHOW UTR IN CONSOLE FOR DEBUGGING
       (Not shown to the customer)
    ===================================== */

    console.log(
      "Customer UTR:",
      utr
    );


    /* =====================================
       ORDER CAN NOW BE MARKED AS RECEIVED

       IMPORTANT:
       This does NOT verify the payment.
       You must manually check the UTR.
    ===================================== */

    if (paymentStatus) {

      paymentStatus.textContent =
        "UTR received. Your order details have been recorded. Payment will be verified manually.";

    }


    paymentSuccess.disabled =
      true;

    paymentSuccess.textContent =
      "ORDER RECEIVED ✓";


    paymentSuccess.style.opacity =
      "1";


    /* =====================================
       SHOW SUCCESS SCREEN
    ===================================== */

    setTimeout(() => {

      if (paymentModal) {

        paymentModal.classList.remove(
          "open"
        );

      }


      if (successModal) {

        successModal.classList.add(
          "open"
        );

      }


      /*
        Clear cart only after the UTR has
        been submitted by the customer.
      */

      cart = [];

      updateCart();


      paymentSuccess.disabled =
        false;

      paymentSuccess.textContent =
        "ENTER UTR TO COMPLETE ORDER";


      paymentSuccess.style.opacity =
        "0.5";

      paymentSuccess.style.cursor =
        "not-allowed";


      if (utrInput) {

        utrInput.value = "";

      }

    }, 900);

  }
);

  on(
    closePayment,
    "click",
    () => {

      if (paymentModal) {

        paymentModal.classList.remove(
          "open"
        );

      }


      document.body.classList.remove(
        "no-scroll"
      );

    }
  );


  /* =========================================
     SUCCESS
  ========================================= */

  on(
    closeSuccess,
    "click",
    () => {

      if (successModal) {

        successModal.classList.remove(
          "open"
        );

      }


      document.body.classList.remove(
        "no-scroll"
      );


      scrollToSection(
        "collection"
      );

    }
  );


  /* =========================================
     NEWSLETTER
  ========================================= */

  on(
    newsletterForm,
    "submit",
    event => {

      event.preventDefault();


      alert(
        "Thank you for subscribing!"
      );


      newsletterForm.reset();

    }
  );


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }


      if (cartDrawer) {

        cartDrawer.classList.remove(
          "open"
        );

      }


      if (searchModal) {

        searchModal.classList.remove(
          "open"
        );

      }


      if (checkoutModal) {

        checkoutModal.classList.remove(
          "open"
        );

      }


      if (paymentModal) {

        paymentModal.classList.remove(
          "open"
        );

      }


      if (successModal) {

        successModal.classList.remove(
          "open"
        );

      }


      if (overlay) {

        overlay.classList.remove(
          "active"
        );

      }


      document.body.classList.remove(
        "no-scroll"
      );

    }
  );


  /* =========================================
     INITIALIZE
  ========================================= */

  updateCart();

});
