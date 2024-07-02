# Pull Request (PR) - Code Reviewer Practices

[Google Eng Practices Reference](https://google.github.io/eng-practices/review/reviewer/)

## Tools

<a name="pr-monitor"></a>

### [PR Monitor](#pr-monitor)

If you want to see notifications about PRs changes, you can install the Chrome extension for [PR Monitor](https://chrome.google.com/webstore/detail/pr-monitor/pneldbfhblmldbhmkolclpkijgnjcmng).

- Make sure it is **NOT** hidden in Chrome after installation, by [pinning the extension](https://www.howtogeek.com/683099/how-to-pin-and-unpin-extensions-from-the-chrome-toolbar/) using the Jigsaw Puzzle Piece icon.

<a name="goals"></a>

## [Goals](#goals)

Maintain the health of the codebase and employ continuous improvement to enhance its quality and reach a high transparency level.

Reviewers should empower developers to advance in their tasks. Prioritize approving pull requests that unquestionably enhance the overall code health, even if they are not flawless. It is acceptable to request subsequent enhancements or the filing of tickets.

<a name="pr-title"></a>

### [PR Title](#pr-title)

Write a concise summary of *what* the PR is doing

- Context
    - Does not require reading the code to understand the statement
- Tracking issue
    - Ticket url

**Rationale**: Good summaries allow maintainers to quickly review commit logs when potential problems come up in the codebase, and triage problems easily.

Format:

```jsx
[<type>/TICKET-000][<Feature>]: <Title of PR>
```

Examples:

```jsx
// Bad
[feat/TICKET-000]: added new functionality
// Good
[feat/TICKET-000][Feature]: added new functionality

// Bad
[bug/TICKET-000]: fixed an issue
// Good
[bug/TICKET-000][Feature]: fixed login with google
```

<a name="pr-description"></a>

### [PR Description](#pr-description)

Add an informative description with all necessary context information for a feature maintainer to understand the PR, what issue it is solving and how.

Details to include:

- New feature which was added / problem being solved
- Background
    - Related ticket from the issue tracking system
    - Related PRs (if exist)
    - Impact of the change
- Testing proof
    - Put a short video which maintainer can use to check your changes or post screenshots
- Referencing docs
    - Make sure that all documents are accessible by everyone. (It could be any kind of documentation, confluence, thread for discussion, .etc)

### Review final PR descriptions before merging

Make sure to review PR title and description for accuracy once again before merging.

PRs can go through various of changes before merge, that’s why we have to keep it updated.

<a name="code-review-steps"></a>

## [Code Review Steps](#code-review-steps)

### Look broadly at change

- Does PR description and PR content make sense to even do?
    - Immediate feedback on why this doesn't make sense and provide alternatives.

### **Examine main parts of PR, in phases from large to small**

Look over PR in passes, in order from largest to smallest details. Don't waste time on nitpicking small parts of PR if larger parts first need work.

Higher level feedback often takes longer to rework, and details don't matter until underlying fundamentals make sense.

### Suggested order:

- Too large PR?
    - Immediately ask to split PR into smaller chunks.
- Design problems?
    - Immediate feedback if not right.
- Data structures make sense?
    - If anything in state is not immediately clear, operating code won't be clear.
    - All operations on data structures should have clear and reasonable transitions.
- Were all related changes done?
    - There are a lot of cases when the quality of new code is ok but not all changes were applied.
- Tests?
    - In good case. Code coverage by tests should be around 80 percents.
    - Tests should serve as clear clients of the code. If the tests appear convoluted, there is a strong likelihood of design issues in the pull request, and it may require rework.
- Edge cases?
    - Check for edge cases that come to mind after reading the PR description, to see how developer has handled it. If the edge cases were not handled, there's a possibility the PR may need rework.

### **PR comments**

- Help the developer understand why you're making the suggestion, so they can improve over time.
- Point out problems and let developer decide how to handle the fix.
- Direct instructions, suggestions, short term way to get to best PR for now.
- Share links to best practices to prove your comments.

### **Acceptable Explanations**

- Reviewer questions should generally be answered with clearer code.
- The goal of good code is to answer questions. Explanations in a code review tool do not help future code maintainers. Adding a comment in code is appropriate only if it's not explaining unnecessarily complex code.
- **Exception**: Explaining something that normal code readers would already know.

<a name="handling-comments"></a>

## [Handling Reviewer Comments](#handling-reviewer-comments)

### **Respond to all comments together as single transaction**

Only use the `Files changed` tab to respond to comments. This will give the option to reply to comments with `Start a review`.

1. Use `Files changed` tab.
2. Address first comment, using `Start a review` button.
3. Address all other comments, changing code as necessary, replying with `Add review comment`.
    - Includes outdated comments. If they're done, respond with `"Done"`.
4. Push all code up that has addressed comments, reviewing code.
5. Click on `Review changes`, add any other comments needed for PR. `Submit review`.
6. If all comments have been addressed, go to bottom of `Conversation` tab, click on `Dismiss review` for any `Changes requested` that have been addressed.
7. `Re-request review`s from reviewers by clicking the "cycle" icon next to reviewers' usernames.

### Resolving comments

- Developers should not use the `Resolve Conversation` button. Only the reviewer can use `Resolve Conversation` button if he is good with the result. Developer and reviewer should try to reach consensus.
- Use face-to-face meeting or video conference to talk through issues. Record all resolutions in code review tool, for future readers
- **Last resort**: Escalate to broader team discussion, or bring in a Tech Lead/Manager if necessary.

<a name="look-for"></a>

## [Things to look for](#look-for)

Following are examples of questions to ask in various aspects of the PR. See subsections for in-depth examples of questions.

- The code is well-designed.
- The functionality is good for the users of the code.
- Any parallel programming is done safely.
- The code isn't more complex than it needs to be.
- The developer isn't implementing things they *might* need in the future but don't know they need now.
- Code has appropriate unit tests.
- Tests are well-designed.
- The developer used clear names for everything.
- Comments are clear and useful, and mostly explain *why* instead of *what*.
- Code is appropriately documented (`README`s, etc).
- The code confirms to our code guides.

### Functionality

- Code does what PR description claims?
- Author tested functionality sufficiently?
- Edge cases? Concurrency issues?
- Can client code use this functionality easily?

### Consistency

- Maintains consistency with existing code?
- `TODO`s or `FIXME`s for cleanup of existing code?