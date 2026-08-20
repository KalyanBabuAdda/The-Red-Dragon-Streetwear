/* THE RED DRAGON STREETWEAR — COMPLETE JAVASCRIPT */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = id => document.getElementById(id);
  const on = (el, event, fn) => { if (el) el.addEventListener(event, fn); };
  const escapeHtml = value => String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");

  const cartButton=$("cartButton"), cartDrawer=$("cartDrawer"), closeCart=$("closeCart"), overlay=$("overlay");
  const cartItems=$("cartItems"), cartCount=$("cartCount"), cartTotal=$("cartTotal"), checkoutButton=$("checkoutButton");
  const searchButton=$("searchButton"), searchModal=$("searchModal"), closeSearch=$("closeSearch"), searchForm=$("searchForm"), searchInput=$("searchInput"), searchResult=$("searchResult");
  const checkoutModal=$("checkoutModal"), closeCheckout=$("closeCheckout"), customerForm=$("customerForm"), customerSubmit=$("customerSubmit"), customerStatus=$("customerStatus");
  const paymentModal=$("paymentModal"), closePayment=$("closePayment"), paymentAmount=$("paymentAmount"), paymentProductTotal=$("paymentProductTotal"), paymentSuccess=$("paymentSuccess"), paymentStatus=$("paymentStatus");
  const utrId=$("utrId"), copyUpi=$("copyUpi"), successModal=$("successModal"), closeSuccess=$("closeSuccess"), successContinue=$("successContinue"), newsletterForm=$("newsletterForm");

  let cart = [];

  function closeAllOverlays(){
    [searchModal,checkoutModal,paymentModal,successModal].forEach(m=>m && m.classList.remove("open"));
    cartDrawer && cartDrawer.classList.remove("open");
    overlay && overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  function scrollToSection(id){
    const section=$(id);
    if(!section)return;
    section.scrollIntoView({behavior:"smooth",block:"start"});
    try{history.replaceState(null,"",`#${id}`)}catch(e){}
  }

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    on(link,"click",e=>{
      const id=(link.getAttribute("href")||"").slice(1);
      if($(id)){e.preventDefault();scrollToSection(id)}
    });
  });

  function updateCart(){
    if(!cartItems || !cartCount || !cartTotal)return;
    cartItems.innerHTML="";
    if(!cart.length){
      cartItems.innerHTML="<p>Your cart is empty.</p>";
      cartCount.textContent="";
      cartTotal.textContent="₹0";
      checkoutButton && (checkoutButton.disabled=true);
      return;
    }
    let total=0;
    cart.forEach((item,index)=>{
      total+=Number(item.prebook)||0;
      const row=document.createElement("div");
      row.className="cart-product";
      row.innerHTML=`<div class="cart-product-top">
        <div><strong>${escapeHtml(item.name)}</strong>
        <small>Size: ${escapeHtml(item.size)}</small>
        <small>Actual price: ₹${Number(item.price)||0}</small>
        <small>Pre-book: ₹${Number(item.prebook)||0}</small></div>
        <button class="remove-item" type="button" data-index="${index}">REMOVE</button>
      </div>`;
      cartItems.appendChild(row);
    });
    cartCount.textContent=String(cart.length);
    cartTotal.textContent=`₹${total}`;
    checkoutButton && (checkoutButton.disabled=false);
    cartItems.querySelectorAll(".remove-item").forEach(btn=>{
      on(btn,"click",()=>{
        const i=Number(btn.dataset.index);
        if(Number.isInteger(i)){cart.splice(i,1);updateCart()}
      });
    });
  }

  function openCart(){
    cartDrawer && cartDrawer.classList.add("open");
    overlay && overlay.classList.add("active");
    document.body.classList.add("no-scroll");
  }
  function closeCartDrawer(){
    cartDrawer && cartDrawer.classList.remove("open");
    overlay && overlay.classList.remove("active");
    if(!searchModal?.classList.contains("open")&&!checkoutModal?.classList.contains("open")&&!paymentModal?.classList.contains("open")&&!successModal?.classList.contains("open")) document.body.classList.remove("no-scroll");
  }

  on(cartButton,"click",openCart);
  on(closeCart,"click",closeCartDrawer);
  on(overlay,"click",closeCartDrawer);

  document.querySelectorAll(".product-card").forEach(card=>{
    const sizes=card.querySelectorAll(".sizes button");
    sizes.forEach(btn=>on(btn,"click",()=>{
      sizes.forEach(x=>x.classList.remove("selected"));
      btn.classList.add("selected");
    }));

    const add=card.querySelector(".add-to-cart");
    on(add,"click",()=>{
      const selected=card.querySelector(".sizes button.selected");
      if(!selected){alert("Please select a size before adding the product to your cart.");return}
      cart.push({
        id:card.dataset.productId||"",
        name:card.dataset.name||"Product",
        price:Number(card.dataset.price)||399,
        prebook:Number(card.dataset.prebook)||99,
        size:selected.dataset.size||""
      });
      updateCart();
      openCart();
      const old=add.textContent;
      add.textContent="ADDED ✓";
      add.disabled=true;
      setTimeout(()=>{add.textContent=old;add.disabled=false},1000);
    });

    const img=card.querySelector(".product-image"), prev=card.querySelector(".gallery-prev"), next=card.querySelector(".gallery-next"), label=card.querySelector(".image-label");
    let back=true;
    function setImage(src,text){
      if(!src)return;
      img.style.opacity="0";
      setTimeout(()=>{img.src=src;img.alt=`${card.dataset.name} ${text.toLowerCase()} view`;label.textContent=text;img.style.opacity="1"},100);
    }
    on(prev,"click",()=>{back=!back;setImage(back?img.dataset.back:img.dataset.front,back?"BACK":"FRONT")});
    on(next,"click",()=>{back=!back;setImage(back?img.dataset.back:img.dataset.front,back?"BACK":"FRONT")});
    on(img,"click",()=>{back=!back;setImage(back?img.dataset.back:img.dataset.front,back?"BACK":"FRONT")});
  });

  on(searchButton,"click",()=>{
    searchModal?.classList.add("open");document.body.classList.add("no-scroll");setTimeout(()=>searchInput?.focus(),100);
  });
  on(closeSearch,"click",()=>{searchModal?.classList.remove("open");document.body.classList.remove("no-scroll")});
  on(searchModal,"click",e=>{if(e.target===searchModal){searchModal.classList.remove("open");document.body.classList.remove("no-scroll")}});

  on(searchForm,"submit",e=>{
    e.preventDefault();
    const q=(searchInput?.value||"").trim().toLowerCase();
    if(!q){searchResult.textContent="Please enter a product name.";return}
    const products=[...document.querySelectorAll(".product-card")];
    const found=products.find(p=>(p.dataset.name||"").toLowerCase().includes(q));
    if(found){
      found.scrollIntoView({behavior:"smooth",block:"center"});
      searchResult.textContent="Product found.";
      setTimeout(()=>{searchModal.classList.remove("open");document.body.classList.remove("no-scroll")},500);
    }else searchResult.textContent="No matching product found.";
  });

  on(checkoutButton,"click",()=>{
    if(!cart.length){alert("Your cart is empty. Please add a product first.");return}
    closeCartDrawer();
    checkoutModal?.classList.add("open");
    document.body.classList.add("no-scroll");
  });

  on(closeCheckout,"click",()=>{checkoutModal?.classList.remove("open");document.body.classList.remove("no-scroll")});

  on(customerForm,"submit",async e=>{
    e.preventDefault();
    if(!cart.length){alert("Your cart is empty.");return}

    if(!customerForm.checkValidity()){customerForm.reportValidity();return}

    const details=cart.map(item=>`${item.name} | Size: ${item.size} | Actual Price: ₹${item.price} | Pre-book: ₹${item.prebook}`).join("\n");
    const prebook=cart.reduce((s,i)=>s+(Number(i.prebook)||0),0);
    const productTotal=cart.reduce((s,i)=>s+(Number(i.price)||0),0);
    $("orderDetails").value=details;
    $("prebookAmount").value=`₹${prebook}`;

    customerSubmit.disabled=true;
    customerSubmit.textContent="SENDING DETAILS...";
    customerStatus.textContent="";

    try{
      const response=await fetch(customerForm.action,{
        method:"POST",
        body:new FormData(customerForm),
        headers:{Accept:"application/json"}
      });
      if(!response.ok)throw new Error("Formspree submission failed");

      paymentAmount.textContent=`₹${prebook}`;
      paymentProductTotal.textContent=`₹${productTotal}`;
      paymentStatus.textContent="Customer details received. Complete the payment, then enter your UTR.";
      utrId.value="";
      paymentSuccess.disabled=true;
      paymentSuccess.textContent="ENTER UTR TO COMPLETE ORDER";
      checkoutModal.classList.remove("open");
      paymentModal.classList.add("open");
      document.body.classList.add("no-scroll");
    }catch(err){
      console.error(err);
      customerStatus.textContent="We could not send your details. Please check your internet connection and try again.";
    }finally{
      customerSubmit.disabled=false;
      customerSubmit.textContent="CONTINUE TO PAYMENT";
    }
  });

  on(closePayment,"click",()=>{paymentModal?.classList.remove("open");document.body.classList.remove("no-scroll")});

  on(copyUpi,"click",async()=>{
    try{
      await navigator.clipboard.writeText("8919131887@axl");
      copyUpi.textContent="COPIED ✓";
      setTimeout(()=>copyUpi.textContent="COPY",1200);
    }catch(e){alert("UPI ID: 8919131887@axl")}
  });

  function updateUtrButton(){
    const valid=(utrId?.value||"").trim().length>0;
    paymentSuccess.disabled=!valid;
    paymentSuccess.textContent=valid?"COMPLETE ORDER ✓":"ENTER UTR TO COMPLETE ORDER";
  }
  on(utrId,"input",updateUtrButton);

  on(paymentSuccess,"click",()=>{
    const utr=(utrId?.value||"").trim();
    if(!utr){alert("Please enter your UTR / Transaction ID before completing the order.");utrId?.focus();return}

    paymentStatus.textContent="UTR received. Your order has been recorded for manual payment verification.";
    paymentSuccess.disabled=true;
    paymentSuccess.textContent="ORDER RECEIVED ✓";

    setTimeout(()=>{
      paymentModal.classList.remove("open");
      successModal.classList.add("open");
      document.body.classList.add("no-scroll");
      cart=[];
      updateCart();
      utrId.value="";
      updateUtrButton();
    },700);
  });

  function closeSuccessModal(){
    successModal?.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  on(closeSuccess,"click",closeSuccessModal);
  on(successContinue,"click",closeSuccessModal);

  on(newsletterForm,"submit",e=>{
    e.preventDefault();
    const input=newsletterForm.querySelector("input");
    if(input){input.value="";alert("Thanks for subscribing!")}
  });

  updateCart();
});
