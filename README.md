# Personal Developer Portfolio

A premium, dark-themed personal portfolio website for a Full Stack Developer
specialising in ERP systems, ASP.NET Core MVC, SQL Server database
development, business dashboards and reporting systems.

Live site: **https://hania.onrender.com/**

## Tech Stack

- HTML5 — semantic markup, no framework
- CSS3 — custom properties, glassmorphism cards, responsive layout
- Vanilla JavaScript — smooth scrolling, typing effect, mouse-spotlight
  cards, scroll-reveal animations, contact form (mailto)
- Google Fonts — Sora, Manrope, JetBrains Mono

No build step and no backend. The site is fully static.

## Project Structure

```
.
├── index.html              # Page structure and content
├── assets/
│   ├── css/
│   │   └── style.css       # All styling (theme, layout, animations)
│   ├── js/
│   │   └── main.js         # Interactions (scroll, spotlight, form)
│   └── images/             # Images and media assets
├── libs/                   # Third-party libraries (when added)
├── .gitignore
└── README.md
```

## Run Locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

then visit http://localhost:8000

## Deployment

Deployed as a free static site on [Render](https://render.com).
Every push to the `main` branch auto-deploys.

## Contact

- Email: hamidraza2048@gmail.com
- GitHub: https://github.com/Hamid2048
