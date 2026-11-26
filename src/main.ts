import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('No se encontró el contenedor principal.');

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <div class="brand" aria-label="Studium">
        <span class="brand-mark" aria-hidden="true">✦</span>
        <span>Studium</span>
      </div>
      <span class="status">Versión inicial · 0.1.0</span>
    </header>

    <section class="welcome" aria-labelledby="welcome-title">
      <div class="eyebrow">TU ESPACIO DE APRENDIZAJE</div>
      <h1 id="welcome-title">Un paso a la vez.</h1>
      <p>Estamos preparando Studium. Esta base inicial confirma que la aplicación y su interfaz pueden arrancar en escritorio y móvil.</p>
      <div class="starter-card">
        <div class="book-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M8 13c10-3 18 0 24 5v34c-7-5-15-7-24-4V13Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
            <path d="M56 13c-10-3-18 0-24 5v34c7-5 15-7 24-4V13Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
            <path d="M32 18v34" stroke="currentColor" stroke-width="2"/>
            <path d="m42 9 2.5 5.5L50 17l-5.5 2.5L42 25l-2.5-5.5L34 17l5.5-2.5L42 9Z" fill="#e5ad58"/>
          </svg>
        </div>
        <div>
          <h2>Tu biblioteca comienza aquí</h2>
          <p>La estructura base está lista para seguir construyendo.</p>
        </div>
      </div>
    </section>

    <footer>Studium · Construyendo la primera versión</footer>
  </main>
`;
