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
   /* Force checkout button to remain visible */
if (checkoutButton) {
  checkoutButton.style.display = "flex";
  checkoutButton.style.visibility = "visible";
  checkoutButton.style.opacity = "1";
}


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

  const utrInput =
    get("utrInput");

  const utrTransactionId =
    get("utrTransactionId");

  const emailSubject =
  get("emailSubject");

const replyTo =
  get("replyTo");

const orderReferenceField =
  get("orderReference");
   
  const orderReceipt =
    get("orderReceipt");
  const paymentStatusField =
    get("paymentStatusField");
  const productTotalField =
    get("productTotalField");
  const prebookTotalField =
    get("prebookTotalField");
  const verificationNoteField =
    get("verificationNoteField");


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
          .map((item, index) =>
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

      // Create a simple reference that you can use to identify the order.
      const orderReference =
        `RD-${Date.now().toString().slice(-8)}`;


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

      if (orderReferenceField) {
        orderReferenceField.value = orderReference;
      }
      const phoneValue = get("phone")?.value.trim() || "Not provided";
      if (replyTo) {
        replyTo.value = email;
      }
      if (emailSubject) {
        emailSubject.value =
          `RED DRAGON STREETWEAR — ORDER ${orderReference} — PAYMENT VERIFICATION PENDING`;
      }
      if (productTotalField) {
        productTotalField.value = `₹${productTotal}`;
      }
      if (prebookTotalField) {
        prebookTotalField.value = `₹${totalPrebook}`;
      }
      if (paymentStatusField) {
        paymentStatusField.value = "PENDING — MANUAL PAYMENT VERIFICATION";
      }
      if (verificationNoteField) {
        verificationNoteField.value =
          "Customer has submitted the UTR. Please verify the payment manually before confirming the order.";
      }

      /* The final receipt is populated after the customer submits the UTR. */


      /* =====================================
         PREPARE PAYMENT SCREEN FIRST
         
         This means the customer is never
         stuck because of Formspree.
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


      /*
        Customer details are intentionally NOT emailed at this stage.
        The complete order receipt is sent only after the customer
        submits the UTR, so you receive one clean verification email
        instead of a duplicate pre-payment email.
      */

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
     SUBMIT UTR / PAYMENT VERIFICATION
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

      /*
        UTRs are normally alphanumeric. Keep validation
        flexible because different UPI apps/banks can use
        different transaction-ID formats.
      */
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

      paymentSuccess.disabled =
        true;

      paymentSuccess.textContent =
        "SUBMITTING...";

      if (paymentStatus) {
        paymentStatus.textContent =
          "Submitting your payment reference for verification...";
      }

      try {

        if (
          customerForm &&
          customerForm.action &&
          customerForm.action.includes(
            "formspree.io"
          )
        ) {

          if (utrTransactionId) {
            utrTransactionId.value = utr;
          }

          if (emailSubject) {
            emailSubject.value =
              `RED DRAGON STREETWEAR — ORDER ${orderReferenceField ? orderReferenceField.value : ""} — UTR ${utr}`;
          }

          if (paymentStatusField) {
            paymentStatusField.value =
              "PENDING — MANUAL PAYMENT VERIFICATION";
          }

          if (verificationNoteField) {
            verificationNoteField.value =
              "UTR received. Verify the payment manually in your UPI/bank account before confirming the order.";
          }

          if (replyTo) {
            replyTo.value = get("email")?.value.trim() || "";
          }

          if (orderReceipt) {
            const fullName = get("fullName")?.value.trim() || "Not provided";
            const email = get("email")?.value.trim() || "Not provided";
            const phone = get("phone")?.value.trim() || "Not provided";
            const address = (get("address")?.value.trim() || "Not provided").replace(/\n/g, " | ");
            const reference = orderReferenceField?.value || "Not provided";
            const productTotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
            const totalPrebook = cart.reduce((sum, item) => sum + (Number(item.prebook) || 0), 0);
            const orderDetails = cart.map((item, index) =>
              `${index + 1}. ${item.name} | Size: ${item.size} | Price: ₹${item.price} | Pre-book: ₹${item.prebook}`
            ).join("\n");

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
              `Pre-booking Paid: ₹${totalPrebook}`,
              `Balance Due     : ₹${Math.max(productTotal - totalPrebook, 0)}`,
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

          const formData = new FormData();

formData.append(
  "name",
  get("fullName")?.value.trim() || ""
);

formData.append(
  "email",
  get("email")?.value.trim() || ""
);

formData.append(
  "message",
  `TEST ORDER - UTR: ${utr}`
);

const response = await fetch(
  "https://formspree.io/f/xkjwpylo",
  {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json"
    }
  }
);

const result = await response.json();

console.log(
  "Formspree response:",
  result
);

if (!response.ok) {
  throw new Error(
    result.error ||
    result.errors?.map(e => e.message).join(", ") ||
    "Formspree submission failed"
  );
}
        } else {

          throw new Error(
            "No Formspree email endpoint is configured."
          );

        }

        if (paymentStatus) {
          paymentStatus.textContent =
            "UTR submitted successfully. Your order is in progress and will be confirmed after we verify your payment.";
        }

        paymentSuccess.textContent =
          "UTR SUBMITTED ✓";

        /*
          The payment screen closes only after the UTR has been
          successfully submitted. The success message is explicitly
          a pending-verification message, not a payment confirmation.
        */
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

        }, 700);

      } catch (error) {

        console.error(
          "UTR could not be submitted:",
          error
        );

        if (paymentStatus) {
          paymentStatus.textContent =
            "We could not submit your UTR. Please check your internet connection and try again.";
        }

        paymentSuccess.disabled =
          false;

        paymentSuccess.textContent =
          "SUBMIT UTR & PLACE ORDER";

      }

    }
  );
/* =========================================
   SUBMIT UTR / PAYMENT VERIFICATION
========================================= */

on(
  paymentSuccess,
  "click",
  async () => {

    if (!paymentSuccess) {
      return;
    }

    const utr = utrInput
      ? utrInput.value.trim()
      : "";

    /* -----------------------------------------
       VALIDATE UTR
    ----------------------------------------- */

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

    /* -----------------------------------------
       PREVENT DOUBLE SUBMISSION
    ----------------------------------------- */

    paymentSuccess.disabled = true;

    paymentSuccess.textContent =
      "SUBMITTING...";

    if (paymentStatus) {
      paymentStatus.textContent =
        "Submitting your payment reference...";
    }

    try {

      /* ---------------------------------------
         CHECK FORMSPREE
      --------------------------------------- */

      if (
        !customerForm ||
        !customerForm.action ||
        !customerForm.action.includes("formspree.io")
      ) {

        throw new Error(
          "Formspree endpoint is missing."
        );

      }

      /* ---------------------------------------
         BASIC CUSTOMER DETAILS
      --------------------------------------- */

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


      /* ---------------------------------------
         CALCULATE ORDER
      --------------------------------------- */

      const productTotal =
        cart.reduce(
          (sum, item) =>
            sum + (Number(item.price) || 0),
          0
        );

      const totalPrebook =
        cart.reduce(
          (sum, item) =>
            sum + (Number(item.prebook) || 0),
          0
        );


      const balanceDue =
        Math.max(
          productTotal - totalPrebook,
          0
        );


      const orderDetails =
        cart
          .map(
            (item, index) =>
              `${index + 1}. ${item.name} | Size: ${item.size} | Price: ₹${item.price} | Pre-book: ₹${item.prebook}`
          )
          .join("\n");


      /* ---------------------------------------
         FILL HIDDEN FIELDS
      --------------------------------------- */

      if (utrTransactionId) {
        utrTransactionId.value = utr;
      }


      if (emailSubject) {
        emailSubject.value =
          `RED DRAGON STREETWEAR — ORDER ${reference} — UTR ${utr}`;
      }


      if (replyTo && email !== "Not provided") {
        replyTo.value = email;
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
          `₹${totalPrebook}`;
      }


      if (verificationNoteField) {
        verificationNoteField.value =
          "UTR received. Verify the payment manually in the UPI/bank account before confirming the order.";
      }


      /* ---------------------------------------
         CREATE CLEAN ORDER RECEIPT
      --------------------------------------- */

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
          `Pre-booking Paid: ₹${totalPrebook}`,
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


      /* ---------------------------------------
         SEND TO FORMSPREE
      --------------------------------------- */

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


      /* ---------------------------------------
         CHECK RESPONSE
      --------------------------------------- */

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
          // Response was not JSON.
        }

        throw new Error(
          errorMessage
        );

      }


      /* ---------------------------------------
         SUCCESS
      --------------------------------------- */

      if (paymentStatus) {
        paymentStatus.textContent =
          "UTR submitted successfully. Your order is now pending payment verification.";
      }


      paymentSuccess.textContent =
        "UTR SUBMITTED ✓";


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
