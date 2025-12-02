document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {id:'p1',title:'Batido Proteico - Vainilla',price:24.99,desc:'Proteína aislada, 25g por porción. Sabor vainilla.',img:'assets/protein-vanilla.jpg'},
    {id:'p2',title:'Multivitamínico Diario',price:14.50,desc:'Vitaminas esenciales y minerales para energía diaria.',img:'assets/multivitamin.jpg'},
    {id:'p3',title:'Pre-Entreno Citrus',price:19.99,desc:'Energía y foco para tus entrenamientos.',img:'assets/preworkout.jpg'},
    {id:'p4',title:'Smoothie Verde Ready',price:6.50,desc:'Smoothie listo vegetal.',img:'assets/smoothie-green.jpg'}
  ];
  const cart={};
  const productGrid=document.getElementById('productGrid');
  const cartBtn=document.getElementById('cartBtn');
  const cartCount=document.getElementById('cartCount');
  const cartModal=document.getElementById('cartModal');
  const cartItems=document.getElementById('cartItems');
  const cartTotal=document.getElementById('cartTotal');
  const closeModalBtn=document.querySelector('.close-modal');
  const clearCartBtn=document.getElementById('clearCartBtn');
  const checkoutBtn=document.getElementById('checkoutBtn');

  function renderProducts(){
    productGrid.innerHTML='';
    products.forEach(p=>{
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML=`<img src="${p.img}" alt="${p.title}" onerror="this.src='assets/placeholder.png'">
      <h3>${p.title}</h3><p class="meta">${p.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="btn add-btn" data-id="${p.id}">Añadir</button></div>`;
      productGrid.appendChild(card);
    });
    document.querySelectorAll('.add-btn').forEach(btn=>{
      btn.addEventListener('click',e=>addToCart(e.currentTarget.dataset.id));
    });
  }

  function addToCart(id){
    const p=products.find(x=>x.id===id);
    if(!cart[id]) cart[id]={...p,qty:0};
    cart[id].qty++;
    updateCartUI();
  }

  function updateCartUI(){
    const items=Object.values(cart);
    cartCount.textContent=items.reduce((s,i)=>s+i.qty,0);
    cartItems.innerHTML='';
    let total=0;
    if(items.length===0){cartItems.innerHTML='<p>Tu carrito está vacío.</p>';}
    else{
      items.forEach(i=>{
        total+=i.qty*i.price;
        const div=document.createElement('div');
        div.style.display='flex';div.style.justifyContent='space-between';div.style.marginBottom='10px';
        div.innerHTML=`<div><strong>${i.title}</strong><br><small>${i.qty} x $${i.price.toFixed(2)}</small></div>
        <div><button class="btn dec" data-id="${i.id}">-</button>
        <button class="btn inc" data-id="${i.id}">+</button></div>`;
        cartItems.appendChild(div);
      });
      cartItems.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',e=>{cart[e.dataset.id].qty++;updateCartUI();}));
      cartItems.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',e=>{
        const id=e.dataset.id;cart[id].qty--; if(cart[id].qty<=0) delete cart[id]; updateCartUI();
      }));
    }
    cartTotal.textContent=`$${total.toFixed(2)}`;
  }

  cartBtn.addEventListener('click',()=>{cartModal.setAttribute('aria-hidden','false');});
  closeModalBtn.addEventListener('click',()=>cartModal.setAttribute('aria-hidden','true'));
  clearCartBtn.addEventListener('click',()=>{for(const k in cart) delete cart[k];updateCartUI();});
  checkoutBtn.addEventListener('click',()=>{
    const items=Object.values(cart);
    if(!items.length) return alert('Carrito vacío');
    let body='Pedido:%0D%0A'; items.forEach(i=>body+=`${i.qty}x ${i.title}%0D%0A`);
    window.location.href=`mailto:ventas@tudominio.com?subject=Pedido&body=${body}`;
  });

  document.getElementById('year').textContent=new Date().getFullYear();
  renderProducts();
});
