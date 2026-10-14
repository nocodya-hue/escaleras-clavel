// Escaleras Clavel · menú, cabecera, visor de fotos, formulario a WhatsApp y apariciones
(function () {
  var doc = document.documentElement, cab = document.querySelector('.cabecera');
  doc.classList.add('js');

  // cabecera sólida al bajar (en la portada empieza transparente)
  var barra = document.querySelector('.barra-movil'), umbral = document.querySelector('[data-umbral]');
  function alBajar() {
    var y = window.scrollY;
    if (cab && !cab.classList.contains('siempre')) cab.classList.toggle('solida', y > 40);
    if (barra) barra.classList.toggle('visible', umbral ? umbral.getBoundingClientRect().bottom < 0 : y > 300);
  }
  window.addEventListener('scroll', alBajar, { passive: true }); alBajar();

  // menú móvil
  var ham = document.querySelector('.hamburguesa');
  if (ham) ham.addEventListener('click', function () {
    var a = document.body.classList.toggle('menu-abierto');
    ham.setAttribute('aria-expanded', a ? 'true' : 'false');
  });
  document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-abierto'); }); });
  document.querySelectorAll('.nav__grupo > button').forEach(function (b) {
    b.addEventListener('click', function () { var g = b.parentElement, a = g.classList.toggle('abierto'); b.setAttribute('aria-expanded', a ? 'true' : 'false'); });
  });

  // apariciones
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.revela').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.revela').forEach(function (el) { el.classList.add('visto'); });

  // visor de fotos
  var visor = document.querySelector('.visor');
  if (visor) {
    var img = visor.querySelector('img'), pie = visor.querySelector('p'), lista = [], i = 0, ultimo = null;
    function mostrar(k) {
      i = (k + lista.length) % lista.length;
      var b = lista[i]; img.src = b.dataset.grande; img.alt = b.dataset.alt || ''; pie.textContent = b.dataset.alt || '';
    }
    document.querySelectorAll('[data-grande]').forEach(function (b) {
      b.addEventListener('click', function () {
        lista = Array.prototype.slice.call(b.closest('[data-grupo]').querySelectorAll('[data-grande]'));
        ultimo = b; mostrar(lista.indexOf(b)); visor.classList.add('abierto'); visor.querySelector('.visor__cerrar').focus();
        document.body.style.overflow = 'hidden';
      });
    });
    function cerrar() { visor.classList.remove('abierto'); document.body.style.overflow = ''; img.removeAttribute('src'); if (ultimo) ultimo.focus(); }
    visor.querySelector('.visor__cerrar').addEventListener('click', cerrar);
    visor.querySelector('.visor__ant').addEventListener('click', function () { mostrar(i - 1); });
    visor.querySelector('.visor__sig').addEventListener('click', function () { mostrar(i + 1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrar(); });
    document.addEventListener('keydown', function (e) {
      if (!visor.classList.contains('abierto')) return;
      if (e.key === 'Escape') cerrar(); if (e.key === 'ArrowLeft') mostrar(i - 1); if (e.key === 'ArrowRight') mostrar(i + 1);
    });
    var x0 = null;
    visor.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener('touchend', function (e) { if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) mostrar(i + (d < 0 ? 1 : -1)); x0 = null; });
  }

  // formulario: prepara el mensaje y abre WhatsApp (o el correo)
  document.querySelectorAll('form[data-whatsapp]').forEach(function (f) {
    function mensaje() {
      var d = new FormData(f), l = ['Hola, quería pedir presupuesto a Escaleras Clavel.'];
      [['nombre', 'Nombre'], ['telefono', 'Teléfono'], ['tipo', 'Tipo de obra'], ['lugar', 'Localidad'], ['mensaje', 'Detalles']].forEach(function (c) { var v = (d.get(c[0]) || '').toString().trim(); if (v) l.push(c[1] + ': ' + v); });
      return l.join('\n');
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      window.open('https://wa.me/' + f.dataset.whatsapp + '?text=' + encodeURIComponent(mensaje()), '_blank', 'noopener');
    });
    var correo = f.querySelector('[data-correo]');
    if (correo) correo.addEventListener('click', function (e) {
      e.preventDefault(); if (!f.reportValidity()) return;
      location.href = 'mailto:' + correo.dataset.correo + '?subject=' + encodeURIComponent('Presupuesto de escalera') + '&body=' + encodeURIComponent(mensaje());
    });
  });

  var anio = document.querySelector('[data-anio]'); if (anio) anio.textContent = new Date().getFullYear();
})();

// carrusel de trabajos con flechas circulares y botón de menú de la barra flotante
(function () {
  document.querySelectorAll('[data-carrusel]').forEach(function (c) {
    var pista = c.querySelector('.carrusel__pista'), ant = c.querySelector('[data-ant]'), sig = c.querySelector('[data-sig]');
    function paso() { var b = pista.querySelector('button'); return b ? b.getBoundingClientRect().width + 16 : 300; }
    function estado() { ant.disabled = pista.scrollLeft < 8; sig.disabled = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 8; }
    ant.addEventListener('click', function () { pista.scrollBy({ left: -paso(), behavior: 'smooth' }); });
    sig.addEventListener('click', function () { pista.scrollBy({ left: paso(), behavior: 'smooth' }); });
    pista.addEventListener('scroll', estado, { passive: true }); window.addEventListener('resize', estado); estado();
  });
  var bm = document.querySelector('.bm-menu'), ham = document.querySelector('.hamburguesa');
  if (bm && ham) bm.addEventListener('click', function () { ham.click(); window.scrollTo({ top: window.scrollY }); });
})();
