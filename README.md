# Better Build SC — betterbuildsc.com

A rebuild of the existing betterbuildsc.com site in plain HTML, CSS and JavaScript.
The page structure, navigation, copy and photography of the original Wix site are
kept; the presentation, responsiveness and interactions are new.

No build step, no dependencies. Open `index.html` in a browser, or upload the whole
folder to any web host.

## Pages

| File | Replaces (old site) |
| --- | --- |
| `index.html` | `/` |
| `about.html` | `/about` |
| `gallery.html` | `/gallery` |
| `projects.html` | `/projects` |
| `infrared-home-inspections.html` | `/infared-home-inspections` |
| `contact.html` | `/form__map` and `/map` |

Two old URLs were tidied up: the misspelled `infared` slug is now `infrared`, and the
contact page is `contact.html` rather than `form__map`. If you want inbound links and
search rankings to survive, add 301 redirects from the old paths to the new ones.

## Structure

```
index.html … contact.html   the six pages
css/style.css               one stylesheet, sectioned and commented
js/main.js                  one script, one module per feature
images/                     photography, logo, favicon
```

Header and footer markup is repeated in each page (there is no templating layer). If
you change the navigation or footer, change it in all six files.

## One thing to wire up before launch

**The contact form** (`contact.html`) validates in the browser and shows a success
message, but it does not send anything — a static site has no back end. Point it at a
form service or your own handler, e.g. with Formspree:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

then remove the `e.preventDefault()` block in `initForm()` in `js/main.js`, or keep
the JS validation and let it submit once valid. Netlify Forms, Basin and a small PHP
mailer all work the same way.

## Content notes

- All copy, the full project list and the gallery album names come from the current
  site. Two typos were corrected: "Chastworth" → Chatsworth, "Pacific Palasades" →
  Pacific Palisades.
- Photographs are the originals from the live site, re-exported at web sizes. Each
  gallery photo has a 800×600 thumbnail (`*-thumb.jpg`) and a larger version used by
  the lightbox.
- Email and address match the current site: info@betterbuildsc.com, South Carolina.
  License numbers are deliberately not published anywhere on the site.
- The footer year updates itself.

## Features

- Three-slide hero with autoplay, arrows, progress dots, keyboard arrows and swipe;
  pauses on hover and when the tab is hidden.
- Gallery filtering (All / Hotels / Homes) with a lightbox that respects the current
  filter, supports arrow keys, Escape and swipe.
- Off-canvas mobile menu with focus trapping.
- Scroll reveals and counting statistics, both disabled under
  `prefers-reduced-motion`.
- Responsive from 360px up; no horizontal scrolling.

## Fonts

Barlow Condensed and Inter load from Google Fonts. To self-host, download both and
replace the `<link>` in each page's `<head>` with your own `@font-face` rules.
