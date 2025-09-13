/* basic helpers */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

/* mobile nav toggle */
const navToggle = qs('.nav-toggle');
navToggle?.addEventListener('click', ()=>{
  const nav = qs('.nav');
  if(!nav) return;
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

/* set year */
qs('#year').textContent = new Date().getFullYear();

/* Skills animation */
window.addEventListener('load', ()=>{
  qsa('.skill-fill').forEach(el=>{
    const pct = el.getAttribute('data-percent') || '0';
    setTimeout(()=> el.style.width = pct + '%', 200);
  });
});

/* Portfolio filter */
const filterBtns = qsa('.filter-btn');
const projects = qsa('.project-item');

filterBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projects.forEach(p=>{
      const cat = p.dataset.category;
      if(filter === 'all' || filter === cat) p.style.display = '';
      else p.style.display = 'none';
    });
  });
});

/* Image lightbox */
const imgModal = qs('#lightbox-modal');
const imgEl = qs('#lightbox-img');
const imgCaption = qs('#lightbox-caption');
qsa('.lightbox').forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    const src = link.getAttribute('href');
    const alt = link.closest('.project-item').querySelector('img').alt || '';
    imgEl.src = src;
    imgCaption.textContent = alt;
    imgModal.style.display = 'flex';
    imgModal.setAttribute('aria-hidden','false');
  });
});

/* Video modal */
const videoModal = qs('#video-modal');
const videoFrame = qs('#video-frame');
qsa('.lightbox-video').forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    const url = link.dataset.videoUrl;
    videoFrame.src = url + '?autoplay=1';
    videoModal.style.display = 'flex';
    videoModal.setAttribute('aria-hidden','false');
  });
});

/* close modal */
qsa('.modal-close').forEach(btn=>{
  btn.addEventListener('click', closeModals);
});
['click','keydown'].forEach(evt=>{
  window.addEventListener(evt, (e)=>{
    // close on ESC
    if(evt === 'keydown' && e.key !== 'Escape') return;
    if(evt === 'click' && (e.target.classList.contains('modal'))) {
      // clicked outside modal content
    }
    closeModals();
  });
});
function closeModals(){
  [imgModal, videoModal].forEach(m=>{
    if(!m) return;
    m.style.display = 'none';
    m.setAttribute('aria-hidden','true');
  });
  if(videoFrame) videoFrame.src = '';
}

/* Contact form demo handler */
function handleContact(e){
  e.preventDefault();
  const name = qs('#name').value.trim();
  const email = qs('#email').value.trim();
  const message = qs('#message').value.trim();
  const result = qs('#contactResult');
  if(!name || !email || !message){
    result.textContent = 'Please fill all fields.';
    return;
  }
  // Demo: show success message (replace with real API/email handling)
  result.textContent = 'Thanks, your message was received (demo).';
  e.target.reset();
}

/* accessibility: keyboard close for modals */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModals();
});

/* Scroll reveal animations */
const revealEls = qsa('.fade-up, .project-item');
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add('show');
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* Typing effect in hero */
document.addEventListener('DOMContentLoaded', () => {
  const heroText = qs('.typing');
  if (heroText) {
    setTimeout(() => {
      heroText.style.width = heroText.scrollWidth + 'px';
    }, 300);
  }
});

/* =========================
   IMAGE GALLERY LIGHTBOX
========================= */
const galleryModal = qs('#gallery-modal');
const galleryImg = qs('#gallery-img');
const galleryCaption = qs('#gallery-caption');
const prevBtn = qs('#gallery-prev');
const nextBtn = qs('#gallery-next');
const zoomInBtn = qs('#zoom-in');
const zoomOutBtn = qs('#zoom-out');
const zoomResetBtn = qs('#zoom-reset');

let galleryItems = qsa('.project-item[data-category="graphics"], .project-item[data-category="web"], .project-item[data-category="video"]');
let currentIndex = 0;
let zoomLevel = 1;

// Open gallery
galleryItems.forEach((item, idx) => {
  const link = item.querySelector('img');
  link.addEventListener('click', e => {
    e.preventDefault();
    openGallery(idx);
  });
});

function openGallery(index){
  currentIndex = index;
  const item = galleryItems[currentIndex];
  const img = item.querySelector('img');
  galleryImg.src = img.src.replace('-thumb',''); // if you use big versions
  galleryCaption.textContent = img.alt;
  zoomLevel = 1;
  galleryImg.style.transform = 'scale(1)';
  galleryModal.style.display = 'flex';
  galleryModal.setAttribute('aria-hidden','false');
}

// Close gallery
qs('#gallery-modal .modal-close').addEventListener('click', closeGallery);
function closeGallery(){
  galleryModal.style.display = 'none';
  galleryModal.setAttribute('aria-hidden','true');
}

// Navigation
prevBtn.addEventListener('click', ()=> showGallery(currentIndex-1));
nextBtn.addEventListener('click', ()=> showGallery(currentIndex+1));
function showGallery(newIndex){
  if(newIndex < 0) newIndex = galleryItems.length-1;
  if(newIndex >= galleryItems.length) newIndex = 0;
  openGallery(newIndex);
}

// Zoom controls
zoomInBtn.addEventListener('click', ()=> adjustZoom(0.2));
zoomOutBtn.addEventListener('click', ()=> adjustZoom(-0.2));
zoomResetBtn.addEventListener('click', ()=> resetZoom());

function adjustZoom(delta){
  zoomLevel += delta;
  if(zoomLevel < 0.5) zoomLevel = 0.5;
  if(zoomLevel > 3) zoomLevel = 3;
  galleryImg.style.transform = `scale(${zoomLevel})`;
}
function resetZoom(){
  zoomLevel = 1;
  galleryImg.style.transform = 'scale(1)';
}

// Keyboard shortcuts
document.addEventListener('keydown', e=>{
  if(galleryModal.style.display !== 'flex') return;
  if(e.key === 'Escape') closeGallery();
  if(e.key === 'ArrowRight') showGallery(currentIndex+1);
  if(e.key === 'ArrowLeft') showGallery(currentIndex-1);
  if(e.key === '+') adjustZoom(0.2);
  if(e.key === '-') adjustZoom(-0.2);
});
