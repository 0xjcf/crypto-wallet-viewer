# Lesson 6: Refactoring to MVC Model

## Objective

Refactor the project setup to adhere to the Model-View-Controller (MVC) architectural pattern, add unit tests, and integrate continuous testing with Wallaby.js (optional). This restructuring will enhance code organization, improve maintainability, and facilitate future scalability.

## High-Level Steps

1. **Move Routes to Controllers**: Relocate the route handling logic from the routes directory to the controllers directory. Each route file will be transformed into a controller file that contains the corresponding route handlers.

2. **Rename Route Files**: Rename the route files (authRoutes.ts, dashboardRoutes.ts, walletRoutes.ts) to match the controller naming convention (authController.ts, dashboardController.ts, walletController.ts).

3. **Adjust Dependencies**: Update the import statements in the server.ts file to reflect the new file structure and controller names.

4. **Add Unit Tests**: Implement unit tests to ensure the correctness and reliability of the application's functionality. Test key components, including controllers, models, and utility functions.

5. **Integrate Continuous Testing with Wallaby.js**: Set up Wallaby.js for continuous testing to provide real-time feedback on code changes. Adjust the jest.config.js file to configure Jest for compatibility with Wallaby.js.

6. **Test the Application**: Thoroughly test the application to ensure that all routes and functionalities remain operational after the restructuring.

## Test Scenarios

- Ensure all routes respond correctly with the expected data or status codes.
- Verify authentication and authorization mechanisms for protected routes.
- Test database interactions to ensure proper data retrieval and storage.
- Validate error handling mechanisms for edge cases and invalid input.
- Test the integration of third-party services or external APIs.

## Testing Tools

- **Jest**: JavaScript testing framework for unit and integration testing.
- **Supertest**: Library for testing HTTP assertions with Express applications.
- **MongoDB Memory Server**: In-memory MongoDB server for testing database interactions.
- **Mocking Libraries**: Use mocking libraries like jest.mock or sinon for isolating dependencies during testing.
- **Test Coverage Tools**: Measure code coverage with tools like Istanbul to ensure comprehensive test coverage.
- **Wallaby.js (Optional)**: Continuous testing tool for real-time feedback on code changes.

## Running Tests

1. Install dependencies: `npm install --save-dev jest supertest @types/jest @types/supertest`
2. Run tests: `npm test`

### Continuous Testing with Wallaby.js (Optional):

Wallaby.js is a powerful continuous testing tool that provides real-time feedback on code changes, allowing developers to quickly identify and fix issues. However, it's worth noting that Wallaby.js is a paid tool, and setting it up is optional. If you choose to use Wallaby.js, follow these steps:

1. Install the Wallaby.js extension for your preferred IDE.
2. Configure Wallaby.js by creating a `wallaby.js` file at the root of your project.
3. Ensure that the Wallaby.js configuration matches your project's file structure and testing setup.
4. Start Wallaby.js in your IDE to enable continuous testing.

Keep in mind that while Wallaby.js offers significant benefits in terms of workflow efficiency and productivity, its usage may incur additional costs. Alternatively, you can rely on Jest for running tests locally or integrate other continuous testing solutions based on your project requirements and budget.

## Conclusion

Refactoring the project to the MVC model, adding unit tests, and integrating continuous testing enhances code organization, readability, and maintainability. Testing ensures the reliability and stability of the application, helping identify and fix issues early in the development process.

Next Steps: Proceed to Lesson 7 to explore caching with Redis and enhance the application's performance.
