@@Title: End to End to End
@@URL: software-testing-01
@@Date: 11/25/1999
@@TLDR: because
@@Tags: python

When writing modern Python, it is important to test your code thoroughly to ensure that it works as expected. One way to do this is by testing features at the implementation level and end-to-end. This means writing functions that call specific implementation details, such as *tokenize* and *parse* and *eval_exp*, explicitly so that you can catch errors and other behavior as close to the implementation as possible.

Here are some examples of tests for the tokenize, parse, and eval_exp functions:

- The tokenize function might take an input string and check that the function correctly identifies all of the tokens in the string. For example, if the input string is "2 + 3", the test should check that the function returns the tokens "2", "+", and "3".
- The parse function might take an input string and check that the function correctly generates an abstract syntax tree (AST) for the string. For example, if the input string is "2 + 3", the test should check that the function returns an AST representing the addition operation.
- The eval_exp function might take an input string and check that the function correctly evaluates the expression represented by the string. For example, if the input string is "2 + 3", the test should check that the function returns the value 5.

In addition to testing at the implementation level, it is also important to write full integration tests. These tests can be used as a feature showcase and are easily portable to other implementations. They allow you to test the entire system from end to end, ensuring that all components are working together correctly.

By testing both at the implementation level and end-to-end, you can catch any issues or bugs early on in the development process and ensure that your code is reliable and robust. This will save you time and effort in the long run and help you deliver high-quality software.
