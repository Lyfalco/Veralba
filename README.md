# Veralba — website

Static marketing site for the Veralba iOS alarm clock, served by GitHub Pages from `docs/`.

- `docs/index.html` · `privacy.html` · `terms.html` · `contact.html`
- `docs/assets/i18n/<lang>.js` — all texts, 12 languages (tr, en, de, es, fr, it, pt-BR, id, ja, ko, zh-Hans, ar). Language: `?lang=xx`, then saved choice, then browser language.
- `docs/assets/shots/<lang>/` — app screenshots (generated from `marketing/raw` in the app repo).
- Contact form posts to FormSubmit (`formsubmit.co/ajax/ozgurcocuk9@gmail.com`); the first message triggers a one-time activation email.

Publish: repository Settings › Pages › Deploy from branch `main`, folder `/docs`.
URL: https://lyfalco.github.io/Veralba/
