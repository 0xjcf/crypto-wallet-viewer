## Lesson 6A: Refactoring to MVC and Testing Setup

### Objective

Refactor the project to adhere to the Model-View-Controller (MVC) pattern and set up the foundation for unit testing, including configuring Jest and integrating test coverage tools.

### High-Level Steps

1. **Move Routes to Controllers**: Transform route files into controller files within the controllers directory to separate the handling logic.
2. **Rename Route Files**: Update route files to follow the controller naming convention.
3. **Adjust Dependencies**: Modify import statements in the server.ts file to reflect new paths and names.
4. **Set Up Testing Environment**:
   - Add unit tests using Jest.
   - Configure Jest for the project.
   - Set up global setup and teardown scripts for testing.
   - Integrate Wallaby.js for continuous testing (optional).
5. **Adjust package.json**: Update scripts for running tests and coverage reports.

### Tools and Libraries

- **Jest**: For unit and integration testing.
- **Supertest**: For HTTP assertions.
- **MongoDB Memory Server**: For in-memory database testing.
- **Wallaby.js** (Optional): For continuous testing.

### Implementation Details

- Detailed steps for moving logic to controllers and renaming files.
- Guidelines for organizing tests and structuring test files.
- Example Jest configuration and scripts for running tests.
