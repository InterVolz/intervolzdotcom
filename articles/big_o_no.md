@@Title: Big O No
@@URL: big_o_no
@@Date: 11/14/23
@@TLDR: optimized optimizing is optimal...
@@Tags: programming


# Big O No(tation)

## What is it?

- Big O Notation describes the time complexity of programming algorithms
- AKA how efficient is the solution to the problem?

## The Goal is:

- Shorter
- Faster
- Succinct

## Slowly at first

> Problem: 10 times 10
> Solution:
> 
> O(n): 10*10=100
> 
> O(n^2): 10+10=20+10=30+10=40+10=50....you get the idea. This is bad.

## Levels to this shit

| Level      | Phonetically | Description       | Example                                                            |
| ---------- | ------------ | ----------------- | ------------------------------------------------------------------ |
| O(1)       | "Oh-one"     | Constant Time     | Access element of array by index; using modulus for even/odd check |
| O(log N)   | "Oh log-N"   | Logarithmic Time  | Binary search on a sorted list, each sort halves search space      |
| O(N)       | "Oh N"       | Linear Time       | Simple loop, finding max() or min() by checking all elements once  |
| O(N log N) | "            | Linearithmic Time | Merge-sort, list is split, sorted, and merged back                 |
| O(N^2)     | "Oh shit"*   | Quadradic Time    | Nested loops, bubble sort, elements evaluated in pair-wise fashion |

*Basically, but really its Quadradically 

## How to Eyeball It

1. Counting *primitive operations*, AKA math, comparisons, assignments
2. Identify *dominant terms*, 
   1. overall time complexity is based on the slowest performer that scales the worst
3. Worst Case First
   1. Big O Analysis focuses on the worst-case scenario to provide the upper bound of the time complexity
4. Nested Loops and Recursion
   1. Multiply the complexity of the loops, and weep
   2. How *much* recursion? And how complex? 
5. Data Structures 101
   1. Appending to a list is generally O(1)
   2. Appending or Popping from a queue is O(N) due to shifting of other elements
6. Space-Time Trade-off
   1. Loading everything into memory
   2. Caching
7. When in doubt...time it!
   1. Theory is great
   2. Accurate real world measurements are better

