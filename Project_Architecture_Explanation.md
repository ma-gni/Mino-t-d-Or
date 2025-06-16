
# 🧱 Project Architecture: Layer-by-Layer Flow

This document explains the flow of your Spring Boot project's architecture, based on the final diagram provided.

---

## 🔹 1. Controller → DTO → Service

- The Controller receives HTTP requests from the client (e.g., JSON body).
- It uses `@RequestBody` to deserialize data into a DTO (Data Transfer Object).
- The DTO is passed to the **Service layer** for processing.

🧠 *"Client → JSON → DTO → Service"*

---

## 🔹 2. Service → Mapper → Entity

- The Service layer calls a **Mapper** to convert the DTO to an Entity.
- This prepares the data for persistence in the database.

🧠 *"Service → uses Mapper → DTO becomes Entity"*

---

## 🔹 3. Service → Repository

- The Service passes the Entity to the Repository layer.
- The Repository (usually extends `JpaRepository`) handles database interactions.

🧠 *"Service → tells Repository to save/fetch Entity"*

---

## 🔹 4. Repository ↔ Database

- The Repository communicates directly with the database.
- It performs CRUD operations and returns Entity objects.

🧠 *"Repository ↔ Database → Entity is stored or retrieved"*

---

## 🔹 5. Entity → Mapper → DTO → Controller

- After operations, the Entity is mapped back to a DTO.
- The Controller returns the DTO as an HTTP response.

🧠 *"Entity → mapped to DTO → Controller returns response"*

---

## 🔐 6. Security Layer (wraps everything)

- Every request passes through Spring Security filters first.
- It checks for:
  - JWT Token validity
  - Roles/permissions
- If valid, the request proceeds to the Controller. Otherwise, it’s blocked.

🧠 *"Security verifies who you are & what you're allowed to do"*

---

## ⚙️ 7. Configuration Layer

- Configures the behavior of:
  - Security (`SecurityFilterChain`, JWT filters, role rules)
  - Password encoding (e.g., BCrypt)
  - CORS settings
  - Public/private routes

🧠 *"Configuration = the rules of how the system behaves"*

---

## ✅ Summary of Flow:

```text
Client
  ↓
Controller → DTO → Service → Mapper → Entity → Repository → Database
  ↑                                 ↓
  ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
             Mapper ← Entity ← Repository
```

Everything is secured through the **Security Layer**, and configured using the **Config Layer**.

