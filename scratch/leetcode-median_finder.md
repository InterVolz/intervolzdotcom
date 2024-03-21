

## Primitive Solution

- Maintains a list of integers that is re-sorted every time a new number is added
- Major limitation is performance, especially for large datasets. 
- Solution might not scale well for real-time applications or those requiring the handling of a large number of elements

Since the list is sorted after each insertion, the addNum method has a time complexity of **O(n log n)**, which can lead to inefficiencies as the list grows.

```py
class MedianFinder:

    def __init__(self):
        self.int_list = []

    def addNum(self, num: int) -> None:
        self.int_list.append(num)
        self.int_list = sorted(self.int_list)

    def findMedian(self) -> float:
        int_list_len = len(self.int_list)
        is_odd = int_list_len % 2

        if is_odd:
            return self.int_list[int_list_len // 2]
        else:
            first_mid = self.int_list[(int_list_len // 2)-1]
            second_mid = self.int_list[int_list_len // 2]
            return (first_mid + second_mid) / 2 

        


# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
```

## Optimized

This approach ensures that:

- The max heap contains the smaller half of the numbers (simulated as a max heap by negating the numbers).
- The min heap contains the larger half of the numbers.
- Both heaps are balanced or have a size difference of at most 1.
- The median is easily found as the top of one of the heaps or the average of the tops of both heaps when they are of equal size.


```py
import heapq

class MedianFinder:
    def __init__(self):
        # Min heap for the upper half
        self.min_heap = []
        # Max heap for the lower half, we negate the values to simulate a max heap
        self.max_heap = []

    def addNum(self, num: int) -> None:
        # Add to max heap (lower half)
        heapq.heappush(self.max_heap, -num)
        # Balance the heaps by moving the largest element of max_heap to min_heap
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        
        # If the heaps are imbalanced (min_heap has more elements), rebalance
        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))

    def findMedian(self) -> float:
        if len(self.min_heap) == len(self.max_heap):
            return (self.min_heap[0] - self.max_heap[0]) / 2
        else:
            return -self.max_heap[0]
```


## Follow up:

If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?


- Frequency array instead of heaps or sorting to maintain a count of each integer's occurrence and calculate the median in a more efficient manner
- Initialize an array of length 101 
- Increment the count of the input number in the frequency array **O(1)**
Both adding a number and finding the median can be done in **O(1)** and **O(100) = O(1)** time complexity given the fixed range of inputs.
- The median is located by accumulating counts from the start of the array until the middle of the distribution is reached. 
  - For an even number of total elements, the median is the average of the two middle numbers.
  
```py
class MedianFinder:
    def __init__(self):
        # Initialize the frequency array to store counts of each number
        self.frequency = [0] * 101
        self.total_count = 0  # Keep track of the total count of numbers added

    def addNum(self, num: int) -> None:
        # Increment the frequency of the given number
        self.frequency[num] += 1
        self.total_count += 1

    def findMedian(self) -> float:
        count = 0
        first_mid = None
        # Iterate through the frequency array to find the median
        for i in range(101):
            count += self.frequency[i]
            if count >= self.total_count / 2 and first_mid is None:
                first_mid = i
            if count >= (self.total_count + 1) / 2:
                if self.total_count % 2 == 0 and count == self.total_count / 2:
                    return (first_mid + i) / 2
                return i
```

## Follow up 2:

If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?

With the new constraint that 99% of all integer numbers from the stream are in the range [0, 100], but there's a possibility of numbers outside this range, we need a hybrid solution that combines the frequency array method for the majority of the numbers with a dynamic data structure to handle the outliers. This way, we can maintain efficiency for the common case while still correctly handling rare cases.

Hybrid Solution Approach:
1. Frequency Array for Common Range: Use a frequency array to handle numbers within the [0, 100] range, similar to the previous optimization. This covers the majority of the data efficiently.

2. Min Heap and Max Heap for Outliers: Implement two heaps:
   - A min heap to store numbers greater than 100.
   - A max heap (using negated numbers for implementation) to store numbers less than 0.
   - These heaps will help efficiently manage the few numbers falling outside the [0, 100] range.

3. Adding Numbers (addNum):
   - If the number is in the range [0, 100], increment its count in the frequency array.
   - If the number is greater than 100, add it to the min heap.
   - If the number is less than 0, add it to the max heap.
   - This keeps the time complexity for adding numbers efficient, especially for the common cases.

4. Finding Median (findMedian):
   - Calculate the median by considering the counts in the frequency array along with the sizes of both heaps to determine the median's position.
   - Adjust for outliers by possibly moving elements from the heaps into the calculation to correctly find the median when it falls within the outlier ranges.

This approach efficiently handles the common cases with a frequency array while using heaps to manage outliers, ensuring the solution is both fast and adaptable to the full range of possible inputs.

```py
import heapq

class MedianFinder:
    def __init__(self):
        self.frequency = [0] * 101  # Frequency array for numbers in [0, 100]
        self.min_heap = []  # Min heap for numbers > 100
        self.max_heap = []  # Max heap (negated numbers) for numbers < 0
        self.total_count = 0

    def addNum(self, num: int) -> None:
        if 0 <= num <= 100:
            self.frequency[num] += 1
        elif num > 100:
            heapq.heappush(self.min_heap, num)
        else:  # num < 0
            heapq.heappush(self.max_heap, -num)
        self.total_count += 1

    def findMedian(self) -> float:
        mid = (self.total_count + 1) // 2
        count = 0
        median = None

        # Check if median is in max_heap
        if len(self.max_heap) >= mid:
            return -heapq.nsmallest(mid, self.max_heap)[-1]

        count += len(self.max_heap)
        
        # Find median in frequency array if it exists there
        for i, freq in enumerate(self.frequency):
            count += freq
            if count >= mid:
                median = i
                break

        # If the median has not been found yet, it must be in the min_heap
        if median is None:
            remaining = mid - count
            median = heapq.nsmallest(remaining, self.min_heap)[-1]

        # Handle even total count for median calculation
        if self.total_count % 2 == 0:
            if median < 0:  # If the first median value is in max_heap
                next_median = -self.max_heap[0] if count - self.frequency[median] < mid else median
            elif median <= 100:  # If the first median value is in frequency array
                next_count = count - self.frequency[median]
                if next_count < mid:
                    if len(self.min_heap) > 0:
                        next_median = self.min_heap[0]
                    else:
                        next_median = median
                else:
                    next_median = median
            else:  # If the first median value is in min_heap
                next_median = self.min_heap[0]
            return (median + next_median) / 2.0
        else:
            return median
```