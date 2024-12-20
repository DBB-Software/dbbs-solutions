# NestJS Modules Code Guidelines

## Overview

This document outlines the conventions and best practices for implementing modules in NestJS. It covers the structure
and naming conventions for repositories, services and controllers, along with the types and interfaces used to maintain
separation of concerns and ensure compatibility across different layers.

---

### 1. Project Structure

1. **Repositories**: Responsible for direct interactions with the database.
2. **Services**: Contain the business logic and interact with repositories, ensuring data consistency.
3. **Controllers**: Handle HTTP requests and provide response objects with appropriately decorated types for API documentation.

---

### 2. Naming Conventions and Type Definitions

To clearly define data flow and separate concerns, we use specific type conventions:

- **`<Name>DbRecord`**: Represents the result of a query for the corresponding entity returned from the database and is
only used within the repository layer for database interaction ***(Optional for query-builder like Knex.js, ORM's like
TypeORM not require this abstraction)***.
- **`<Name>Entity`**: Represents an entity for business logic purposes. This type is returned by repository methods 
when fetching data.
- **`I<Name>`**: An interface representing the data structure used by the service layer. Methods in services accept and 
return this type.
- **`<Name>Dto`**: Data Transfer Object used by controllers to define API responses and expected request payload types.

---

### 3. Layer Guidelines

> **The code below is example based on stripe-payment module**

#### Repositories
- **Types**: `<Name>DbRecord`, `<Name>Entity`
- **Responsibility**: Interact with the database directly.
- **Method Returns**: Use `<Name>Entity` to ensure compatibility with the service layer.
- **Example**:
  ```typescript
  // Example: OrganizationDbRecord
  export type OrganizationDbRecord = {
    id: number;
    name: string;
    // Database-specific properties only
  };
  
  export class OrganizationRepository {
    async findById(id: number): Promise<OrganizationEntity> {
      // Query DB and return as OrganizationEntity
    }
  }
  ```
  
#### Services

- **Types**: `I<Name>`
- **Responsibility**: Implement business logic by interacting with repositories and performing data transformations as needed.
- **Method Returns**: Return `I<Name>` to ensure consistency across services and compatibility with the controller layer.
- **Example**:
  ```typescript
  // Example: IOrganization
  export interface IOrganization {
    id: number;
    name: string;
    // Service-layer properties only
  }
  
  export class OrganizationService {
    async getOrganization(id: number): Promise<IOrganization> {
      // Call repository and return transformed IOrganization data
    }
  }
  ```

#### Controllers

- **Types**: `<Name>Dto`
- **Responsibility**: Handle HTTP requests and return responses.
- **Method Returns**: Return `<Name>Dto`, ensuring compatibility with services and enhanced documentation.
- **Example**:
  ```typescript
  // Example: OrganizationDto
  export class OrganizationDto {
    id: number;

    name: string;
  }

  @Controller('organizations')
  export class OrganizationController {
    @Get(':id')
    async getOrganization(@Param('id') id: number): Promise<OrganizationDto> {
      // Call service and return OrganizationDto
    }
  }
  ```

### 4. Mapping and Compatibility

   All types (`<Name>Entity`, `I<Name>` and `<Name>Dto`) must be compatible with each other and easily mappable. This
   ensures that changes in one layer can be mirrored across others without requiring extensive refactoring. We recommend
   using mapping utilities or libraries, if necessary, to maintain consistency across layers.


### 5. Benefits of Separation of Concerns

- `Repositories`: Maintain focus on data structure and persistence logic.
- `Services`: Ensure data consistency, validation, and business logic are kept separate from data storage concerns.
- `Controllers`: Allow for API-specific responses with comprehensive documentation.
