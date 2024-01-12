@@Title: Higher Order Functions in Python
@@URL: higher-order-python
@@Date: 12/27/2023
@@TLDR: functions that funk with other functions
@@Tags: py

## Analogy

Higher order functions can be described as the project manager. The project manager combines the work of engineers(functions) to create something more complex.

### Example 1 - Maps

The *map* function applies a given function to each item of an iterable (like a list) and returns a map object (which is an iterator). This can be annoying. You cannot easily print a map object. Cast it to a list as seen below.

```py
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x**2, numbers)
print(list(squared))
# Output: [1, 4, 9, 16, 25]
```

### Example 2 - Filters

*Filter* applies the function and returns values that pass as **True**.

```py
numbers = [1, 2, 3, 4, 5]
even_numbers = filter(lambda x: x % 2 == 0, numbers)
print(list(even_numbers))
# Output: [2, 4]
```

### Example 3 - Map Filter Combo

Because *Map* and *Filter* return iterables they can be chained. Very cool. Can be unwieldy.

```py
numbers = [1, 2, 3, 4, 5]
squared_evens = map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers))
print(list(squared_evens))
# Output: [4, 16]
```

## More Analogy - The Consultant

Now, suppose the company hires a consultant to improve the efficiency or quality of the engineer's work. The consultant doesn't change the engineer's fundamental method of working but provides additional guidance, tools, or strategies to enhance the output. The consultant works directly with the engineer and "wrap" the engineer's (function's) process, adding improvements or modifications, just like a decorator in Python adds functionality to a function.

### Example 4 - Decorators

```py
def quality_assurance(func):
    # Consultant (Decorator) enhancing the function
    def qa_wrapper(component):
        # Pre-task enhancement
        print(f"Quality check initiated for {component}. Hmm.")
        func(component)
        # Post-task enhancement
        print(f"Yep! This checks out. Quality check completed for {component}.")
    return qa_wrapper

@quality_assurance
def design_component(component):
    # Engineer (Function) performing the core task
    print(f"Designing the {component}.")

# Using the decorated function
design_component("hydraulic pump")
```