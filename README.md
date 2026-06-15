# PC-Komponenten Preisvergleich-Tool

Ein vollständiges Web-Tool zum Erstellen von PC-Setups mit automatischem Preis-Tracking und Email-Benachrichtigungen bei Preisreduktionen.

## Features

- ✅ Online-Editor für PC-Setups
- ✅ Komponenten-Eingabe mit Auto-Completion
- ✅ Tagesaktuelle Preise von gängigen Shops
- ✅ Preis-Historie und Vergleiche
- ✅ Email-Benachrichtigungen bei Preissenkungen
- ✅ Dashboard mit Setup-Übersicht

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Scraping**: Puppeteer/Cheerio
- **Email**: Nodemailer

## Getting Started

```bash
# Clone & Setup
git clone https://github.com/schorfboy/pc-price-tracker.git
cd pc-price-tracker

# Docker Compose
docker-compose up

# App lädt unter http://localhost:3000
```

## Architektur

```
frontend/    - React UI
backend/     - Express API
crawler/     - Price Scraper Service
db/          - Database Migrations
```

## Lizenz

MIT
