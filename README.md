# 🎟️ Lottery System Platform

A full-featured lottery management and ticket sales platform built as a **monorepo**, integrating multiple services and clients in a single repository.

---

## 🧩 Project Architecture

The system is composed of four main modules:

- **Backend (NestJS)**  
  Core API responsible for business logic, including raffle management, orders, customers, payments, and service integrations.

- **Frontend Landing (Next.js)**  
  Public-facing website where users can browse available raffles and participate in them.

- **Frontend CRM (Next.js)**  
  Administrative dashboard for managing the platform.

- **Chatbot (TypeScript)**  
  Allows users to purchase tickets through automated interactions.

---

## ⚙️ Technologies

- **TypeScript** across the entire project  
- **NestJS** for the backend  
- **Next.js** for both frontends (Landing & CRM)

---

## 🚀 Features

- Raffle creation and management  
- Ticket purchasing via:
  - Landing page  
  - Chatbot automation  
- Order and customer management  
- CRM dashboard with real-time insights  
- Payment provider integration  
- Centralized monorepo architecture  

---

## 🤖 User Flow

1. Raffles are published on the **landing page**  
2. Users can:
   - Purchase directly from the website  
   - Purchase via the chatbot  
3. Orders are processed and stored in the backend  
4. The CRM dashboard provides full system monitoring  

---

## 🖼️ Overview

![Overview](./Imgs/Overview/crm-raflles,%20order%20checkout,%20order%20completed.png)

---

## 🌐 Landing Page

### Main Header
![Landing Header](./Imgs/Landing%20imgs/1-page-header-main.png)

### Main Section
![Landing Main](./Imgs/Landing%20imgs/2-page-main.png)

### Raffle Details
![Raffle Details](./Imgs/Landing%20imgs/3-raffle-details.png)

### Raffle Footer
![Raffle Footer](./Imgs/Landing%20imgs/4-raffle-footer-details.png)

### Ticket Selection
![Ticket 1](./Imgs/Landing%20imgs/5-ticket-1.png)

![Ticket 2](./Imgs/Landing%20imgs/6-ticket-2.png)

---

## 🧑‍💼 CRM Dashboard

### Panel
![CRM Panel](./Imgs/CRM%20imgs/1-panel.png)

### Raffles Management
![CRM Raffles](./Imgs/CRM%20imgs/2-sorteos.png)

### Ticket Issuance
![CRM Ticket Issuance](./Imgs/CRM%20imgs/3-emision-de-boletos.png)

### Manual Ticket Action
![CRM Manual Ticket](./Imgs/CRM%20imgs/4-emitir-boleto-accion-manual.png)

### Vendors
![CRM Vendors](./Imgs/CRM%20imgs/5-vendedores.png)

### Create Vendor
![CRM Create Vendor](./Imgs/CRM%20imgs/6-crear-vendedor-accion.png)

### Orders
![CRM Orders](./Imgs/CRM%20imgs/7-ordenes.png)

### Order Details
![CRM Order Details](./Imgs/CRM%20imgs/8-revisar-orden-accion.png)

### Customers
![CRM Customers](./Imgs/CRM%20imgs/9-clientes.png)

### Customer Actions
![CRM Customer Actions](./Imgs/CRM%20imgs/10-revisar-client-accion.png)

### Customer Tickets
![CRM Customer Tickets](./Imgs/CRM%20imgs/11-revisar-boletos-del-cliente-accion.png)

### Payment Provider
![CRM Payment Provider](./Imgs/CRM%20imgs/12-proveedor-de-pago.png)

### Chatbot Config
![CRM Chatbot](./Imgs/CRM%20imgs/13-chatbot.png)

### Account Settings
![CRM Settings](./Imgs/CRM%20imgs/14-configuracion-cuenta.png)

---

## 📦 Repository Structure
/backend
/frontend-landing
/frontend-crm
/chatbot