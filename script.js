/* =========================================
   THE RED DRAGON STREETWEAR
   COMPLETE JAVASCRIPT
   PRODUCT 1 & 2 = ₹99 PRE-BOOK
   PRODUCT 3 = FULL PRICE + PREPAID / COD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =========================================
     CONFIGURATION
  ========================================= */

  // Change this number if your COD shipping charge is different.
  const COD_SHIPPING_CHARGE = 40;

  // Prepaid shipping charge.
  // Change to your actual prepaid shipping charge if applicable.
  const PREPAID_SHIPPING_CHARGE = 0;


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
     PAYMENT METHOD UI
     
     We create the payment-method selector
     dynamically so you don't have to manually
     edit the HTML payment section.
  ========================================= */

  function createPaymentMethodSelector() {

    if (!paymentModal) {
      return;
    }

    // Don't create twice.
    if (get("paymentMethodSection")) {
      return;
    }

    const paymentBox =
      paymentModal.querySelector(".payment-box");

    if (!paymentBox) {
      return;
    }

    const section =
      document.createElement("div");

    section.id = "paymentMethodSection";

    section.style.marginTop = "20px";
    section.style.marginBottom = "20px";
    section.style.padding = "16px";
    section.style.border = "1px solid rgba(255,255,255,0.15)";
    section.style.borderRadius = "10px";

    section.innerHTML = `

      <div style="
        font-size:12px;
        letter-spacing:1px;
        font-weight:700;
        margin-bottom:12px;
      ">
        PAYMENT METHOD
      </div>

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      ">

        <label style="
          flex:1;
          min-width:130px;
          cursor:pointer;
        ">

          <input
            type="radio"
            name="paymentMethod"
            value="prepaid"
            id="paymentPrepaid"
            checked
          >

          <span style="
            display:block;
            padding:12px;
            border:1px solid rgba(255,255,255,0.2);
            border-radius:8px;
            margin-top:5px;
          ">
            PREPAID
            <small style="
              display:block;
              margin-top:5px;
              opacity:.7;
            ">
              Pay online
            </small>
          </span>

        </label>


        <label style="
          flex:1;
          min-width:130px;
          cursor:pointer;
        ">

          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            id="paymentCOD"
          >

          <span style="
            display:block;
            padding:12px;
            border:1px solid rgba(255,255,255,0.2);
            border-radius:8px;
            margin-top:5px;
          ">
            COD
            <small style="
              display:block;
              margin-top:5px;
              opacity:.7;
            ">
              ₹${COD_SHIPPING_CHARGE} shipping applicable
            </small>
          </span>

        </label>

      </div>

      <div
        id="shippingChargeDisplay"
        style="
          margin-top:12px;
          font-size:13px;
          opacity:.8;
        "
      ></div>

    `;

    const utrSection =
      paymentBox.querySelector(".utr-section");

    if (utrSection) {
      paymentBox.insertBefore(
        section,
        utrSection
      );
    } else {
      paymentBox.appendChild(section);
    }


    const prepaidRadio =
      get("paymentPrepaid");

    const codRadio =
      get("paymentCOD");


    on(
      prepaidRadio,
      "change",
      updatePaymentMethodUI
    );

    on(
      codRadio,
      "change",
      updatePaymentMethodUI
    );

  }


  function getSelectedPaymentMethod() {

    const selected =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );

    return selected
      ? selected.value
      : "prepaid";

  }


  function updatePaymentMethodUI() {

    if (!cart.length) {
      return;
    }

    const method =
      getSelectedPaymentMethod();

    const productTotal =
      cart.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0),
        0
      );

    const prebookTotal =
      cart.reduce(
        (sum, item) =>
          sum + (Number(item.prebook) || 0),
        0
      );

    /*
      Product 3 is a full-payment product.
      Product 1 & 2 are pre-book products.
    */

    const hasFullPaymentProduct =
      cart.some(
        item => item.prebook === 0
      );

    let shipping = 0;

    if (hasFullPaymentProduct) {

      if (method === "cod") {
        shipping = COD_SHIPPING_CHARGE;
      } else {
        shipping = PREPAID_SHIPPING_CHARGE;
      }

    }


    const amountDue =
      hasFullPaymentProduct
        ? productTotal + shipping
        : prebookTotal;


    if (paymentAmount) {
      paymentAmount.textContent =
        `₹${amountDue}`;
    }


    if (paymentProductTotal) {
      paymentProductTotal.textContent =
        `₹${productTotal}`;
    }


    if (paymentPrebookTotal) {

      if (hasFullPaymentProduct) {

        paymentPrebookTotal.textContent =
          "₹0";

      } else {

        paymentPrebookTotal.textContent =
          `₹${prebookTotal}`;

      }

    }


    if (paymentBalance) {

      const balance =
        Math.max(
          productTotal - prebookTotal,
          0
        );

      paymentBalance.textContent =
        `₹${balance}`;

    }


    const shippingDisplay =
      get("shippingChargeDisplay");

    if (shippingDisplay) {

      if (hasFullPaymentProduct) {

        shippingDisplay.textContent =
          method === "cod"
            ? `COD SHIPPING CHARGE: ₹${COD_SHIPPING_CHARGE}`
            : `PREPAID SHIPPING CHARGE: ₹${PREPAID_SHIPPING_CHARGE}`;

      } else {

        shippingDisplay.textContent =
          "Shipping charges will be applicable at dispatch.";

      }

    }


    /*
      COD does not require UTR.
      Prepaid requires UTR.
    */

    const utrSection =
      paymentModal?.querySelector(".utr-section");

    const paymentInstruction =
      paymentModal?.querySelector(".payment-instruction");

    const upiBox =
      paymentModal?.querySelector(".upi-box");

    const qrBox =
      paymentModal?.querySelector(".qr-placeholder");


    if (method === "cod") {

      if (utrSection) {
        utrSection.style.display = "none";
      }

      if (upiBox) {
        upiBox.style.display = "none";
      }

      if (qrBox) {
        qrBox.style.display = "none";
      }

      if (paymentInstruction) {

        paymentInstruction.textContent =
          `You selected Cash On Delivery. ₹${COD_SHIPPING_CHARGE} COD shipping charges are applicable. You do not need to make an online payment or submit a UTR.`;

      }

      if (paymentSuccess) {

        paymentSuccess.textContent =
          "PLACE COD ORDER";

      }

    } else {

      if (utrSection) {
        utrSection.style.display = "";
      }

      if (upiBox) {
        upiBox.style.display = "";
      }

      if (qrBox) {
        qrBox.style.display = "";
      }

      if (paymentInstruction) {

        if (hasFullPaymentProduct) {

          paymentInstruction.textContent =
            `Pay ₹${amountDue} using UPI. After the payment is successful, enter your UTR / Transaction ID below.`;

        } else {

          paymentInstruction.textContent =
            `Send the ₹${prebookTotal} pre-booking amount using UPI. After the payment is successful, enter your UTR / Transaction ID below.`;

        }

      }

      if (paymentSuccess) {

        paymentSuccess.textContent =
          "SUBMIT UTR & PLACE ORDER";

      }

    }

  }


  createPaymentMethodSelector();


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


    let cartPayableTotal = 0;


    cart.forEach((item, index) => {

      const isFullPayment =
        Number(item.prebook) === 0;


      const amountShown =
        isFullPayment
          ? Number(item.price)
          : Number(item.prebook);


      cartPayableTotal +=
        amountShown;


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

            ${
              isFullPayment
                ? `
                  <small>
                    Payment:
                    FULL PRICE
                  </small>

                  <small>
                    Shipping:
                    PREPAID / COD APPLICABLE
                  </small>
                `
                : `
                  <small>
                    Pre-book:
                    ₹${Number(item.prebook) || 0}
                  </small>

                  <small>
                    Balance on delivery:
                    ₹${Math.max(
                      Number(item.price) -
                      Number(item.prebook),
                      0
                    )}
                  </small>
                `
            }

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


    /*
      If Product 3 is present, cart total is
      its actual price.

      Product 1 & 2 continue showing their
      ₹99 pre-book amount.
    */

    cartTotal.textContent =
      `₹${cartPayableTotal}`;


    cartCount.textContent =
      cart.length;


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

    cartDrawer.classList.add("open");

    if (overlay) {
      overlay.classList.add("active");
    }

    document.body.classList.add("no-scroll");

  }


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


          const productId =
            card.dataset.productId || "";


          /*
            PRODUCT 3 / VINTAGE
            --------------------------------
            No ₹99 pre-book.
            Customer pays actual price.
          */

          const isProduct3 =
            productId === "vintage";


          const product = {

            id:
              productId,

            name:
              card.dataset.name ||
              "Product",

            price:
              Number(card.dataset.price) ||
              399,

            prebook:
              isProduct3
                ? 0
                : (
                    Number(card.dataset.prebook) ||
                    99
                  ),

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

            if (isProduct3) {

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
            (item, index) =>
              `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Product Price: ₹${item.price}\n   Pre-booking Amount: ₹${item.prebook}`
          )
          .join("\n\n");


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


      const hasFullPaymentProduct =
        cart.some(
          item => item.prebook === 0
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
          `₹${totalPrebook}`;
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
          `RED DRAGON STREETWEAR — ORDER ${orderReference}`;
      }


      if (productTotalField) {
        productTotalField.value =
          `₹${productTotal}`;
      }


      if (prebookTotalField) {
        prebookTotalField.value =
          `₹${totalPrebook}`;
      }


      if (paymentStatusField) {
        paymentStatusField.value =
          "PENDING — MANUAL PAYMENT VERIFICATION";
      }


      /* =====================================
         RESET PAYMENT METHOD
      ===================================== */

      const prepaidRadio =
        get("paymentPrepaid");

      if (prepaidRadio) {
        prepaidRadio.checked = true;
      }


      /* =====================================
         RESET PAYMENT FIELDS
      ===================================== */

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
         OPEN PAYMENT
      ===================================== */

      if (checkoutModal) {
        checkoutModal.classList.remove("open");
      }


      if (paymentModal) {
        paymentModal.classList.add("open");
      }


      document.body.classList.add("no-scroll");


      updatePaymentMethodUI();

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
     SUBMIT UTR / COD ORDER
  ========================================= */

  on(
    paymentSuccess,
    "click",
    async () => {

      if (!paymentSuccess) {
        return;
      }


      const paymentMethod =
        getSelectedPaymentMethod();


      /* =====================================
         COD ORDER
      ===================================== */

      if (paymentMethod === "cod") {

        await submitOrder({
          utr: "COD",
          paymentMethod: "COD",
          shippingCharge: COD_SHIPPING_CHARGE
        });

        return;

      }


      /* =====================================
         PREPAID ORDER
      ===================================== */

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


      if (!/^[A-Za-z0-9._-]{6,40}$/.test(utr)) {

        if (paymentStatus) {

          paymentStatus.textContent =
            "Please enter a valid UTR / Transaction ID.";

        }


        if (utrInput) {
          utrInput.focus();
        }


        return;

      }


      await submitOrder({
        utr: utr,
        paymentMethod: "PREPAID",
        shippingCharge: PREPAID_SHIPPING_CHARGE
      });

    }
  );


  /* =========================================
     SUBMIT ORDER TO FORMSPREE
  ========================================= */

  async function submitOrder({
    utr,
    paymentMethod,
    shippingCharge
  }) {

    paymentSuccess.disabled = true;

    paymentSuccess.textContent =
      "SUBMITTING...";


    if (paymentStatus) {

      paymentStatus.textContent =
        "Submitting your order...";

    }


    try {

      if (
        !customerForm ||
        !customerForm.action ||
        !customerForm.action.includes(
          "formspree.io"
        )
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


      /* =====================================
         CALCULATE TOTALS
      ===================================== */

      const productTotal =
        cart.reduce(
          (sum, item) =>
            sum +
            (Number(item.price) || 0),
          0
        );


      const totalPrebook =
        cart.reduce(
          (sum, item) =>
            sum +
            (Number(item.prebook) || 0),
          0
        );


      const balanceDue =
        Math.max(
          productTotal -
          totalPrebook,
          0
        );


      const hasFullPaymentProduct =
        cart.some(
          item => item.prebook === 0
        );


      let amountPaidNow = 0;


      if (paymentMethod === "COD") {

        amountPaidNow = 0;

      } else if (hasFullPaymentProduct) {

        amountPaidNow =
          productTotal +
          shippingCharge;

      } else {

        amountPaidNow =
          totalPrebook;

      }


      const finalOrderTotal =
        paymentMethod === "COD"
          ? productTotal + shippingCharge
          : amountPaidNow;


      /* =====================================
         ORDER ITEMS
      ===================================== */

      const orderDetails =
        cart
          .map(
            (item, index) => {

              const isFullPayment =
                Number(item.prebook) === 0;

              return (
                `${index + 1}. ${item.name} | Size: ${item.size} | Product Price: ₹${item.price} | ` +
                (
                  isFullPayment
                    ? "FULL PAYMENT PRODUCT"
                    : `Pre-book: ₹${item.prebook} | Balance: ₹${Math.max(item.price - item.prebook, 0)}`
                )
              );

            }
          )
          .join("\n");


      /* =====================================
         UPDATE HIDDEN FIELDS
      ===================================== */

      if (utrTransactionId) {
        utrTransactionId.value =
          utr;
      }


      if (emailSubject) {

        emailSubject.value =
          `RED DRAGON STREETWEAR — ORDER ${reference} — ${paymentMethod}`;

      }


      if (replyTo) {

        replyTo.value =
          email !== "Not provided"
            ? email
            : "";

      }


      if (paymentStatusField) {

        paymentStatusField.value =
          paymentMethod === "COD"
            ? "COD ORDER — PAYMENT ON DELIVERY"
            : "PENDING — MANUAL PAYMENT VERIFICATION";

      }


      if (productTotalField) {

        productTotalField.value =
          `₹${productTotal}`;

      }


      if (prebookTotalField) {

        prebookTotalField.value =
          `₹${totalPrebook}`;

      }


      if (verificationNoteField) {

        verificationNoteField.value =
          paymentMethod === "COD"
            ? `COD order. ₹${COD_SHIPPING_CHARGE} COD shipping charges applicable. Collect payment on delivery.`
            : "UTR received. Verify the payment manually in the UPI/bank account before confirming the order.";

      }


      /* =====================================
         CREATE CLEAN RECEIPT
      ===================================== */

      if (orderReceipt) {

        orderReceipt.value = [

          "=============================================",
          "           RED DRAGON STREETWEAR",
          "                 ORDER RECEIPT",
          "=============================================",

          `ORDER REFERENCE : ${reference}`,

          `ORDER STATUS    : ${
            paymentMethod === "COD"
              ? "COD ORDER — PAYMENT ON DELIVERY"
              : "PENDING MANUAL VERIFICATION"
          }`,

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

          `Pre-booking Paid: ₹${totalPrebook}`,

          `Balance Due     : ₹${balanceDue}`,

          `Payment Method  : ${paymentMethod}`,

          `Shipping Charge : ₹${shippingCharge}`,

          `Amount Paid Now : ₹${amountPaidNow}`,

          `Final Order Total: ₹${finalOrderTotal}`,

          "",

          "PAYMENT VERIFICATION",
          "---------------------------------------------",

          `UTR / Txn ID    : ${utr}`,

          `Payment Status  : ${
            paymentMethod === "COD"
              ? "COD — PAYMENT TO BE COLLECTED ON DELIVERY"
              : "PENDING — VERIFY MANUALLY"
          }`,

          "",

          "ACTION REQUIRED",

          paymentMethod === "COD"
            ? `Dispatch COD order. Collect ₹${finalOrderTotal} from customer on delivery.`
            : "Check the UTR against the payment received before confirming the order.",

          "============================================="

        ].join("\n");

      }


      /* =====================================
         SEND FORM TO FORMSPREE
      ===================================== */

      const formData =
        new FormData(customerForm);


      /*
        Add additional explicit fields.
      */

      formData.set(
        "paymentMethod",
        paymentMethod
      );


      formData.set(
        "shippingCharge",
        `₹${shippingCharge}`
      );


      formData.set(
        "amountPaidNow",
        `₹${amountPaidNow}`
      );


      formData.set(
        "finalOrderTotal",
        `₹${finalOrderTotal}`
      );


      formData.set(
        "utrTransactionId",
        utr
      );


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
                  error =>
                    error.message
                )
                .join(" ");

          }

        } catch {
          // Response was not JSON.
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
          paymentMethod === "COD"
            ? "COD order submitted successfully. Your order is now in progress."
            : "UTR submitted successfully. Your order is now pending payment verification.";

      }


      paymentSuccess.textContent =
        paymentMethod === "COD"
          ? "COD ORDER SUBMITTED ✓"
          : "UTR SUBMITTED ✓";


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


        cart = [];

        updateCart();


        paymentSuccess.disabled =
          false;


        paymentSuccess.textContent =
          "SUBMIT UTR & PLACE ORDER";


      }, 1000);


    } catch (error) {

      console.error(
        "Order submission error:",
        error
      );


      if (paymentStatus) {

        paymentStatus.textContent =
          error.message ||
          "Unable to submit your order. Please try again.";

      }


      paymentSuccess.disabled =
        false;


      paymentSuccess.textContent =
        getSelectedPaymentMethod() === "cod"
          ? "PLACE COD ORDER"
          : "SUBMIT UTR & PLACE ORDER";

    }

  }


  /* =========================================
     CLOSE PAYMENT
  ========================================= */

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
     SUCCESS MODAL
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
