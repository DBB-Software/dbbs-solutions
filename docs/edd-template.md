# EDD: Brief Summary of Design

**Author:** [Author Name](author.email@dbbsoftware.com)

## Pre-review Checklist

Before scheduling your design review, ensure that you have checked all of the following boxes:

- [ ] Familiarize yourself with our EDR process
- [ ] Make sure PRD and EDD are aligned - EM
- [ ] EDD has been reviewed by internal team members - EM

## Resources

PRD: Insert Link to PRD

Supporting designs: Insert Links to Other Design Docs

## Glossary

<!--

List of terms, acronyms and/or abbreviations with their respective definitions that will be used across this EDD.

-->

## Overview

<!--

Brief outline of what this design is intended to achieve and anything useful to set context for readers. Assume that the reader has looked over the PRD and focus on specific engineering concerns. Do not duplicate info unnecessarily.

- Is this an interim solution or something expected to be maintained long term?
- Are there alternatives to the chosen path?
  - If yes, briefly outline what they were, the pros/cons of each, and why this design was ultimately chosen.
  - If the purpose of this EDD is to choose among several solutions, make that clear and consider a first pass review before fleshing out the detailed design.

-->

## Goals

<!--

Brief list of goals of this project. All designs should be evaluated explicitly against these goals.

- Include reasons for each of these goals
- Include links to PRD for aspects that are non-obvious

-->

## Design Proposals

<!--

The details of the proposed solutions. Include various alternative proposals. Note which proposal you recommend. Generally, you should have at least 2 proposals.

- New APIs or modifications to existing ones.
- Overview diagrams to set context for where this is in the overall system and how it connects to other services.

-->

### Proposal 1 – summary of proposal

<!-- Pros and cons of proposal, and evaluation against above listed goals -->

### Proposal 2 – summary of proposal

<!-- Pros and cons of proposal, and evaluation against above listed goals -->

## Platform Components

<!--

Replace this text with an explanation of what shared / platform components are related to this project.

- What existing shared components are utilized?
- Do any of them require changes?
- Are new shared components being developed as a part of this product?

Please be thoughtful about whether other teams will benefit from or need to use any components you're developing as a part of this product so that we make the right architectural decisions.

-->

## Data Design & Schema Changes

<!--

- If a new database will be incorporated, please follow guidelines to create and share credentials with data engineering
- By default we will include a read replica for data engineering. If we will not do this, please provide a reason.
- If schema changes will be introduced to an existing database, please share with data engineering.

-->

## Metrics & Data Integration

<!--

What instrumentation will be done (outside of any handled intrinsically by standard frameworks)?

- Are the metrics going to the usual places or someplace where they might be less discoverable? If the latter, why?

Are there any interesting downstream effects on users of the metrics?

- Normalization that might be required for data bridging this release: _field "dob" used to contain date of birth information, but after this change will no longer be populated and is instead decomposed into "dob_y", "dob_m", "dob_d"_

Are there any quick win opportunities with downstream users?

- Things **Data Science** could use to improve models?
- Things **Analytics** would want for business intelligence?
- Things **DevOps** could use to improve monitoring of system operation?

Are there any new monitors for **DevOps** or engineering to keep aware of?

- Add answer here

-->

## Error Handling & Alerting

<!--

What are the most likely failure points in this design?

- How will errors be handled?
- How critical are various errors?
  - Is partial failure fatal?
    - If so, what time frame and how is the interim state represented?
    - If not, are errors corrected later?

What conditions will be alerted on and at what thresholds?

- Add answer here

Are there cases where errors will be queued or silently ignored? Are there requirements to report errors back to the system that initiated a request?

- Add answer here

-->

## Safety

<!--

Are there any unusual safety concerns around this design?

- E.g., is it possible for an error to cause a patient request to become lost? To be miscommunicated in a way that might be confusing to the provider?

-->

## Security

<!--

Are there any unusual security concerns around this design?

- New endpoints or methods of interaction within the system?
- New dependencies on external systems?
- New third party libraries?

-->

## Audits and Logs

<!--

Will any new functionality need to have its state changes observed and stored in compliance with retention policy?

- Persist the who, what, when in indestructible storage
  - User ID
  - Properties that changed
  - Values that changed
  - Date/time of change
  - Success or failure
- Examples:
  - Changes to system configuration
  - Changes to PHI
  - Changes to care information
  - Admin-only functionality

-->

## Scalability

<!--

Where is this going to fall over?

- What are the expected bottlenecks in this design?
- What is the maximum capacity?
  - What happens when maximum capacity is exceeded?
  - Can this capacity be increased via simple replication?
- Does this change introduce new fanout behavior that may impact other parts of the system?
- Does this change rely on existing known bottlenecks/high latency actions?
- Does this change introduce meaningful storage requirements (including for logging)?

-->

## Cost

<!--

If the solution involves resources that are expected to increase with scale (e.g., AWS services), estimate the initial cost based on today's usage and projected cost 1-2 years out if it's expected to change substantially.

- Add answer here

-->

## Experimentation

<!--

How do we enable experimentation for different features?

- Add answer here

-->

## Testing

<!--

Are there components that will need to be manually tested?

- Ideally justify why these cannot be tested via automation

Are any load tests needed?

- Add answer here

-->

## Training

<!--

Will this change require any end-user training?

- Clinical/ops/etc.
- Eng/IT/QA/Data science/Data analytics

-->

## Deployment

<!--

Are there any unusual notes about the deployment of this change?

- Dependencies on updates covered by other designs?
- Things that the DevOps or release teams need to know/do to deploy this change correctly?
- Are there any changes to run books/playbooks?
- Does anybody need to be made explicitly aware when this rolls out? If this is rolled back?
- Is there any reason this can't be trivially rolled back?
  - If so, are there steps that can be taken to roll back or is it 1-way?

-->

## Lifecycle management

<!--

Are any technology choices in danger of being sunset, abandoned, or deprecated?

- How will chosen products, service providers, technologies be observed for announcements of retirement?

-->
