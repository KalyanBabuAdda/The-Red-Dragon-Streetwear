/* =========================================
   THE RED DRAGON STREETWEAR
   COMPLETE SCRIPT.JS

   PRODUCT 1 & 2
   ₹399 PRODUCT
   ₹99 PRE-BOOK
   ₹300 BALANCE

   PRODUCT 3
   ₹499 FULL PRICE
   PREPAID = ₹499
   COD = ₹499 + ₹80 SHIPPING
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  "use strict";


  /* =========================================
     HELPERS
  ========================================= */

  function get(id) {
    return document.getElementById(id);
  }

  function on(element, event, handler) {
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================
     PRODUCT 3 SHIPPING
  ========================================= */

  const PRODUCT_3_PREPAID_SHIPPING = 0;
  const PRODUCT_3_COD_SHIPPING = 80;


  /* =========================================
     ELEMENTS
  ========================================= */

  const cartButton = get("cartButton");
  const cartDrawer = get("cartDrawer");
  const closeCart = get("closeCart");
  const overlay = get("overlay");

  const cartItems = get("cartItems");
  const cartCount = get("cartCount");
  const cartTotal = get("cartTotal");
  const checkoutButton = get("checkoutButton");

  const searchButton = get("searchButton");
  const searchModal = get("searchModal");
  const closeSearch = get("closeSearch");
  const searchForm = get("searchForm");
  const searchInput = get("searchInput");
  const searchResult = get("searchResult");

  const checkoutModal = get("checkoutModal");
  const closeCheckout = get("closeCheckout");
  const customerForm = get("customerForm");

  const paymentModal = get("paymentModal");
  const closePayment = get("closePayment");

  const paymentAmount = get("paymentAmount");
  const paymentProductTotal = get("paymentProductTotal");
  const paymentPrebookTotal = get("paymentPrebookTotal");
  const paymentBalance = get("paymentBalance");

  const paymentShippingRow = get("paymentShippingRow");
  const paymentShipping = get("paymentShipping");

  const paymentPrebookRow = get("paymentPrebookRow");
  const paymentBalanceRow = get("paymentBalanceRow");

  const paymentMethodSection = get("paymentMethodSection");

  const paymentSuccess = get("paymentSuccess");
  const paymentStatus = get("paymentStatus");

  const utrInput = get("utrInput");
  const utrTransactionId = get("utrTransactionId");

  const emailSubject = get("emailSubject");
  const replyTo = get("replyTo");
  const orderReferenceField = get("orderReference");
  const orderReceipt = get("orderReceipt");

  const paymentStatusField = get("paymentStatusField");
  const productTotalField = get("productTotalField");
  const prebookTotalField = get("prebookTotalField");
  const verificationNoteField = get("verificationNoteField");

  const copyUpi = get("copyUpi");

  const successModal = get("successModal");
  const closeSuccess = get("closeSuccess");

  const newsletterForm = get("newsletterForm");


  /* =========================================
     CART
  ========================================= */

  let cart = [];


  /* =========================================
     PRODUCT HELPERS
  ========================================= */

  function isProduct3(item) {
    return String(item.id) === "vintage";
  }


  function getProductPaymentAmount(item) {

    /* Product 1 & 2 = ₹99 pre-book */
    if (!isProduct3(item)) {

      return Number(item.prebook) || 99;

    }


    /* Product 3 = full payment */

    const price =
      Number(item.price) || 499;

    const shipping =
      getProductShipping(item);

    return price + shipping;
  }


  function getProductShipping(item) {

    if (!isProduct3(item)) {
      return 0;
    }


    if (item.paymentMethod === "cod") {
      return PRODUCT_3_COD_SHIPPING;
    }


    return PRODUCT_3_PREPAID_SHIPPING;
  }


  function calculateCartPaymentTotal() {

    return cart.reduce(function (total, item) {

      return total +
        getProductPaymentAmount(item);

    }, 0);

  }


  /* =========================================
     OPEN CART
  ========================================= */

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


  /* =========================================
     CLOSE CART
  ========================================= */

  function closeCartDrawer() {

    if (cartDrawer) {
      cartDrawer.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("active");
    }

    document.body.classList.remove("no-scroll");
  }


  on(cartButton, "click", openCart);
  on(closeCart, "click", closeCartDrawer);
  on(overlay, "click", closeCartDrawer);


  /* =========================================
     UPDATE CART
  ========================================= */

  function updateCart() {

    if (!cartItems) {
      return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

      cartItems.innerHTML =
        "<p>Your cart is empty.</p>";

      if (cartCount) {
        cartCount.textContent = "";
      }

      if (cartTotal) {
        cartTotal.textContent = "₹0";
      }

      return;
    }


    let total = 0;


    cart.forEach(function (item, index) {

      const payNow =
        getProductPaymentAmount(item);

      const shipping =
        getProductShipping(item);

      total += payNow;


      let paymentInfo = "";


      if (isProduct3(item)) {

        paymentInfo = `

          <small>
            Payment:
            ${item.paymentMethod === "cod"
              ? "COD — CASH ON DELIVERY"
              : "PREPAID"}
          </small>

          <small>
            Shipping:
            ${shipping === 0
              ? "FREE"
              : "₹" + shipping}
          </small>

        `;

      } else {

        const balance =
          Math.max(
            (Number(item.price) || 0) -
            (Number(item.prebook) || 99),
            0
          );


        paymentInfo = `

          <small>
            Pre-book:
            ₹${Number(item.prebook) || 99}
          </small>

          <small>
            Balance on delivery:
            ₹${balance}
          </small>

        `;

      }


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
              Product Price:
              ₹${Number(item.price) || 0}
            </small>

            ${paymentInfo}

            <strong>
              Pay Now:
              ₹${payNow}
            </strong>

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


      cartItems.appendChild(itemElement);

    });


    if (cartCount) {
      cartCount.textContent =
        cart.length;
    }


    if (cartTotal) {
      cartTotal.textContent =
        `₹${total}`;
    }


    /* Remove buttons */

    cartItems
      .querySelectorAll(".remove-item")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

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
     SIZE SELECTION
  ========================================= */

  document
    .querySelectorAll(".product-card .sizes button")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const sizeContainer =
            button.closest(".sizes");


          if (!sizeContainer) {
            return;
          }


          sizeContainer
            .querySelectorAll("button")
            .forEach(function (btn) {

              btn.classList.remove("selected");

            });


          button.classList.add("selected");

        }
      );

    });


  /* =========================================
     PRODUCT 3 PAYMENT METHOD
  ========================================= */

  function getProduct3PaymentMethod() {

    const selected =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );


    if (!selected) {

      return {
        method: "prepaid",
        shipping: PRODUCT_3_PREPAID_SHIPPING
      };

    }


    if (selected.value === "cod") {

      return {
        method: "cod",
        shipping: PRODUCT_3_COD_SHIPPING
      };

    }


    return {
      method: "prepaid",
      shipping: PRODUCT_3_PREPAID_SHIPPING
    };

  }


  /* =========================================
     ADD TO CART
     
     IMPORTANT:
     Event delegation is used here.
     This prevents the add-to-cart buttons
     from breaking if the product section
     changes.
  ========================================= */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(".add-to-cart");


      if (!button) {
        return;
      }


      event.preventDefault();
      event.stopPropagation();


      const card =
        button.closest(".product-card");


      if (!card) {

        console.error(
          "Product card not found."
        );

        return;

      }


      /* Get selected size */

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


      /* Product information */

      const productId =
        card.dataset.productId || "";


      const productName =
        card.dataset.name ||
        card.querySelector("h3")?.textContent.trim() ||
        "Product";


      const price =
        Number(card.dataset.price) || 399;


      const prebook =
        Number(card.dataset.prebook) || 99;


      /* Build product */

      const product = {

        id: productId,

        name: productName,

        price: price,

        prebook: prebook,

        size:
          selectedSize.dataset.size ||
          selectedSize.textContent.trim(),

        paymentMethod: null,

        shipping: 0

      };


      /* =====================================
         PRODUCT 3
      ===================================== */

      if (productId === "vintage") {

        const paymentChoice =
          getProduct3PaymentMethod();


        product.paymentMethod =
          paymentChoice.method;


        product.shipping =
          paymentChoice.shipping;

      }


      /* =====================================
         ADD TO CART
      ===================================== */

      cart.push(product);


      console.log(
        "Product added to cart:",
        product
      );


      updateCart();


      openCart();


      /* Button feedback */

      const originalText =
        button.textContent;


      button.textContent =
        "ADDED ✓";


      button.disabled = true;


      setTimeout(function () {

        button.textContent =
          originalText;


        button.disabled =
          false;

      }, 1200);

    },
    true
  );


  /* =========================================
     PRODUCT IMAGE GALLERY
  ========================================= */

  document
    .querySelectorAll(".product-card")
    .forEach(function (card) {

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


      let showingBack =
        true;


      const backImage =
        image.dataset.back;


      const frontImage =
        image.dataset.front;


      if (backImage) {

        image.src =
          backImage;

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


        setTimeout(function () {

          image.src =
            src;

          image.alt =
            alt;

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

          frontImage,

          `${card.dataset.name || "Product"} front view`,

          "FRONT",

          false

        );

      }


      function showBack() {

        changeImage(

          backImage,

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
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          toggleImage();

        }
      );


      on(
        next,
        "click",
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          toggleImage();

        }
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
    function () {

      if (!searchModal) {
        return;
      }


      searchModal.classList.add("open");

      document.body.classList.add("no-scroll");


      if (searchInput) {

        setTimeout(
          function () {

            searchInput.focus();

          },
          100
        );

      }

    }
  );


  on(
    closeSearch,
    "click",
    function () {

      if (searchModal) {
        searchModal.classList.remove("open");
      }

      document.body.classList.remove("no-scroll");

    }
  );


  on(
    searchModal,
    "click",
    function (event) {

      if (event.target === searchModal) {

        searchModal.classList.remove("open");

        document.body.classList.remove("no-scroll");

      }

    }
  );


  on(
    searchForm,
    "submit",
    function (event) {

      event.preventDefault();


      if (!searchInput || !searchResult) {
        return;
      }


      const query =
        searchInput.value.trim().toLowerCase();


      if (!query) {

        searchResult.textContent =
          "Please enter a product name.";

        return;

      }


      const products =
        document.querySelectorAll(
          ".product-card"
        );


      let found =
        false;


      products.forEach(function (product) {

        const name =
          (
            product.dataset.name ||
            ""
          ).toLowerCase();


        if (name.includes(query)) {

          found =
            true;


          product.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

      });


      if (found) {

        searchResult.textContent =
          "Product found.";


        setTimeout(function () {

          searchModal.classList.remove("open");

          document.body.classList.remove("no-scroll");

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
    function () {

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


      checkoutModal.classList.add("open");

      document.body.classList.add("no-scroll");

    }
  );


  on(
    closeCheckout,
    "click",
    function () {

      if (checkoutModal) {

        checkoutModal.classList.remove("open");

      }

      document.body.classList.remove("no-scroll");

    }
  );


  /* =========================================
     UPDATE PAYMENT SCREEN
  ========================================= */

  function updatePaymentScreen() {

    const productTotal =
      cart.reduce(
        function (sum, item) {

          return sum +
            (Number(item.price) || 0);

        },
        0
      );


    const totalPayNow =
      calculateCartPaymentTotal();


    const totalShipping =
      cart.reduce(
        function (sum, item) {

          return sum +
            getProductShipping(item);

        },
        0
      );


    const totalPrebook =
      cart.reduce(
        function (sum, item) {

          if (isProduct3(item)) {
            return sum;
          }

          return sum +
            (Number(item.prebook) || 99);

        },
        0
      );


    const balanceDue =
      cart.reduce(
        function (sum, item) {

          if (isProduct3(item)) {
            return sum;
          }

          return sum +
            Math.max(
              (Number(item.price) || 0) -
              (Number(item.prebook) || 99),
              0
            );

        },
        0
      );


    if (paymentAmount) {

      paymentAmount.textContent =
        `₹${totalPayNow}`;

    }


    if (paymentProductTotal) {

      paymentProductTotal.textContent =
        `₹${productTotal}`;

    }


    if (paymentPrebookTotal) {

      paymentPrebookTotal.textContent =
        `₹${totalPayNow}`;

    }


    if (paymentBalance) {

      paymentBalance.textContent =
        `₹${balanceDue}`;

    }


    /* Shipping */

    if (paymentShippingRow) {

      if (totalShipping > 0) {

        paymentShippingRow.style.display =
          "flex";

        if (paymentShipping) {

          paymentShipping.textContent =
            `₹${totalShipping}`;

        }

      } else {

        paymentShippingRow.style.display =
          "none";

      }

    }


    /* Product 3 payment method */

    const hasProduct3 =
      cart.some(function (item) {

        return isProduct3(item);

      });


    if (paymentMethodSection) {

      paymentMethodSection.style.display =
        hasProduct3 ? "block" : "none";

    }


    /*
      If Product 3 is in cart, show the
      payment method section.
    */

    if (hasProduct3) {

      const selected =
        document.querySelector(
          'input[name="paymentMethod"]:checked'
        );


      if (selected) {

        cart.forEach(function (item) {

          if (isProduct3(item)) {

            item.paymentMethod =
              selected.value;

            item.shipping =
              selected.value === "cod"
                ? PRODUCT_3_COD_SHIPPING
                : PRODUCT_3_PREPAID_SHIPPING;

          }

        });

      }

    }


    return {

      productTotal,

      totalPayNow,

      totalShipping,

      totalPrebook,

      balanceDue

    };

  }


  /* =========================================
     PAYMENT METHOD CHANGE
  ========================================= */

  document
    .querySelectorAll(
      'input[name="paymentMethod"]'
    )
    .forEach(function (radio) {

      radio.addEventListener(
        "change",
        function () {

          if (cart.length === 0) {
            return;
          }


          cart.forEach(function (item) {

            if (isProduct3(item)) {

              item.paymentMethod =
                radio.value;


              item.shipping =
                radio.value === "cod"
                  ? PRODUCT_3_COD_SHIPPING
                  : PRODUCT_3_PREPAID_SHIPPING;

            }

          });


          updateCart();

          updatePaymentScreen();

        }
      );

    });


  /* =========================================
     CUSTOMER FORM → PAYMENT
  ========================================= */

  on(
    customerForm,
    "submit",
    async function (event) {

      event.preventDefault();


      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        return;

      }


      const fullName =
        get("fullName")?.value.trim() || "";


      const email =
        get("email")?.value.trim() || "";


      const address =
        get("address")?.value.trim() || "";


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


      /* Make sure Product 3 has current payment method */

      const selectedPaymentMethod =
        document.querySelector(
          'input[name="paymentMethod"]:checked'
        );


      if (selectedPaymentMethod) {

        cart.forEach(function (item) {

          if (isProduct3(item)) {

            item.paymentMethod =
              selectedPaymentMethod.value;


            item.shipping =
              selectedPaymentMethod.value === "cod"
                ? PRODUCT_3_COD_SHIPPING
                : PRODUCT_3_PREPAID_SHIPPING;

          }

        });

      }


      const orderDetails =
        cart.map(
          function (item, index) {

            const shipping =
              getProductShipping(item);


            const payNow =
              getProductPaymentAmount(item);


            const paymentMethod =
              isProduct3(item)
                ? (
                  item.paymentMethod === "cod"
                    ? "COD — CASH ON DELIVERY"
                    : "PREPAID"
                )
                : "₹99 PRE-BOOK";


            return (
              `${index + 1}. ${item.name}\n` +
              `   Size: ${item.size}\n` +
              `   Product Price: ₹${item.price}\n` +
              `   Payment Method: ${paymentMethod}\n` +
              `   Shipping: ₹${shipping}\n` +
              `   Pay Now: ₹${payNow}`
            );

          }
        )
        .join("\n\n");


      const productTotal =
        cart.reduce(
          function (sum, item) {

            return sum +
              (Number(item.price) || 0);

          },
          0
        );


      const totalPayNow =
        calculateCartPaymentTotal();


      const totalShipping =
        cart.reduce(
          function (sum, item) {

            return sum +
              getProductShipping(item);

          },
          0
        );


      const balanceDue =
        cart.reduce(
          function (sum, item) {

            if (isProduct3(item)) {
              return sum;
            }


            return sum +
              Math.max(
                (Number(item.price) || 0) -
                (Number(item.prebook) || 99),
                0
              );

          },
          0
        );


      const orderReference =
        `RD-${Date.now().toString().slice(-8)}`;


      /* =====================================
         HIDDEN FORM FIELDS
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
          `₹${totalPayNow}`;

      }


      if (orderReferenceField) {

        orderReferenceField.value =
          orderReference;

      }


      if (replyTo) {

        replyTo.value =
          email;

      }


      if (emailSubject) {

        emailSubject.value =
          `RED DRAGON STREETWEAR — ORDER ${orderReference} — PAYMENT VERIFICATION`;

      }


      if (productTotalField) {

        productTotalField.value =
          `₹${productTotal}`;

      }


      if (prebookTotalField) {

        prebookTotalField.value =
          `₹${totalPayNow}`;

      }


      if (paymentStatusField) {

        paymentStatusField.value =
          "PENDING — MANUAL PAYMENT VERIFICATION";

      }


      if (verificationNoteField) {

        verificationNoteField.value =
          "Customer submitted order details. Verify payment manually before confirming the order.";

      }


      /* Update payment screen */

      updatePaymentScreen();


      if (paymentStatus) {

        paymentStatus.textContent =
          "";

      }


      if (utrInput) {

        utrInput.value =
          "";

      }


      if (utrTransactionId) {

        utrTransactionId.value =
          "";

      }


      if (checkoutModal) {

        checkoutModal.classList.remove("open");

      }


      if (paymentModal) {

        paymentModal.classList.add("open");

      }


      document.body.classList.add("no-scroll");

    }
  );


  /* =========================================
     CLOSE PAYMENT
  ========================================= */

  on(
    closePayment,
    "click",
    function () {

      if (paymentModal) {

        paymentModal.classList.remove("open");

      }

      document.body.classList.remove("no-scroll");

    }
  );


  /* =========================================
     COPY UPI
  ========================================= */

  on(
    copyUpi,
    "click",
    async function () {

      const upi =
        "8919131887@axl";


      try {

        await navigator.clipboard.writeText(upi);


        copyUpi.textContent =
          "COPIED ✓";


        setTimeout(
          function () {

            copyUpi.textContent =
              "COPY UPI ID";

          },
          1500
        );


      } catch (error) {

        alert(
          `UPI ID: ${upi}`
        );

      }

    }
  );


  /* =========================================
     SUBMIT UTR
  ========================================= */

  on(
    paymentSuccess,
    "click",
    async function () {

      if (!paymentSuccess) {
        return;
      }


      const utr =
        utrInput
          ? utrInput.value.trim()
          : "";


      if (!utr) {

        if (paymentStatus) {

          paymentStatus.textContent =
            "Please enter your UTR / Transaction ID after completing the payment.";

        }


        if (utrInput) {
          utrInput.focus();
        }


        return;

      }


      if (
        !/^[A-Za-z0-9._-]{6,40}$/.test(utr)
      ) {

        if (paymentStatus) {

          paymentStatus.textContent =
            "Please enter a valid UTR / Transaction ID.";

        }


        if (utrInput) {
          utrInput.focus();
        }


        return;

      }


      paymentSuccess.disabled =
        true;


      paymentSuccess.textContent =
        "SUBMITTING...";


      if (paymentStatus) {

        paymentStatus.textContent =
          "Submitting your payment reference...";

      }


      try {

        if (
          !customerForm ||
          !customerForm.action ||
          !customerForm.action.includes("formspree.io")
        ) {

          throw new Error(
            "Formspree endpoint is missing."
          );

        }


        const fullName =
          get("fullName")?.value.trim() ||
          "Not provided";


        const email =
          get("email")?.value.trim() ||
          "Not provided";


        const phone =
          get("phone")?.value.trim() ||
          "Not provided";


        const address =
          (
            get("address")?.value.trim() ||
            "Not provided"
          ).replace(/\n/g, " | ");


        const reference =
          orderReferenceField?.value ||
          "Not provided";


        const productTotal =
          cart.reduce(
            function (sum, item) {

              return sum +
                (Number(item.price) || 0);

            },
            0
          );


        const totalPayNow =
          calculateCartPaymentTotal();


        const totalShipping =
          cart.reduce(
            function (sum, item) {

              return sum +
                getProductShipping(item);

            },
            0
          );


        const balanceDue =
          cart.reduce(
            function (sum, item) {

              if (isProduct3(item)) {
                return sum;
              }


              return sum +
                Math.max(
                  (Number(item.price) || 0) -
                  (Number(item.prebook) || 99),
                  0
                );

            },
            0
          );


        const orderDetails =
          cart.map(
            function (item, index) {

              const shipping =
                getProductShipping(item);


              const payNow =
                getProductPaymentAmount(item);


              const paymentMethod =
                isProduct3(item)
                  ? (
                    item.paymentMethod === "cod"
                      ? "COD — CASH ON DELIVERY"
                      : "PREPAID"
                  )
                  : "₹99 PRE-BOOK";


              return (
                `${index + 1}. ${item.name} | ` +
                `Size: ${item.size} | ` +
                `Price: ₹${item.price} | ` +
                `Payment: ${paymentMethod} | ` +
                `Shipping: ₹${shipping} | ` +
                `Pay Now: ₹${payNow}`
              );

            }
          )
          .join("\n");


        /* UTR */

        if (utrTransactionId) {

          utrTransactionId.value =
            utr;

        }


        if (emailSubject) {

          emailSubject.value =
            `RED DRAGON STREETWEAR — ORDER ${reference} — UTR ${utr}`;

        }


        if (replyTo && email !== "Not provided") {

          replyTo.value =
            email;

        }


        if (paymentStatusField) {

          paymentStatusField.value =
            "PENDING — MANUAL PAYMENT VERIFICATION";

        }


        if (productTotalField) {

          productTotalField.value =
            `₹${productTotal}`;

        }


        if (prebookTotalField) {

          prebookTotalField.value =
            `₹${totalPayNow}`;

        }


        if (verificationNoteField) {

          verificationNoteField.value =
            "UTR received. Verify the payment manually in the UPI/bank account before confirming the order.";

        }


        /* =====================================
           ORDER RECEIPT
        ===================================== */

        if (orderReceipt) {

          orderReceipt.value = [

            "=============================================",

            "           RED DRAGON STREETWEAR",

            "                 ORDER RECEIPT",

            "=============================================",

            `ORDER REFERENCE : ${reference}`,

            `ORDER STATUS    : PENDING MANUAL VERIFICATION`,

            "",

            "CUSTOMER DETAILS",

            "---------------------------------------------",

            `Name            : ${fullName}`,

            `Email           : ${email}`,

            `Phone           : ${phone}`,

            `Delivery Address: ${address}`,

            "",

            "ITEMS",

            "---------------------------------------------",

            orderDetails,

            "",

            "PAYMENT SUMMARY",

            "---------------------------------------------",

            `Product Total   : ₹${productTotal}`,

            `Shipping Total  : ₹${totalShipping}`,

            `Paid Now        : ₹${totalPayNow}`,

            `Balance Due     : ₹${balanceDue}`,

            "",

            "PAYMENT VERIFICATION",

            "---------------------------------------------",

            `UTR / Txn ID    : ${utr}`,

            "Payment Status  : PENDING — VERIFY MANUALLY",

            "",

            "ACTION REQUIRED",

            "Check the UTR against the payment received before confirming the order.",

            "============================================="

          ].join("\n");

        }


        /* =====================================
           SEND TO FORMSPREE
        ===================================== */

        const formData =
          new FormData(customerForm);


        const response =
          await fetch(
            customerForm.action,
            {
              method: "POST",

              body: formData,

              headers: {
                Accept: "application/json"
              }

            }
          );


        if (!response.ok) {

          let errorMessage =
            `Form submission failed (${response.status}).`;


          try {

            const result =
              await response.json();


            if (
              result &&
              result.errors &&
              result.errors.length
            ) {

              errorMessage =
                result.errors
                  .map(
                    function (error) {
                      return error.message;
                    }
                  )
                  .join(" ");

            }

          } catch (error) {
            /* Ignore JSON parsing error */
          }


          throw new Error(
            errorMessage
          );

        }


        /* =====================================
           SUCCESS
        ===================================== */

        if (paymentStatus) {

          paymentStatus.textContent =
            "UTR submitted successfully. Your order is now pending payment verification.";

        }


        paymentSuccess.textContent =
          "UTR SUBMITTED ✓";


        setTimeout(
          function () {

            if (paymentModal) {

              paymentModal.classList.remove("open");

            }


            if (successModal) {

              successModal.classList.add("open");

            }


            cart = [];


            updateCart();


            paymentSuccess.disabled =
              false;


            paymentSuccess.textContent =
              "SUBMIT UTR & PLACE ORDER";

          },
          1000
        );


      } catch (error) {

        console.error(
          "UTR submission error:",
          error
        );


        if (paymentStatus) {

          paymentStatus.textContent =
            error.message ||
            "Unable to submit your UTR. Please try again.";

        }


        paymentSuccess.disabled =
          false;


        paymentSuccess.textContent =
          "SUBMIT UTR & PLACE ORDER";

      }

    }
  );


  /* =========================================
     NEWSLETTER
  ========================================= */

  on(
    newsletterForm,
    "submit",
    function (event) {

      event.preventDefault();


      alert(
        "Thank you for subscribing!"
      );


      newsletterForm.reset();

    }
  );


  /* =========================================
     SUCCESS MODAL
  ========================================= */

  on(
    closeSuccess,
    "click",
    function () {

      if (successModal) {

        successModal.classList.remove("open");

      }


      document.body.classList.remove("no-scroll");


      scrollToSection("collection");

    }
  );


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
    .forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

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
            document.getElementById(targetId);


          if (!target) {
            return;
          }


          event.preventDefault();


          scrollToSection(targetId);

        }
      );

    });


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key !== "Escape") {
        return;
      }


      if (cartDrawer) {
        cartDrawer.classList.remove("open");
      }


      if (searchModal) {
        searchModal.classList.remove("open");
      }


      if (checkoutModal) {
        checkoutModal.classList.remove("open");
      }


      if (paymentModal) {
        paymentModal.classList.remove("open");
      }


      if (successModal) {
        successModal.classList.remove("open");
      }


      if (overlay) {
        overlay.classList.remove("active");
      }


      document.body.classList.remove("no-scroll");

    }
  );


  /* =========================================
     INITIALIZE
  ========================================= */

  updateCart();


  console.log(
    "The Red Dragon Streetwear script loaded successfully."
  );

});
