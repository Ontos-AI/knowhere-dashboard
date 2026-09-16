# Site ships in the dashboard application

The Design Prototype is four Cloudflare apps. The live Site is routes in this application so Login, analytics, locale, and `blog.knowhereto.ai` stay one system. The prototype is the 1:1 visual source of truth, not the deployment topology.

**Considered options:** ship the four Workers as production; port UI into this app. We chose the latter.
