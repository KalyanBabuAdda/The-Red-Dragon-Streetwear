/* =========================================
   THE RED DRAGON STREETWEAR
   COMPLETE SCRIPT.JS
   PRODUCT 1 & 2 = ₹99 PRE-BOOK
   PRODUCT 3 = FULL PRICE + PREPAID / COD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* =========================================
     HELPERS
  ========================================= */

  const get = (id) => document.getElementById(id);

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
     PRODUCT 3 SHIPPING SETTINGS
     
     CHANGE THESE VALUES IF REQUIRED
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

  /*
    Stores the payment method for Product 3.

    Product 1 & 2 don't need this because
    they always use the ₹99 pre-book system.
  */

  let product3PaymentMethod = "prepaid";


  /* =========================================
     PRODUCT HELPERS
  ========================================= */

  function isProduct3(item) {
    return item.id === "vintage";
  }


  function getProductPaymentAmount(item) {

    /*
      Product 1 & Product 2:
      Customer pays only ₹99 now.
    */

    if (!isProduct3(item)) {
      return Number(item.prebook) || 99;
    }


    /*
      Product 3:
      Full ₹499 is paid for Prepaid.
    */

    if (item.paymentMethod === "prepaid") {
      return (
        (Number(item.price) || 499) +
        (Number(item.shipping) || 0)
      );
    }


    /*
      Product 3:
      COD = full product price + COD shipping.
    */

    if (item.paymentMethod === "cod") {
      return (
        (Number(item.price) || 499) +
        (Number(item.shipping) || PRODUCT_3_COD_SHIPPING)
      );
    }


    return Number(item.price) || 499;
  }


  function getProductShipping(item) {

    if (!isProduct3(item)) {
      return 0;
    }

    if (item.paymentMethod === "cod") {
      return Number(item.shipping) || PRODUCT_3_COD_SHIPPING;
    }

    return PRODUCT_3_PREPAID_SHIPPING;
  }


  /* =========================================
     CART TOTAL
  ========================================= */

  function calculateCartPaymentTotal() {

    return cart.reduce((total, item) => {

      return total + getProductPaymentAmount(item);

    }, 0);

  }


  /* =========================================
     UPDATE CART
  ========================================= */

  function updateCart() {

    if (!cartItems || !cartCount || !cartTotal) {
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


    let total = 0;


    cart.forEach((item, index) => {

      const paymentAmountForItem =
        getProductPaymentAmount(item);


      const shipping =
        getProductShipping(item);


      total += paymentAmountForItem;


      const itemElement =
        document.createElement("div");


      itemElement.className =
        "cart-product";


      let paymentInfo = "";


      if (isProduct3(item)) {

        paymentInfo = `

          <small>
            Payment:
            ${item.paymentMethod === "cod"
              ? "COD"
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

        paymentInfo = `

          <small>
            Pre-book:
            ₹${Number(item.prebook) || 99}
          </small>

          <small>
            Balance on delivery:
            ₹${Math.max(
              (Number(item.price) || 0) -
              (Number(item.prebook) || 0),
              0
            )}
          </small>

        `;

      }


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
              ₹${paymentAmountForItem}
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


    cartCount.textContent =
      cart.length;


    cartTotal.textContent =
      `₹${total}`;


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
        card.querySelectorAll(".sizes button");


      sizeButtons.forEach(button => {

        button.addEventListener(
          "click",
          () => {

            sizeButtons.forEach(btn => {

              btn.classList.remove("selected");

            });


            button.classList.add("selected");

          }
        );

      });

    });


  /* =========================================
     PRODUCT 3 PAYMENT METHOD
     
     We add the choice when Product 3
     is added to cart.
  ========================================= */

  function askProduct3PaymentMethod() {

    const choice =
      window.prompt(
        "RED DRAGON VINTAGE\n\n" +
        "Choose payment method:\n\n" +
        "1 = PREPAID\n" +
        "2 = COD (Cash On Delivery)\n\n" +
        "Enter 1 or 2:"
      );


    if (choice === "1") {

      return {
        method: "prepaid",
        shipping: PRODUCT_3_PREPAID_SHIPPING
      };

    }


    if (choice === "2") {

      return {
        method: "cod",
        shipping: PRODUCT_3_COD_SHIPPING
      };

    }


    alert(
      "Please select either Prepaid or COD."
    );


    return null;

  }


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


          const productId =
            card.dataset.productId || "";


          const price =
            Number(card.dataset.price) || 399;


          const prebook =
            Number(card.dataset.prebook) || 99;


          const product = {

            id: productId,

            name:
              card.dataset.name ||
              "Product",

            price: price,

            prebook: prebook,

            size:
              selectedSize.dataset.size ||
              "",

            paymentMethod:
              null,

            shipping: 0

          };


          /* =====================================
             PRODUCT 3
          ===================================== */

          if (productId === "vintage") {

            const paymentChoice =
              askProduct3PaymentMethod();


            if (!paymentChoice) {
              return;
            }


            product.paymentMethod =
              paymentChoice.method;


            product.shipping =
              paymentChoice.shipping;

          }


          /* =====================================
             ADD PRODUCT
          ===================================== */

          cart.push(product);


          updateCart();

          openCart();


          button.textContent =
            "ADDED ✓";


          setTimeout(() => {

            if (productId === "vintage") {

              button.textContent =
                "ADD TO CART — ₹499";

            } else {

              button.textContent =
                "ADD TO CART — ₹99 PRE-BOOK";

            }

          }, 1200);

        }
      );

    });


  /* =========================================
     PRODUCT IMAGE GALLERY
  ========================================= */

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


        image.style.opacity = "0";


        setTimeout(() => {

          image.src = src;

          image.alt = alt;

          label.textContent =
            labelText;

          image.style.opacity = "1";

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


      searchModal.classList.add("open");

      document.body.classList.add("no-scroll");


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
        searchModal.classList.remove("open");
      }

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
        document.querySelectorAll(".product-card");


      let found = false;


      products.forEach(product => {

        const name =
          (
            product.dataset.name ||
            ""
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


      checkoutModal.classList.add("open");

      document.body.classList.add("no-scroll");

    }
  );


  on(
    closeCheckout,
    "click",
    () => {

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
        (sum, item) =>
          sum + (Number(item.price) || 0),
        0
      );


    const totalPayNow =
      calculateCartPaymentTotal();


    /*
      Product 1/2:
      prebook is ₹99.

      Product 3:
      full amount is paid.
    */

    const totalPrebook =
      cart.reduce(
        (sum, item) => {

          if (isProduct3(item)) {
            return sum;
          }

          return (
            sum +
            (Number(item.prebook) || 99)
          );

        },
        0
      );


    const totalShipping =
      cart.reduce(
        (sum, item) =>
          sum + getProductShipping(item),
        0
      );


    const balanceDue =
      Math.max(
        productTotal +
        totalShipping -
        totalPrebook -
        totalPayNow +
        totalPayNow -
        totalPayNow,
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

      /*
        For Product 3 prepaid/COD,
        there is nothing left to pay.

        For Product 1/2,
        remaining balance is product price - ₹99.
      */

      const remainingBalance =
        cart.reduce(
          (sum, item) => {

            if (isProduct3(item)) {
              return sum;
            }

            return (
              sum +
              Math.max(
                (Number(item.price) || 0) -
                (Number(item.prebook) || 99),
                0
              )
            );

          },
          0
        );


      paymentBalance.textContent =
        `₹${remainingBalance}`;

    }


    return {
      productTotal,
      totalPayNow,
      totalPrebook,
      totalShipping
    };

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


      /* =====================================
         CALCULATE ORDER
      ===================================== */

      const orderDetails =
        cart
          .map(
            (item, index) => {

              const shipping =
                getProductShipping(item);


              const payNow =
                getProductPaymentAmount(item);


              return (
                `${index + 1}. ${item.name}\n` +
                `   Size: ${item.size}\n` +
                `   Product Price: ₹${item.price}\n` +
                `   Payment Method: ${
                  isProduct3(item)
                    ? (
                      item.paymentMethod === "cod"
                        ? "COD"
                        : "PREPAID"
                    )
                    : "₹99 PRE-BOOK"
                }\n` +
                `   Shipping: ₹${shipping}\n` +
                `   Pay Now: ₹${payNow}`
              );

            }
          )
          .join("\n\n");


      const productTotal =
        cart.reduce(
          (sum, item) =>
            sum + (Number(item.price) || 0),
          0
        );


      const totalPayNow =
        calculateCartPaymentTotal();


      const totalShipping =
        cart.reduce(
          (sum, item) =>
            sum + getProductShipping(item),
          0
        );


      const totalPrebook =
        cart.reduce(
          (sum, item) => {

            if (isProduct3(item)) {
              return sum;
            }

            return (
              sum +
              (Number(item.prebook) || 99)
            );

          },
          0
        );


      const balanceDue =
        cart.reduce(
          (sum, item) => {

            if (isProduct3(item)) {
              return sum;
            }

            return (
              sum +
              Math.max(
                (Number(item.price) || 0) -
                (Number(item.prebook) || 99),
                0
              )
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
          "Customer submitted payment information. Verify payment manually before confirming the order.";

      }


      /* =====================================
         PAYMENT SCREEN
      ===================================== */

      updatePaymentScreen();


      if (paymentStatus) {
        paymentStatus.textContent = "";
      }


      if (utrInput) {
        utrInput.value = "";
      }


      if (utrTransactionId) {
        utrTransactionId.value = "";
      }


      /* =====================================
         CLOSE CUSTOMER FORM
      ===================================== */

      if (checkoutModal) {

        checkoutModal.classList.remove("open");

      }


      /* =====================================
         OPEN PAYMENT
      ===================================== */

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
    () => {

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

      } catch {

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
    async () => {

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


      paymentSuccess.disabled = true;

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
            (sum, item) =>
              sum +
              (Number(item.price) || 0),
            0
          );


        const totalPayNow =
          calculateCartPaymentTotal();


        const totalShipping =
          cart.reduce(
            (sum, item) =>
              sum +
              getProductShipping(item),
            0
          );


        const balanceDue =
          cart.reduce(
            (sum, item) => {

              if (isProduct3(item)) {
                return sum;
              }


              return (
                sum +
                Math.max(
                  (Number(item.price) || 0) -
                  (Number(item.prebook) || 99),
                  0
                )
              );

            },
            0
          );


        const orderDetails =
          cart
            .map(
              (item, index) => {

                const shipping =
                  getProductShipping(item);


                const payNow =
                  getProductPaymentAmount(item);


                return (
                  `${index + 1}. ${item.name} | ` +
                  `Size: ${item.size} | ` +
                  `Price: ₹${item.price} | ` +
                  `Payment: ${
                    isProduct3(item)
                      ? (
                        item.paymentMethod === "cod"
                          ? "COD"
                          : "PREPAID"
                      )
                      : "₹99 PRE-BOOK"
                  } | ` +
                  `Shipping: ₹${shipping} | ` +
                  `Pay Now: ₹${payNow}`
                );

              }
            )
            .join("\n");


        /* =====================================
           UTR
        ===================================== */

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
           SEND FORM
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
                  .map(error => error.message)
                  .join(" ");

            }

          } catch {
            // Ignore JSON parsing errors.
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


        setTimeout(() => {

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


        }, 1000);


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
    event => {

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
    () => {

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
    event => {

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

});
