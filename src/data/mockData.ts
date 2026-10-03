import type {
  User, Level, Topic, Quiz, Challenge, Achievement,
  XPTransaction, Notification, LeaderboardEntry, ActivityEntry,
  StreakDay, DailyChallenge, AnalyticsData
} from "../types";

export const LEVELS: Level[] = [
  { level: 1, title: "Python Beginner", minXp: 0, maxXp: 99 },
  { level: 2, title: "Code Learner", minXp: 100, maxXp: 249 },
  { level: 3, title: "Python Explorer", minXp: 250, maxXp: 499 },
  { level: 4, title: "Code Adventurer", minXp: 500, maxXp: 849 },
  { level: 5, title: "Python Builder", minXp: 850, maxXp: 1299 },
  { level: 6, title: "Python Developer", minXp: 1300, maxXp: 1999 },
  { level: 7, title: "Code Master", minXp: 2000, maxXp: 2999 },
  { level: 8, title: "Python Expert", minXp: 3000, maxXp: 4499 },
  { level: 9, title: "Python Pro", minXp: 4500, maxXp: 6499 },
  { level: 10, title: "Python Master", minXp: 6500, maxXp: 9999 },
];

export const DEMO_USER: User = {
  id: "u1",
  name: "Shweta Gupta",
  username: "shweta_g",
  email: "shweta@example.com",
  level: 7,
  levelTitle: "Code Master",
  xp: 2450,
  nextLevelXp: 3000,
  streak: 12,
  joinedAt: "2024-10-15",
  experience: "intermediate",
  learningGoal: "Improve coding skills",
  stats: {
    lessonsCompleted: 18,
    quizzesCompleted: 35,
    challengesCompleted: 24,
    quizAccuracy: 91,
    learningHours: 47,
    totalXpEarned: 3180,
  },
};

export const TOPICS: Topic[] = [
  {
    id: "t1", order: 1, title: "Python Introduction", description: "Get started with Python — history, setup, and your first program.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 20,
    status: "completed", progress: 100,
    subtopics: [
      { id: "s1", title: "What is Python?", content: "Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, it emphasizes code readability with its clean syntax.", codeExample: "print('Hello, World!')", codeOutput: "Hello, World!", notes: "Python uses indentation to define code blocks — no curly braces needed." },
      { id: "s2", title: "Installing Python", content: "Download Python from python.org. Verify installation with `python --version` in your terminal. Python 3.x is the current standard.", codeExample: "# Check Python version\nimport sys\nprint(sys.version)", codeOutput: "3.11.4 (main, Jul  5 2023, 08:54:11)" },
      { id: "s3", title: "Your First Program", content: "The classic starting point — printing to the console. The print() function outputs text or values to standard output.", codeExample: "# Your first Python program\nprint('Hello, World!')\nprint('Welcome to PythonQuest!')", codeOutput: "Hello, World!\nWelcome to PythonQuest!" },
    ],
  },
  {
    id: "t2", order: 2, title: "Variables & Data Types", description: "Learn how to store and work with different types of data.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 25,
    status: "completed", progress: 100,
    subtopics: [
      { id: "s4", title: "Variables", content: "Variables store data values. In Python, you don't need to declare a type — Python infers it automatically.", codeExample: "name = 'Alice'\nage = 25\npi = 3.14159\nis_active = True", codeOutput: "" },
      { id: "s5", title: "Data Types", content: "Python has several built-in data types: str, int, float, bool, list, tuple, dict, set.", codeExample: "x = 42          # int\ny = 3.14         # float\nz = 'hello'      # str\nb = True         # bool\nprint(type(x))   # <class 'int'>", codeOutput: "<class 'int'>" },
    ],
  },
  {
    id: "t3", order: 3, title: "Operators", description: "Arithmetic, comparison, logical, and assignment operators.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 20,
    status: "completed", progress: 100,
    subtopics: [
      { id: "s6", title: "Arithmetic Operators", content: "Python supports +, -, *, /, //, %, ** operators.", codeExample: "a, b = 10, 3\nprint(a + b)   # 13\nprint(a // b)  # 3  (floor division)\nprint(a % b)   # 1  (modulo)\nprint(a ** b)  # 1000 (power)", codeOutput: "13\n3\n1\n1000" },
    ],
  },
  {
    id: "t4", order: 4, title: "Input & Output", description: "Interact with users through input/output operations.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 15,
    status: "completed", progress: 100,
    subtopics: [{ id: "s7", title: "print() and input()", content: "Use print() for output and input() to read user input. input() always returns a string.", codeExample: "name = input('Enter your name: ')\nage = int(input('Enter your age: '))\nprint(f'Hello, {name}! You are {age} years old.')", codeOutput: "Enter your name: Alice\nEnter your age: 25\nHello, Alice! You are 25 years old." }],
  },
  {
    id: "t5", order: 5, title: "Conditional Statements", description: "Control program flow with if, elif, and else.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 25,
    status: "completed", progress: 100,
    subtopics: [{ id: "s8", title: "if / elif / else", content: "Conditional statements allow your program to make decisions based on conditions.", codeExample: "score = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint(f'Grade: {grade}')", codeOutput: "Grade: B" }],
  },
  {
    id: "t6", order: 6, title: "Loops", description: "Repeat operations with for and while loops.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 30,
    status: "in-progress", progress: 65,
    subtopics: [
      { id: "s9", title: "for Loop", content: "The for loop iterates over a sequence (list, tuple, string, range).", codeExample: "fruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n\n# Range loop\nfor i in range(5):\n    print(i, end=' ')", codeOutput: "apple\nbanana\ncherry\n0 1 2 3 4" },
      { id: "s10", title: "while Loop", content: "The while loop runs as long as a condition is True.", codeExample: "count = 0\nwhile count < 5:\n    print(count)\n    count += 1", codeOutput: "0\n1\n2\n3\n4" },
      { id: "s11", title: "break & continue", content: "break exits the loop immediately. continue skips to the next iteration.", codeExample: "for i in range(10):\n    if i == 3:\n        continue  # skip 3\n    if i == 7:\n        break     # stop at 7\n    print(i, end=' ')", codeOutput: "0 1 2 4 5 6" },
    ],
  },
  {
    id: "t7", order: 7, title: "Strings", description: "String manipulation, methods, and formatting.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 30,
    status: "unlocked", progress: 0,
    subtopics: [{ id: "s12", title: "String Basics", content: "Strings are sequences of characters enclosed in single or double quotes.", codeExample: "s = 'Hello, Python!'\nprint(len(s))          # 15\nprint(s.upper())       # HELLO, PYTHON!\nprint(s.replace('Hello', 'Hi'))  # Hi, Python!", codeOutput: "15\nHELLO, PYTHON!\nHi, Python!" }],
  },
  {
    id: "t8", order: 8, title: "Lists", description: "Working with ordered, mutable collections of data.",
    category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 30,
    status: "unlocked", progress: 0,
    subtopics: [],
  },
  {
    id: "t9", order: 9, title: "Tuples", description: "Immutable sequences and when to use them.", category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 20, status: "unlocked", progress: 0, subtopics: [],
  },
  {
    id: "t10", order: 10, title: "Sets", description: "Unordered collections with unique elements.", category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 20, status: "locked", progress: 0, subtopics: [],
  },
  {
    id: "t11", order: 11, title: "Dictionaries", description: "Key-value pairs for structured data storage.", category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 25, status: "locked", progress: 0, subtopics: [],
  },
  {
    id: "t12", order: 12, title: "Functions", description: "Define reusable blocks of code with parameters and return values.", category: "beginner", difficulty: "beginner", xpReward: 10, estimatedMinutes: 35, status: "locked", progress: 0, subtopics: [], requiredXp: 500,
  },
  {
    id: "t13", order: 13, title: "Recursion", description: "Functions that call themselves to solve complex problems.", category: "intermediate", difficulty: "intermediate", xpReward: 20, estimatedMinutes: 40, status: "locked", progress: 0, subtopics: [], requiredXp: 1000,
  },
  {
    id: "t14", order: 14, title: "Exception Handling", description: "Handle errors gracefully with try/except blocks.", category: "intermediate", difficulty: "intermediate", xpReward: 20, estimatedMinutes: 35, status: "locked", progress: 0, subtopics: [], requiredXp: 1000,
  },
  {
    id: "t15", order: 15, title: "File Handling", description: "Read and write files, manage file operations.", category: "intermediate", difficulty: "intermediate", xpReward: 20, estimatedMinutes: 35, status: "locked", progress: 0, subtopics: [], requiredXp: 1200,
  },
  {
    id: "t16", order: 16, title: "Modules & Packages", description: "Organize code into modules and leverage Python's ecosystem.", category: "intermediate", difficulty: "intermediate", xpReward: 20, estimatedMinutes: 30, status: "locked", progress: 0, subtopics: [], requiredXp: 1300,
  },
  {
    id: "t17", order: 17, title: "Object-Oriented Programming", description: "Classes, objects, inheritance, and encapsulation.", category: "intermediate", difficulty: "intermediate", xpReward: 30, estimatedMinutes: 60, status: "locked", progress: 0, subtopics: [], requiredLevel: 6,
  },
  {
    id: "t18", order: 18, title: "Iterators & Generators", description: "Lazy evaluation and memory-efficient data processing.", category: "intermediate", difficulty: "intermediate", xpReward: 30, estimatedMinutes: 40, status: "locked", progress: 0, subtopics: [], requiredLevel: 6,
  },
  {
    id: "t19", order: 19, title: "Lambda Functions", description: "Anonymous functions and functional programming patterns.", category: "intermediate", difficulty: "intermediate", xpReward: 20, estimatedMinutes: 25, status: "locked", progress: 0, subtopics: [], requiredLevel: 6,
  },
  {
    id: "t20", order: 20, title: "Decorators", description: "Modify function behavior with decorator patterns.", category: "intermediate", difficulty: "advanced", xpReward: 30, estimatedMinutes: 45, status: "locked", progress: 0, subtopics: [], requiredLevel: 7,
  },
  {
    id: "t21", order: 21, title: "Advanced OOP", description: "Metaclasses, abstract classes, mixins, and design patterns.", category: "advanced", difficulty: "advanced", xpReward: 50, estimatedMinutes: 60, status: "locked", progress: 0, subtopics: [], requiredLevel: 8,
  },
  {
    id: "t22", order: 22, title: "Regular Expressions", description: "Pattern matching and text processing with regex.", category: "advanced", difficulty: "advanced", xpReward: 40, estimatedMinutes: 50, status: "locked", progress: 0, subtopics: [], requiredLevel: 8,
  },
  {
    id: "t23", order: 23, title: "Multithreading", description: "Concurrent execution and thread management.", category: "advanced", difficulty: "advanced", xpReward: 50, estimatedMinutes: 55, status: "locked", progress: 0, subtopics: [], requiredLevel: 8,
  },
  {
    id: "t24", order: 24, title: "APIs", description: "Consuming REST APIs and building web services.", category: "advanced", difficulty: "advanced", xpReward: 50, estimatedMinutes: 60, status: "locked", progress: 0, subtopics: [], requiredLevel: 9,
  },
  {
    id: "t25", order: 25, title: "Database Connectivity", description: "Connect Python to SQL and NoSQL databases.", category: "advanced", difficulty: "advanced", xpReward: 50, estimatedMinutes: 60, status: "locked", progress: 0, subtopics: [], requiredLevel: 9,
  },
  {
    id: "t26", order: 26, title: "Advanced Python", description: "Memory management, optimization, and Pythonic patterns.", category: "advanced", difficulty: "expert", xpReward: 100, estimatedMinutes: 90, status: "locked", progress: 0, subtopics: [], requiredLevel: 9,
  },
  {
    id: "t27", order: 27, title: "Python Projects", description: "Build real-world Python applications from scratch.", category: "advanced", difficulty: "expert", xpReward: 100, estimatedMinutes: 120, status: "locked", progress: 0, subtopics: [], requiredLevel: 10,
  },
];

export const QUIZZES: Quiz[] = [
  {
    id: "q1", topicId: "t6", topicTitle: "Python Loops", difficulty: "beginner", xpReward: 20,
    timeLimit: 600, completed: true, bestScore: 9,
    questions: [
      { id: "qq1", text: "What is the output of the following code?", code: "x = 10\nprint(x // 3)", options: ["3", "3.33", "4", "1"], correctIndex: 0, explanation: "The // operator performs floor division. 10 // 3 = 3 (integer part of 10/3)." },
      { id: "qq2", text: "Which keyword is used to skip the current iteration of a loop?", options: ["break", "skip", "continue", "pass"], correctIndex: 2, explanation: "continue skips the rest of the current loop body and moves to the next iteration." },
      { id: "qq3", text: "How many times will this loop execute?\n\nfor i in range(3, 10, 2):", options: ["3", "4", "7", "5"], correctIndex: 1, explanation: "range(3, 10, 2) generates 3, 5, 7, 9 — 4 values." },
      { id: "qq4", text: "What does the break statement do in a loop?", options: ["Pauses execution", "Exits the loop immediately", "Skips one iteration", "Restarts the loop"], correctIndex: 1, explanation: "break terminates the loop immediately and transfers control to the statement after the loop." },
      { id: "qq5", text: "What is the output?", code: "for i in range(5):\n    if i == 3:\n        break\nprint(i)", options: ["4", "3", "2", "5"], correctIndex: 1, explanation: "The loop breaks when i equals 3, so print(i) outputs 3." },
    ],
  },
  {
    id: "q2", topicId: "t5", topicTitle: "Conditional Statements", difficulty: "beginner", xpReward: 10,
    timeLimit: 600, completed: false,
    questions: [
      { id: "qq6", text: "What is the correct syntax for an if-else statement in Python?", options: ["if x > 0 then: / else:", "if x > 0: / else:", "if (x > 0): / else:", "if x > 0 { } else { }"], correctIndex: 1, explanation: "Python uses a colon after conditions and indentation for code blocks — no parentheses or braces required." },
      { id: "qq7", text: "What is the output?", code: "x = 15\nif x > 10:\n    print('big')\nelif x > 5:\n    print('medium')\nelse:\n    print('small')", options: ["big", "medium", "small", "Error"], correctIndex: 0, explanation: "Since x=15 > 10, the first condition is True and 'big' is printed. Subsequent conditions are not checked." },
    ],
  },
  {
    id: "q3", topicId: "t7", topicTitle: "Python Strings", difficulty: "intermediate", xpReward: 20,
    timeLimit: 600, completed: false,
    questions: [
      { id: "qq8", text: "Which method converts a string to uppercase?", options: [".toUpper()", ".uppercase()", ".upper()", ".toUpperCase()"], correctIndex: 2, explanation: "Python's str.upper() method returns a copy of the string with all characters converted to uppercase." },
    ],
  },
{
    id: "q4", topicId: "t12", topicTitle: "Functions and Return Values", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq9", text: "What is returned when a Python function reaches the end without a return statement?", options: ["0", "False", "None", "An error"], correctIndex: 2, explanation: "A function without an explicit return value returns None." },
      { id: "qq10", text: "What does the default parameter do in this function?", code: "def greet(name, prefix='Hi'):\n    return f'{prefix}, {name}'", options: ["Makes name optional", "Uses prefix when no second argument is passed", "Always ignores prefix", "Returns a tuple"], correctIndex: 1, explanation: "The default value 'Hi' is used when the caller does not supply prefix." },
      { id: "qq11", text: "Which statement correctly calls a function named area with width 5 and height 3?", options: ["area = (5, 3)", "call area(5, 3)", "area(5, 3)", "function area 5, 3"], correctIndex: 2, explanation: "Call a function by writing its name followed by parentheses and arguments." },
      { id: "qq12", text: "Which is the main benefit of using a function?", options: ["It makes every program run faster", "It allows code reuse and clearer structure", "It removes the need for variables", "It prevents all exceptions"], correctIndex: 1, explanation: "Functions help split a program into reusable, understandable units." },
    ],
  },
  {
    id: "q5", topicId: "t11", topicTitle: "Dictionaries and Sets", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq13", text: "What is printed by this code?", code: "profile = {'city': 'Pune'}\nprint('age' in profile)", options: ["True", "False", "None", "KeyError"], correctIndex: 1, explanation: "The in operator checks whether a key exists; 'age' is not a key in profile." },
      { id: "qq14", text: "Which collection automatically removes duplicate values?", options: ["list", "tuple", "set", "dict values"], correctIndex: 2, explanation: "A set contains unique elements." },
      { id: "qq15", text: "What does dict.get('score', 0) return if score is not a key?", options: ["Raises KeyError", "Returns 0", "Returns an empty list", "Adds score automatically"], correctIndex: 1, explanation: "get() returns the provided default when the key is missing." },
      { id: "qq16", text: "Which operation finds values common to two sets?", options: ["Union", "Intersection", "Difference", "Append"], correctIndex: 1, explanation: "Intersection returns elements shared by both sets." },
    ],
  },
{
    id: "q6", topicId: "t8", topicTitle: "Lists", difficulty: "beginner", xpReward: 50,
    timeLimit: 600, completed: false,
    questions: [
      { id: "qq17", text: "What is the output?", code: "nums = [10, 20, 30]\nprint(nums[1])", options: ["10", "20", "30", "1"], correctIndex: 1, explanation: "List indexing starts at zero, so index 1 contains 20." },
      { id: "qq18", text: "Which method adds an item to the end of a list?", options: ["add()", "append()", "insertEnd()", "push()"], correctIndex: 1, explanation: "append() adds one item to the end of a list." },
      { id: "qq19", text: "What does nums[-1] access?", options: ["The first item", "The second item", "The last item", "An invalid index"], correctIndex: 2, explanation: "Negative index -1 refers to the last list element." },

      {
        id: "qq63",
        text: "What is the output of this code?",
        code: "numbers = [10, 20, 30, 40]\nprint(numbers[1:3])",
        options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"],
        correctIndex: 1,
        explanation: "List slicing includes the starting index but excludes the ending index. numbers[1:3] returns the elements at indices 1 and 2: 20 and 30."
      },
      {
        id: "qq64",
        text: "What is the output of this code?",
        code: "fruits = ['apple', 'banana', 'mango']\nfruits[1] = 'orange'\nprint(fruits)",
        options: [
          "['orange', 'banana', 'mango']",
          "['apple', 'orange', 'mango']",
          "['apple', 'banana', 'orange']",
          "Error"
        ],
        correctIndex: 1,
        explanation: "Python lists are mutable, so an element can be replaced using its index. Index 1 contains 'banana', which is replaced with 'orange'."
      }

    ],
  },
  {
    id: "q7", topicId: "t9", topicTitle: "Tuples", difficulty: "beginner", xpReward: 50,
    timeLimit: 600, completed: false,
    questions: [
      { id: "qq20", text: "Which symbol is commonly used to create a tuple?", options: ["Square brackets []", "Curly braces {}", "Parentheses ()", "Angle brackets <>"], correctIndex: 2, explanation: "Parentheses are commonly used to define tuples." },
      { id: "qq21", text: "Can you change an element of a tuple after creating it?", options: ["Yes, anytime", "No, tuples are immutable", "Only strings can change", "Only the last element"], correctIndex: 1, explanation: "Tuples are immutable, so their elements cannot be reassigned." },
      { id: "qq22", text: "How do you create a tuple containing only the integer 5?", options: ["(5)", "[5]", "(5,)", "{5}"], correctIndex: 2, explanation: "A comma is needed to create a single-element tuple." },

      {
        id: "qq65",
        text: "What is the output of this code?",
        code: "numbers = (10, 20, 30, 40)\nprint(numbers[-1])",
        options: ["10", "20", "30", "40"],
        correctIndex: 3,
        explanation: "Negative indexing starts from the end of a tuple. Index -1 returns the last element, which is 40."
      },
      {
        id: "qq66",
        text: "What happens when you try to modify an element of a tuple?",
        code: "values = (10, 20, 30)\nvalues[1] = 50",
        options: [
          "The tuple becomes (10, 50, 30)",
          "The tuple becomes a list",
          "A TypeError occurs because tuples are immutable",
          "The element is automatically ignored"
        ],
        correctIndex: 2,
        explanation: "Tuples are immutable, meaning their elements cannot be changed after creation. Attempting to assign a new value to an element raises a TypeError."
      }
    ],
  },
  {
    id: "q8", topicId: "t10", topicTitle: "Sets", difficulty: "beginner", xpReward: 50,
    timeLimit: 600, completed: false,
    questions: [
      { id: "qq23", text: "What happens when duplicate values are added to a set?", options: ["All duplicates remain", "Duplicates are removed", "The program stops", "Values become a list"], correctIndex: 1, explanation: "Sets store unique elements." },
      { id: "qq24", text: "Which operator calculates the union of two sets?", options: ["&", "|", "-", "%"], correctIndex: 1, explanation: "The | operator combines elements from both sets." },
      { id: "qq25", text: "What does set.intersection(other) return?", options: ["All elements from both sets", "Elements only in the first set", "Elements common to both sets", "A sorted list"], correctIndex: 2, explanation: "Intersection returns elements shared by both sets." },

      {
        id: "qq67",
        text: "What is the output of this code?",
        code: "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a - b)",
        options: ["{1, 2}", "{4, 5}", "{3}", "{1, 2, 3, 4, 5}"],
        correctIndex: 0,
        explanation: "The - operator performs set difference. It returns elements present in the first set but not in the second, so the result is {1, 2}."
      },
      {
        id: "qq68",
        text: "Which method adds a single element to an existing set?",
        options: ["append()", "add()", "insert()", "extend()"],
        correctIndex: 1,
        explanation: "The add() method adds a single element to a set. Unlike lists, sets do not use append()."
      }
    ],
  },
  {
    id: "q9", topicId: "t13", topicTitle: "Recursion", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq26", text: "What is the purpose of a base case in recursion?", options: ["To repeat forever", "To stop recursive calls", "To create a class", "To import a module"], correctIndex: 1, explanation: "A base case terminates recursion when the stopping condition is reached." },
      { id: "qq27", text: "What is the output?", code: "def count(n):\n    if n == 0:\n        return 0\n    return 1 + count(n - 1)\nprint(count(3))", options: ["0", "2", "3", "4"], correctIndex: 2, explanation: "The function makes recursive calls until n reaches zero, counting three steps." },
      { id: "qq28", text: "What can happen if recursion has no valid stopping condition?", options: ["Automatic sorting", "RecursionError", "The function becomes a list", "Nothing happens"], correctIndex: 1, explanation: "Unbounded recursive calls can exceed Python's recursion limit." },

      {
        id: "qq69",
        text: "What is the output of this recursive function?",
        code: "def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))",
        options: ["10", "16", "24", "120"],
        correctIndex: 2,
        explanation: "factorial(4) calculates 4 × 3 × 2 × 1, which equals 24. Each call reduces n until the base case n == 1 is reached."
      },
      {
        id: "qq70",
        text: "What is the purpose of the return statement in a recursive function?",
        options: [
          "To restart the program",
          "To send a result back to the previous function call",
          "To create a loop automatically",
          "To import another function"
        ],
        correctIndex: 1,
        explanation: "The return statement sends a value back to the calling function. Recursive calls use these returned values to build the final result."
      }
    ],
  },
  {
    id: "q10", topicId: "t14", topicTitle: "Exception Handling", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq29", text: "Which block handles an exception in Python?", options: ["catch", "except", "error", "handle"], correctIndex: 1, explanation: "The except block handles matching exceptions raised in the try block." },
      { id: "qq30", text: "Which exception occurs when dividing an integer by zero?", options: ["ValueError", "TypeError", "ZeroDivisionError", "IndexError"], correctIndex: 2, explanation: "Division by zero raises ZeroDivisionError." },
      { id: "qq31", text: "When does a finally block normally execute?", options: ["Only when an exception occurs", "Only when no exception occurs", "Whether or not an exception occurs", "Only after a return statement in every situation"], correctIndex: 2, explanation: "A finally block normally executes whether an exception occurs or not." },

      {
        id: "qq71",
        text: "What is the purpose of the else block in exception handling?",
        code: "try:\n    result = 10 / 2\nexcept ZeroDivisionError:\n    print('Error')\nelse:\n    print('Success')",
        options: [
          "It executes only when an exception occurs",
          "It executes when no exception occurs in the try block",
          "It always executes, regardless of exceptions",
          "It terminates the program"
        ],
        correctIndex: 1,
        explanation: "The else block runs when the try block completes without raising an exception. Here, division succeeds, so 'Success' is printed."
      },
      {
        id: "qq72",
        text: "Which keyword is used to raise an exception manually in Python?",
        options: ["throw", "error", "raise", "except"],
        correctIndex: 2,
        explanation: "The raise keyword allows a programmer to trigger an exception explicitly, for example: raise ValueError('Invalid input')."
      }
    ],
  },
  {
    id: "q11", topicId: "t15", topicTitle: "File Handling", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq32", text: "Which mode opens a file for reading?", options: ["w", "a", "r", "x"], correctIndex: 2, explanation: "The r mode opens an existing file for reading." },
      { id: "qq33", text: "What is an advantage of using the with statement to open a file?", options: ["It automatically closes the file", "It deletes the file", "It converts text to numbers", "It prevents all file errors"], correctIndex: 0, explanation: "The with statement manages the file context and closes it when the block exits." },
      { id: "qq34", text: "Which method reads the contents of a file as a string?", options: ["read()", "write()", "append()", "closeAll()"], correctIndex: 0, explanation: "read() returns file contents as a string when reading a text file." },
          {
        id: "qq73",
        text: "Which method writes a string to a file?",
        options: ["read()", "write()", "readline()", "open()"],
        correctIndex: 1,
        explanation: "The write() method writes a string to a file."
      },
      {
        id: "qq74",
        text: "What does opening a file in 'a' mode do?",
        options: [
          "Reads the file only",
          "Deletes the file contents",
          "Appends data to the end of the file",
          "Creates a read-only file"
        ],
        correctIndex: 2,
        explanation: "Append mode ('a') adds new data to the end of a file without overwriting its existing contents."
      },
    ],
  },
  {
    id: "q12", topicId: "t16", topicTitle: "Modules & Packages", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq35", text: "Which keyword imports a Python module?", options: ["include", "using", "import", "require"], correctIndex: 2, explanation: "Python uses import to load a module." },
      { id: "qq36", text: "What does import math as m do?", options: ["Deletes math", "Creates the alias m for math", "Defines a function called m", "Installs a package"], correctIndex: 1, explanation: "The as keyword assigns an alias to the imported module." },
      { id: "qq37", text: "Which function helps identify the module name or script entry point?", options: ["__name__", "main()", "module()", "package()"], correctIndex: 0, explanation: "__name__ is a module attribute, commonly checked against '__main__'." },
          {
        id: "qq75",
        text: "Which statement imports only the sqrt function from the math module?",
        options: [
          "import sqrt",
          "include math.sqrt",
          "from math import sqrt",
          "using math.sqrt"
        ],
        correctIndex: 2,
        explanation: "The statement 'from math import sqrt' imports only the sqrt function from the math module."
      },
      {
        id: "qq76",
        text: "What is the main purpose of a Python package?",
        options: [
          "To store only variables",
          "To organize related modules into a directory structure",
          "To execute loops automatically",
          "To replace Python functions"
        ],
        correctIndex: 1,
        explanation: "A package organizes related Python modules into a directory structure, making code easier to manage and reuse."
      },
    ],
  },
  {
    id: "q13", topicId: "t17", topicTitle: "Object-Oriented Programming", difficulty: "intermediate", xpReward: 100,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq38", text: "What is a class in Python?", options: ["A blueprint for creating objects", "A loop", "A file mode", "A package installer"], correctIndex: 0, explanation: "A class defines the attributes and methods that its objects can have." },
      { id: "qq39", text: "What does self usually refer to in an instance method?", options: ["The parent class", "The current instance", "The module", "A global variable"], correctIndex: 1, explanation: "self refers to the instance on which the method is called." },
      { id: "qq40", text: "Which method is commonly used to initialize a new object's attributes?", options: ["__start__", "__init__", "__create__", "__newobject__"], correctIndex: 1, explanation: "__init__ initializes an instance after it is created." },
          {
        id: "qq77",
        text: "Which OOP concept allows a class to inherit properties and methods from another class?",
        options: [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        correctIndex: 1,
        explanation: "Inheritance allows a child class to reuse or extend the attributes and methods of a parent class."
      },
      {
        id: "qq78",
        text: "What is the purpose of encapsulation in Python?",
        options: [
          "To repeat code automatically",
          "To organize code into modules",
          "To bundle data and methods together and control access to them",
          "To convert objects into strings"
        ],
        correctIndex: 2,
        explanation: "Encapsulation bundles data and related methods within a class and helps control access to an object's internal state."
      },
    ],
  },
  {
    id: "q14", topicId: "t18", topicTitle: "Iterators & Generators", difficulty: "intermediate", xpReward: 100,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq41", text: "Which keyword produces a value from a generator?", options: ["return", "yield", "send", "produce"], correctIndex: 1, explanation: "yield produces a value while preserving the generator's state." },
      { id: "qq42", text: "What does iter([1, 2, 3]) return?", options: ["The number 3", "An iterator", "A dictionary", "A generator function definition"], correctIndex: 1, explanation: "iter() obtains an iterator from an iterable." },
      { id: "qq43", text: "What happens when next() is called on an exhausted iterator?", options: ["It restarts automatically", "It returns None automatically", "It raises StopIteration", "It creates a new iterator"], correctIndex: 2, explanation: "An exhausted iterator signals completion by raising StopIteration." },
          {
        id: "qq79",
        text: "Which built-in function is used to create an iterator from an iterable?",
        options: [
          "next()",
          "iter()",
          "yield()",
          "range()"
        ],
        correctIndex: 1,
        explanation: "The iter() function returns an iterator from an iterable object, such as a list or tuple."
      },
      {
        id: "qq80",
        text: "What is a key advantage of using generators in Python?",
        options: [
          "They always execute faster than lists",
          "They store every value in memory at once",
          "They produce values on demand, which can save memory",
          "They can only generate integer values"
        ],
        correctIndex: 2,
        explanation: "Generators produce values on demand instead of storing all values in memory at once, which can save memory."
      },
    ],
  },
  {
    id: "q15", topicId: "t19", topicTitle: "Lambda Functions", difficulty: "intermediate", xpReward: 80,
    timeLimit: 720, completed: false,
    questions: [
      { id: "qq44", text: "What does this expression return?", code: "(lambda x: x * 2)(4)", options: ["2", "4", "6", "8"], correctIndex: 3, explanation: "The lambda multiplies its argument, 4, by 2." },
      { id: "qq45", text: "Which statement best describes a lambda function?", options: ["An anonymous function expression", "A class constructor only", "A loop keyword", "A file operation"], correctIndex: 0, explanation: "A lambda expression creates a small anonymous function." },
      { id: "qq46", text: "What is the result?", code: "nums = [3, 1, 2]\nprint(sorted(nums, key=lambda x: -x))", options: ["[1, 2, 3]", "[3, 2, 1]", "[2, 1, 3]", "[3, 1, 2]"], correctIndex: 1, explanation: "The negative key sorts the numbers in descending order." },
          {
        id: "qq81",
        text: "Which built-in function is commonly used to create an iterator from an iterable?",
        options: [
          "next()",
          "iter()",
          "yield()",
          "range()"
        ],
        correctIndex: 1,
        explanation: "The iter() function returns an iterator from an iterable object, such as a list or tuple."
      },
      {
        id: "qq82",
        text: "What is a key advantage of using generators in Python?",
        options: [
          "They always execute faster than lists",
          "They store every value in memory at once",
          "They produce values lazily, which can save memory",
          "They can only generate integer values"
        ],
        correctIndex: 2,
        explanation: "Generators produce values on demand instead of storing all values in memory at once, which can save memory."
      },
    ],
  },
{
    id: "q16",
    topicId: "t1",
    topicTitle: "Python Introduction",
    difficulty: "beginner",
    xpReward: 50,
    timeLimit: 600,
    completed: false,
    questions: [
      {
        id: "qq47",
        text: "Who created Python?",
        options: ["James Gosling", "Guido van Rossum", "Dennis Ritchie", "Bjarne Stroustrup"],
        correctIndex: 1,
        explanation: "Guido van Rossum created Python, which was first released in 1991."
      },
      {
        id: "qq48",
        text: "What is the output of print('Hello')?",
        code: "print('Hello')",
        options: ["'Hello'", "Hello", "print Hello", "Error"],
        correctIndex: 1,
        explanation: "The print() function displays Hello without quotation marks."
      },
      {
        id: "qq49",
        text: "Python is generally described as which type of language?",
        options: ["High-level language", "Machine code only", "Markup language", "Database language"],
        correctIndex: 0,
        explanation: "Python is a high-level programming language."
      }
    ]
  },
  {
    id: "q17",
    topicId: "t2",
    topicTitle: "Variables & Data Types",
    difficulty: "beginner",
    xpReward: 50,
    timeLimit: 600,
    completed: false,
    questions: [
      {
        id: "qq50",
        text: "What is the data type of 3.14?",
        options: ["int", "str", "float", "bool"],
        correctIndex: 2,
        explanation: "Numbers containing a decimal point are generally represented as float."
      },
      {
        id: "qq51",
        text: "What is the output?",
        code: "x = 10\nprint(type(x).__name__)",
        options: ["float", "int", "str", "bool"],
        correctIndex: 1,
        explanation: "The value 10 is an integer, so its type name is int."
      },
      {
        id: "qq52",
        text: "Which value represents True or False?",
        options: ["str", "float", "bool", "list"],
        correctIndex: 2,
        explanation: "The bool data type represents Boolean values True and False."
      }
    ]
  },
  {
    id: "q18",
    topicId: "t3",
    topicTitle: "Operators",
    difficulty: "beginner",
    xpReward: 50,
    timeLimit: 600,
    completed: false,
    questions: [
      {
        id: "qq53",
        text: "What is the result of 10 // 3?",
        code: "print(10 // 3)",
        options: ["3.33", "3", "1", "0"],
        correctIndex: 1,
        explanation: "Floor division returns the quotient rounded down to an integer in this example."
      },
      {
        id: "qq54",
        text: "Which operator checks whether two values are equal?",
        options: ["=", "==", "!=", ">="],
        correctIndex: 1,
        explanation: "The == operator compares two values for equality."
      },
      {
        id: "qq55",
        text: "What is the result of 2 ** 3?",
        code: "print(2 ** 3)",
        options: ["5", "6", "8", "9"],
        correctIndex: 2,
        explanation: "The ** operator performs exponentiation, so 2 to the power of 3 is 8."
      }
    ]
  },
  {
    id: "q19",
    topicId: "t4",
    topicTitle: "Input & Output",
    difficulty: "beginner",
    xpReward: 50,
    timeLimit: 600,
    completed: false,
    questions: [
      {
        id: "qq56",
        text: "Which function displays output in Python?",
        options: ["input()", "displayText()", "print()", "output()"],
        correctIndex: 2,
        explanation: "The print() function displays output."
      },
      {
        id: "qq57",
        text: "What data type does input() return by default?",
        options: ["int", "float", "str", "bool"],
        correctIndex: 2,
        explanation: "input() returns the entered value as a string by default."
      },
      {
        id: "qq58",
        text: "Which function converts a numeric string to an integer?",
        options: ["str()", "int()", "floatText()", "input()"],
        correctIndex: 1,
        explanation: "int() converts a valid numeric string, such as '25', into an integer."
      }
    ]
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: "c1", title: "Reverse a String", difficulty: "beginner",
    description: "Write a function that reverses a given string.",
    topic: "Strings", xpReward: 50, estimatedMinutes: 10,
    status: "completed",
    problemStatement: "Given a string s, return the string reversed. The function should handle empty strings and single characters correctly.",
    inputFormat: "A single string s (0 ≤ len(s) ≤ 1000)",
    outputFormat: "The reversed string.",
    examples: [
      { input: "hello", output: "olleh", explanation: "Reading 'hello' backwards gives 'olleh'." },
      { input: "Python", output: "nohtyP" },
      { input: "", output: "" },
    ],
    constraints: ["0 ≤ len(s) ≤ 1000", "s contains only printable ASCII characters"],
    hints: [
      { id: "h1", text: "Python strings support slicing. Consider using [start:stop:step] notation.", xpCost: 10 },
      { id: "h2", text: "The slice [::-1] reverses any sequence in Python.", xpCost: 20 },
    ],
    starterCode: "def reverse_string(s: str) -> str:\n    # Write your solution here\n    pass\n\n# Test your solution\nprint(reverse_string('hello'))  # Expected: olleh",
    testCases: [
      { id: "tc1", input: "hello", expectedOutput: "olleh", passed: true },
      { id: "tc2", input: "Python", expectedOutput: "nohtyP", passed: true },
      { id: "tc3", input: "", expectedOutput: "", passed: true },
      { id: "tc4", input: "a", expectedOutput: "a", passed: true },
    ],
  },
  {
    id: "c2", title: "Find the Largest Number", difficulty: "beginner",
    description: "Find the largest number in a list without using built-in max().",
    topic: "Lists", xpReward: 50, estimatedMinutes: 15,
    status: "unlocked",
    problemStatement: "Given a list of integers, find and return the largest number. Do not use Python's built-in max() function.",
    inputFormat: "A list of integers nums (1 ≤ len(nums) ≤ 10^4, -10^9 ≤ nums[i] ≤ 10^9)",
    outputFormat: "An integer — the largest element.",
    examples: [
      { input: "[3, 1, 4, 1, 5, 9, 2, 6]", output: "9", explanation: "9 is the maximum value in the list." },
      { input: "[-5, -2, -8, -1]", output: "-1" },
    ],
    constraints: ["1 ≤ len(nums) ≤ 10^4", "Do not use max() built-in"],
    hints: [
      { id: "h3", text: "Start with the first element as the current maximum.", xpCost: 10 },
      { id: "h4", text: "Iterate through the list, updating your maximum whenever you find a larger value.", xpCost: 20 },
    ],
    starterCode: "def find_largest(nums: list) -> int:\n    # Write your solution here\n    # Do not use max() built-in\n    pass\n\nprint(find_largest([3, 1, 4, 1, 5, 9, 2, 6]))  # Expected: 9",
    testCases: [
      { id: "tc5", input: "[3, 1, 4, 1, 5, 9, 2, 6]", expectedOutput: "9" },
      { id: "tc6", input: "[-5, -2, -8, -1]", expectedOutput: "-1" },
      { id: "tc7", input: "[42]", expectedOutput: "42" },
      { id: "tc8", input: "[1, 1, 1, 1]", expectedOutput: "1" },
    ],
  },
  {
    id: "c3", title: "Check Palindrome", difficulty: "beginner",
    description: "Determine if a string is a palindrome (reads same forwards and backwards).",
    topic: "Strings", xpReward: 50, estimatedMinutes: 10,
    status: "completed",
    problemStatement: "Write a function to check if a given string is a palindrome. Ignore case and non-alphanumeric characters.",
    inputFormat: "A string s",
    outputFormat: "True if palindrome, False otherwise",
    examples: [
      { input: "racecar", output: "True" },
      { input: "A man a plan a canal Panama", output: "True" },
      { input: "hello", output: "False" },
    ],
    constraints: ["0 ≤ len(s) ≤ 10^5"],
    hints: [{ id: "h5", text: "Normalize the string: lowercase and keep only alphanumeric chars.", xpCost: 10 }],
    starterCode: "def is_palindrome(s: str) -> bool:\n    pass",
    testCases: [{ id: "tc9", input: "racecar", expectedOutput: "True", passed: true }],
  },
  {
    id: "c4", title: "FizzBuzz", difficulty: "beginner",
    description: "The classic FizzBuzz problem for divisibility testing.",
    topic: "Loops", xpReward: 50, estimatedMinutes: 10,
    status: "completed",
    problemStatement: "Print numbers from 1 to n. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    inputFormat: "Integer n (1 ≤ n ≤ 100)",
    outputFormat: "Lines of numbers/Fizz/Buzz/FizzBuzz",
    examples: [{ input: "15", output: "1\\n2\\nFizz\\n4\\nBuzz\\n..." }],
    constraints: ["1 ≤ n ≤ 100"],
    hints: [{ id: "h6", text: "Use the modulo operator % to check divisibility.", xpCost: 10 }],
    starterCode: "def fizzbuzz(n: int):\n    pass",
    testCases: [{ id: "tc10", input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz", passed: true }],
  },
  {
    id: "c5", title: "Count Vowels", difficulty: "beginner",
    description: "Count the number of vowels in a given string.",
    topic: "Strings", xpReward: 50, estimatedMinutes: 10,
    status: "unlocked",
    problemStatement: "Write a function that counts the number of vowels (a, e, i, o, u) in a string. Case insensitive.",
    inputFormat: "A string s",
    outputFormat: "An integer count of vowels",
    examples: [{ input: "Hello World", output: "3" }],
    constraints: ["0 ≤ len(s) ≤ 10^5"],
    hints: [{ id: "h7", text: "Define a set of vowels and check each character.", xpCost: 10 }],
    starterCode: "def count_vowels(s: str) -> int:\n    pass",
    testCases: [{ id: "tc11", input: "Hello World", expectedOutput: "3" }],
  },
  {
    id: "c6", title: "Fibonacci Sequence", difficulty: "intermediate",
    description: "Generate the first n numbers of the Fibonacci sequence.",
    topic: "Functions", xpReward: 75, estimatedMinutes: 20,
    status: "locked", requiredXp: 500,
    problemStatement: "Write a function that returns a list of the first n Fibonacci numbers.",
    inputFormat: "Integer n (1 ≤ n ≤ 50)",
    outputFormat: "A list of n Fibonacci numbers",
    examples: [{ input: "7", output: "[0, 1, 1, 2, 3, 5, 8]" }],
    constraints: ["1 ≤ n ≤ 50"],
    hints: [{ id: "h8", text: "Each Fibonacci number is the sum of the two preceding ones.", xpCost: 10 }],
    starterCode: "def fibonacci(n: int) -> list:\n    pass",
    testCases: [{ id: "tc12", input: "7", expectedOutput: "[0, 1, 1, 2, 3, 5, 8]" }],
  },
  {
    id: "c7", title: "Two Sum", difficulty: "intermediate",
    description: "Find two numbers that add up to a target value.",
    topic: "Lists", xpReward: 75, estimatedMinutes: 25,
    status: "locked", requiredXp: 800,
    problemStatement: "Given an array of integers nums and a target integer, return indices of the two numbers that add up to target.",
    inputFormat: "Array nums and integer target",
    outputFormat: "List of two indices [i, j]",
    examples: [{ input: "nums=[2,7,11,15], target=9", output: "[0, 1]" }],
    constraints: ["2 ≤ len(nums) ≤ 10^4", "Exactly one valid answer exists"],
    hints: [{ id: "h9", text: "Use a hash map to store complement values.", xpCost: 20 }],
    starterCode: "def two_sum(nums: list, target: int) -> list:\n    pass",
    testCases: [{ id: "tc13", input: "[2,7,11,15], 9", expectedOutput: "[0, 1]" }],
  },
  {
    id: "c8", title: "Binary Search", difficulty: "intermediate",
    description: "Implement binary search on a sorted list.",
    topic: "Algorithms", xpReward: 75, estimatedMinutes: 25,
    status: "locked", requiredLevel: 6,
    problemStatement: "Implement binary search. Return the index of the target or -1 if not found.",
    inputFormat: "Sorted list nums and target integer",
    outputFormat: "Index of target or -1",
    examples: [{ input: "nums=[-1,0,3,5,9,12], target=9", output: "4" }],
    constraints: ["Array is sorted in ascending order"],
    hints: [{ id: "h10", text: "Maintain left and right pointers and repeatedly halve the search space.", xpCost: 20 }],
    starterCode: "def binary_search(nums: list, target: int) -> int:\n    pass",
    testCases: [{ id: "tc14", input: "[-1,0,3,5,9,12], 9", expectedOutput: "4" }],
  },
  {
    id: "c9", title: "Merge Sort", difficulty: "advanced",
    description: "Implement the merge sort algorithm.",
    topic: "Algorithms", xpReward: 100, estimatedMinutes: 40,
    status: "locked", requiredLevel: 8,
    problemStatement: "Implement merge sort — a divide-and-conquer sorting algorithm with O(n log n) complexity.",
    inputFormat: "An unsorted list of integers",
    outputFormat: "The sorted list",
    examples: [{ input: "[38, 27, 43, 3, 9, 82, 10]", output: "[3, 9, 10, 27, 38, 43, 82]" }],
    constraints: ["0 ≤ len(nums) ≤ 10^5"],
    hints: [{ id: "h11", text: "Divide the list in half recursively until single elements remain.", xpCost: 30 }],
    starterCode: "def merge_sort(nums: list) -> list:\n    pass",
    testCases: [{ id: "tc15", input: "[38, 27, 43, 3]", expectedOutput: "[3, 27, 38, 43]" }],
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "First Steps", description: "Complete your first lesson.", icon: "BookOpen", requirement: "Complete 1 lesson", progress: 1, total: 1, earned: true, earnedAt: "2024-10-16", xpReward: 25, category: "learning" },
  { id: "a2", title: "Code Warrior", description: "Complete 10 coding challenges.", icon: "Code2", requirement: "Complete 10 challenges", progress: 24, total: 10, earned: true, earnedAt: "2024-11-03", xpReward: 100, category: "challenges" },
  { id: "a3", title: "Quiz Master", description: "Score 90%+ in 5 different quizzes.", icon: "Trophy", requirement: "Score 90%+ in 5 quizzes", progress: 5, total: 5, earned: true, earnedAt: "2024-11-10", xpReward: 75, category: "accuracy" },
  { id: "a4", title: "Consistent Learner", description: "Maintain a 7-day learning streak.", icon: "Flame", requirement: "7-day streak", progress: 12, total: 7, earned: true, earnedAt: "2024-11-08", xpReward: 50, category: "streaks" },
  { id: "a5", title: "Speed Coder", description: "Complete a coding challenge within the target time.", icon: "Zap", requirement: "Complete challenge under time limit", progress: 1, total: 1, earned: true, earnedAt: "2024-11-15", xpReward: 50, category: "speed" },
  { id: "a6", title: "Perfect Score", description: "Score 100% on a quiz.", icon: "Star", requirement: "100% quiz score", progress: 3, total: 1, earned: true, earnedAt: "2024-11-20", xpReward: 30, category: "accuracy" },
  { id: "a7", title: "Loop Master", description: "Complete all loop exercises.", icon: "RefreshCw", requirement: "Complete loops topic 100%", progress: 65, total: 100, earned: false, xpReward: 40, category: "learning" },
  { id: "a8", title: "String Ninja", description: "Complete 5 string-related challenges.", icon: "Type", requirement: "Complete 5 string challenges", progress: 3, total: 5, earned: false, xpReward: 60, category: "challenges" },
  { id: "a9", title: "Night Owl", description: "Complete a lesson after 10 PM.", icon: "Moon", requirement: "Learn after 10 PM", progress: 0, total: 1, earned: false, xpReward: 20, category: "learning" },
  { id: "a10", title: "Python Master", description: "Complete the entire advanced curriculum.", icon: "Award", requirement: "100% advanced topics", progress: 0, total: 100, earned: false, xpReward: 500, category: "learning" },
  { id: "a11", title: "Streak Legend", description: "Maintain a 30-day learning streak.", icon: "Flame", requirement: "30-day streak", progress: 12, total: 30, earned: false, xpReward: 200, category: "streaks" },
  { id: "a12", title: "Challenge Hunter", description: "Complete 25 coding challenges.", icon: "Target", requirement: "Complete 25 challenges", progress: 24, total: 25, earned: false, xpReward: 150, category: "challenges" },
];

export const XP_TRANSACTIONS: XPTransaction[] = [
  { id: "x1", amount: 50, description: "Completed: Loop Challenge", type: "earned", createdAt: "2024-11-22T18:32:00Z" },
  { id: "x2", amount: 20, description: "Completed: Loops Quiz", type: "earned", createdAt: "2024-11-22T16:15:00Z" },
  { id: "x3", amount: -10, description: "Used Hint: Loops Challenge", type: "spent", createdAt: "2024-11-22T15:50:00Z" },
  { id: "x4", amount: 75, description: "Completed: Daily Challenge", type: "earned", createdAt: "2024-11-21T20:00:00Z" },
  { id: "x5", amount: 10, description: "Completed: Python Introduction", type: "earned", createdAt: "2024-11-21T14:00:00Z" },
  { id: "x6", amount: 50, description: "Completed: Check Palindrome", type: "earned", createdAt: "2024-11-20T11:20:00Z" },
  { id: "x7", amount: 25, description: "Achievement: Perfect Score", type: "earned", createdAt: "2024-11-20T11:00:00Z" },
  { id: "x8", amount: 20, description: "Completed: Strings Quiz", type: "earned", createdAt: "2024-11-19T17:40:00Z" },
  { id: "x9", amount: 50, description: "Completed: FizzBuzz", type: "earned", createdAt: "2024-11-19T16:00:00Z" },
  { id: "x10", amount: -20, description: "Used Hint: Two Sum", type: "spent", createdAt: "2024-11-18T21:00:00Z" },
  { id: "x11", amount: 10, description: "Completed: Variables & Types", type: "earned", createdAt: "2024-11-18T15:30:00Z" },
  { id: "x12", amount: 50, description: "Completed: Reverse a String", type: "earned", createdAt: "2024-11-17T19:00:00Z" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Challenge Unlocked", message: "You've unlocked 'Fibonacci Sequence'. You have enough XP to attempt it.", type: "unlock", read: false, createdAt: "2024-11-22T18:35:00Z" },
  { id: "n2", title: "+50 XP Earned", message: "Great work completing the Loop Challenge! You earned 50 XP.", type: "xp", read: false, createdAt: "2024-11-22T18:32:00Z" },
  { id: "n3", title: "12-Day Streak!", message: "You've maintained your learning streak for 12 consecutive days. Keep it up!", type: "streak", read: false, createdAt: "2024-11-22T09:00:00Z" },
  { id: "n4", title: "New Daily Challenge", message: "Today's daily challenge is available: 'Find the Largest Number'. +75 XP reward.", type: "challenge", read: true, createdAt: "2024-11-22T00:00:00Z" },
  { id: "n5", title: "Achievement Unlocked", message: "You earned the 'Speed Coder' achievement! +50 XP bonus.", type: "achievement", read: true, createdAt: "2024-11-15T14:20:00Z" },
  { id: "n6", title: "Quiz Master Achievement", message: "You've scored 90%+ in 5 different quizzes. Achievement unlocked!", type: "achievement", read: true, createdAt: "2024-11-10T12:00:00Z" },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "u10", name: "Alex Chen", username: "alex_c", level: 9, levelTitle: "Python Pro", xp: 4850, challengesCompleted: 52, achievementsCount: 18, streak: 34 },
  { rank: 2, userId: "u11", name: "Rahul Sharma", username: "rahul_s", level: 9, levelTitle: "Python Pro", xp: 4620, challengesCompleted: 48, achievementsCount: 16, streak: 28 },
  { rank: 3, userId: "u1", name: "Shweta Gupta", username: "shweta_g", level: 7, levelTitle: "Code Master", xp: 2450, challengesCompleted: 24, achievementsCount: 6, streak: 12, isCurrentUser: true },
  { rank: 4, userId: "u12", name: "Priya Patel", username: "priya_p", level: 7, levelTitle: "Code Master", xp: 2280, challengesCompleted: 22, achievementsCount: 8, streak: 9 },
  { rank: 5, userId: "u13", name: "Marcus Johnson", username: "marcus_j", level: 6, levelTitle: "Python Developer", xp: 1890, challengesCompleted: 18, achievementsCount: 7, streak: 15 },
  { rank: 6, userId: "u14", name: "Sofia Andersson", username: "sofia_a", level: 6, levelTitle: "Python Developer", xp: 1720, challengesCompleted: 16, achievementsCount: 5, streak: 6 },
  { rank: 7, userId: "u15", name: "James Wilson", username: "james_w", level: 5, levelTitle: "Python Builder", xp: 1340, challengesCompleted: 14, achievementsCount: 4, streak: 21 },
  { rank: 8, userId: "u16", name: "Aisha Okonkwo", username: "aisha_o", level: 5, levelTitle: "Python Builder", xp: 1190, challengesCompleted: 12, achievementsCount: 4, streak: 8 },
  { rank: 9, userId: "u17", name: "Tomás Herrera", username: "tomas_h", level: 4, levelTitle: "Code Adventurer", xp: 780, challengesCompleted: 8, achievementsCount: 3, streak: 5 },
  { rank: 10, userId: "u18", name: "Yuki Tanaka", username: "yuki_t", level: 4, levelTitle: "Code Adventurer", xp: 650, challengesCompleted: 7, achievementsCount: 2, streak: 3 },
];

export const ACTIVITY: ActivityEntry[] = [
  { id: "act1", type: "challenge", title: "Completed: Loop Challenge", xp: 50, createdAt: "2024-11-22T18:32:00Z" },
  { id: "act2", type: "quiz", title: "Completed: Loops Quiz (95%)", xp: 20, createdAt: "2024-11-22T16:15:00Z" },
  { id: "act3", type: "challenge", title: "Completed: Daily Challenge", xp: 75, createdAt: "2024-11-21T20:00:00Z" },
  { id: "act4", type: "lesson", title: "Completed: Python Introduction", xp: 10, createdAt: "2024-11-21T14:00:00Z" },
  { id: "act5", type: "challenge", title: "Completed: Check Palindrome", xp: 50, createdAt: "2024-11-20T11:20:00Z" },
  { id: "act6", type: "achievement", title: "Earned: Perfect Score achievement", xp: 25, createdAt: "2024-11-20T11:00:00Z" },
  { id: "act7", type: "unlock", title: "Unlocked: Python Strings topic", createdAt: "2024-11-19T18:00:00Z" },
  { id: "act8", type: "quiz", title: "Completed: Strings Quiz (88%)", xp: 20, createdAt: "2024-11-19T17:40:00Z" },
];

export const STREAK_DAYS: StreakDay[] = [
  { date: "2024-11-11", active: true, xpEarned: 60 },
  { date: "2024-11-12", active: true, xpEarned: 80 },
  { date: "2024-11-13", active: true, xpEarned: 30 },
  { date: "2024-11-14", active: true, xpEarned: 120 },
  { date: "2024-11-15", active: true, xpEarned: 200 },
  { date: "2024-11-16", active: true, xpEarned: 50 },
  { date: "2024-11-17", active: true, xpEarned: 70 },
  { date: "2024-11-18", active: true, xpEarned: 40 },
  { date: "2024-11-19", active: true, xpEarned: 90 },
  { date: "2024-11-20", active: true, xpEarned: 125 },
  { date: "2024-11-21", active: true, xpEarned: 95 },
  { date: "2024-11-22", active: true, xpEarned: 145 },
  { date: "2024-11-23", active: false, xpEarned: 0 },
];

export const DAILY_CHALLENGE: DailyChallenge = {
  id: "dc1", challengeId: "c2", title: "Find the Largest Number",
  difficulty: "beginner", xpReward: 75, estimatedMinutes: 15,
  completed: false, date: "2024-11-22",
};

export const ANALYTICS: AnalyticsData = {
  xpByWeek: [
    { week: "Oct W3", xp: 120 }, { week: "Oct W4", xp: 190 }, { week: "Nov W1", xp: 280 },
    { week: "Nov W2", xp: 340 }, { week: "Nov W3", xp: 410 }, { week: "Nov W4", xp: 510 },
  ],
  accuracyByTopic: [
    { topic: "Variables", accuracy: 95 }, { topic: "Loops", accuracy: 88 },
    { topic: "Strings", accuracy: 92 }, { topic: "Lists", accuracy: 85 },
    { topic: "Functions", accuracy: 78 }, { topic: "Conditions", accuracy: 97 },
  ],
  challengesByDifficulty: [
    { difficulty: "Beginner", count: 18 }, { difficulty: "Intermediate", count: 5 },
    { difficulty: "Advanced", count: 1 }, { difficulty: "Expert", count: 0 },
  ],
  weeklyActivity: [
    { day: "Mon", xp: 95, lessons: 2, challenges: 1 },
    { day: "Tue", xp: 140, lessons: 1, challenges: 2 },
    { day: "Wed", xp: 40, lessons: 1, challenges: 0 },
    { day: "Thu", xp: 125, lessons: 2, challenges: 1 },
    { day: "Fri", xp: 200, lessons: 0, challenges: 3 },
    { day: "Sat", xp: 80, lessons: 2, challenges: 1 },
    { day: "Sun", xp: 145, lessons: 1, challenges: 2 },
  ],
  topicMastery: [
    { topic: "Variables", mastery: 100 }, { topic: "Operators", mastery: 100 },
    { topic: "Conditions", mastery: 100 }, { topic: "Loops", mastery: 65 },
    { topic: "Strings", mastery: 20 }, { topic: "Lists", mastery: 0 },
    { topic: "Functions", mastery: 0 }, { topic: "OOP", mastery: 0 },
  ],
};
