# Follow-up Questions

## 1. How long, roughly, did you spend working on this project? This won’t affect your evaluation; it helps us norm our problems to our expected time to complete them.

~2 hours

## 2. Give the steps needed to deploy and run your code, written so that someone else can follow and execute them.

    The script was written using node.js (needs node.js to run)

    1. Run 'npm install' command to install node modules in main directory
    2. Add a .env file to the directory that includes 'API_KEY=your_api_key_here' or change the apiKey in headers in the index.js file
    2. Run 'npm start' to run the program
    3. Program will print "Email report complete, file is EmailReport.csv" and create the csv file in the same file directory when finished

## 3. What could you do to improve your code for this project if you had more time? Could you make it more efficient, easier to read, more maintainable? If it were your job to run this report monthly using your code, could it be made easier or more flexible? Give specifics where possible.

If I were to improve this project the first thing I would do would be to implement unit tests. I designed the program so that each function has a singular responsibility which makes it ideal for unit testing. Unit testing would allow any errors created by modifcations to the program to be easily caught.

Another improvment I could make would be to inject functions like `formatEmailStats(emailStats)` and `sortEmailsByID(a, b)` where they are used instead of just calling them directly. This would increase the flexibility of the program by allowing the format and sorting algorithim used in the report to be swapped out at runtime.

To improve efficiency I could combine the `getAllEmailStats(emails)` and `getAllBestVariantsAndFormat(emails)` functions into one to eliminate one of the calls to `array.map()` this would slightly improve the runtime of the application. However I deliberately chose to seperate the two functions to improve the readability and maintainability of the program. Even though this would improve the runtime, I believe that the runtime tradeoff is worth the improvement to readability and maintainability.

## 4. Outline a testing plan for this report, imagining that you are handing it off to someone else to test. What did you do to test this as you developed it? What kinds of automated testing could be helpful here?

To test while developing I used a mix of breakpoints and console.log statements. Additionally I tested API calls on the API documentation webpage to see what data/formatting I could expect to receive.

I broke up the program into small functions with single responsibilities. This makes unit testing ideal. For example the `getBestVariantOpen(variants)` function could be unit tested by creating tests that pass in dummy variant arrays to ensure that the variant with the highest % of opens is returned. Additionally the `sortEmailsByID(a, b)` function is also an ideal candidate for unit testing. Unit tests for this function would call `array.sort((a, b) => sortEmailsByID(a, b))` with various arrays of formatted email statistics, to ensure that they are sorted correctly by ID.
