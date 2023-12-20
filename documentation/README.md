**What is DBBs Platform**
- It consists of code developments, architectural solutions, project organization, and templates for configuration and deployment brought together.
- **At this stage**, it is a repository with bootstrapped examples of single-page applications (spa), server-side rendering (SSR), serverless, and Nest server applications. It includes configurations, CI/CD, Terraform configurations, and usage examples.
- **In the future**, common modules for all projects will be added to these templates. For example, a custom logger, settings service, and authentication module.

**Ideological Goal** - to compile the company's developments in one repository, ensure the quality of the code in this repository, and keep dependencies up to date.

**Commercial Goals:**
- Presentation for potential clients: "Here, we have a platform that allows you to build an MVP for your application very quickly. If you want to see how we write code, come and take a look, evaluate it."
- Another aspect is advertising: "We have a product that integrates with various CMS and PIM systems. Use it, and you'll get a fast, high-quality, and reliable solution."

**How DBBs Platform will be used:**
- Simply copying the necessary code into a new project (packages, modules, applications).
- Creating a CLI that allows you to initialize a monorepo, add an SSR application to the monorepo (with deployment and configuration).
- Possibly, if justified in terms of time and effort, adding modules, such as authentication, using sli.
  Creating an SLI that asks the user questions and generates the necessary applications in the monorepo based on their answers.

**What effect DBBs Platform provides:**
- Hermes accelerates the development of typical systems, allowing developers to efficiently reuse ready-made solutions. It ensures that the code contained in Hermes is up-to-date and well-written. It enables less experienced developers to bootstrap projects.
- Another aspect is the solutions adopted in business logic development, such as CQRS with snapshots, which are easier for developers to understand.

**How it differs from other similar systems:**
Similar systems likely exist, but they may not be as extensive (e.g., Nest JS). Perhaps there are some without public access. Hermes differs in that it contains our own developments and solutions.

**DBBs Platform Development Strategy:**
- Create a basic version.
    - Create a monorepo.
    - Bootstrap typical applications without code.
        - SSR
        - SPA
        - Serverless
        - Nest JS server
    - Deployment configurations
    - Linting and build configurations
    - Monorepo configurations
    - Generators for bootstrapping
- Enhance the module version.
    - Authentication
    - Settings service
    - Loggers
    - Module generator (?)
- Implement business logic.
    - Read model
        - Projections in a database
        - Rendered pages as projections
    - Domain
        - Snapshot
        - Event store
        - Distributed transactions
        - Event-based options
            - Event bus without a queue
            - AWS Event Bridge
            - Event bus with an asynchronous queue
            - Event bus with a synchronous queue
            - Polling event store
        - Business logic generator (?)
        - Command bus options
            - Synchronous
            - Queue
            - Kafka?
    - Client implementation and integration
        - Response to the client
            - Acknowledgment response
            - State aggregate
        - Client construction
            - Client designed for a REST API
            - API gateway context option
            - Complete response notification
            - Client that stores context and processes events.
