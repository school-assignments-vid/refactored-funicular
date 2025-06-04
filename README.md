# Simple Project Template v0.1.0-alpha.1

A basic project template with a straightforward structure and Tailwind CSS integration for rapid development. All project source files, including a pre-configured `index.html` with Tailwind CSS examples, are located within the `src` directory.

## Core Philosophy & Features

* **Browser-Native HTML:** Build applications where the HTML structure and interactivity are handled directly by the browser, minimizing server-side dependencies for UI rendering.
* **Tailwind CSS:** For rapid, utility-first UI development. (Note: Tailwind CSS requires a CLI build step for the CSS, but the resulting HTML/JS is browser-native).
* **Custom Theme & Animations:** Includes pre-configured theme variables (inspired by Shadcn UI) and animation utility classes within `css/input.css`.
* **Vanilla JS Utilities (lib/):** A comprehensive suite of JavaScript modules to enhance browser-native development, covering DOM manipulation, state management, asynchronous operations, and more, all re-exported from `src/lib/index.js`. These helpers are designed to make working with standard browser features more intuitive.

## Getting Started

1. **Clone the repository (or use this template):**
   ```bash
   git clone https://github.com/kenshintanaka/Simple-Template.git <your-project-name>
   cd <your-project-name>
   ```
2. **Install Dependencies (if any):**
   This template primarily relies on the Tailwind CSS CLI, which can be run via `npx`. Ensure you have Node.js and npm installed.

## Development

This template is set up to use Tailwind CSS for styling. The main `src/index.html` file is already linked to the generated CSS and includes basic examples.

1. **Understand your `input.css`:**
   The `./src/css/input.css` file is where you'll include Tailwind's base styles, components, and utilities. It's also the place for your custom CSS and any pre-existing configurations, such as custom CSS variables (e.g., those from shadcn).
2. **Start the Tailwind CSS development process:**
   Open your terminal and run the following command from the root of the project. This command tells the Tailwind CSS CLI to scan your HTML files (like the pre-configured `src/index.html`) and other specified content sources for Tailwind class names. It then generates the corresponding CSS into `./src/css/output.css` and will continue to watch for any changes you make to your `input.css` or your template files, automatically rebuilding `output.css` as needed.
   ```bash
   npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/output.css --watch
   ```

   As you add or modify Tailwind classes in `src/index.html` or other source files, this command ensures those styles are generated and available in `output.css`.
3. **Develop your application:**
   Open `src/index.html` in your browser to see the example page. Edit your HTML (e.g., `src/index.html`), JavaScript, and `src/css/input.css` files. The Tailwind CSS watch command will automatically update `output.css` with the necessary styles as you use and modify Tailwind classes.

## Lib Folder Modules

The `src/lib/` directory contains a collection of utility JavaScript modules to help with common tasks:

* **`array.js`**: Utility functions for array manipulation.
* **`async.js`**: Helpers for asynchronous operations.
* **`date.js`**: Functions for date and time formatting and manipulation.
* **`dom.js`**: DOM manipulation utilities.
* **`misc.js`**: Miscellaneous utility functions.
* **`number.js`**: Helpers for number formatting and calculations.
* **`object.js`**: Utility functions for object manipulation.
* **`state.js`**: Simple state management utilities.
* **`string.js`**: Functions for string manipulation and formatting.

All these modules are imported and re-exported by the `src/lib/index.js` file for easy access. You can import all or specific modules into your project's JavaScript files like so:

```javascript
// Example: Importing the entire lib bundle
import * as utils from '@/lib/index.js'; // Assuming @/ is mapped to src/
// utils.array.shuffle([...]);
// utils.string.capitalize('hello');

// Example: Importing specific utilities from a module
import { shuffle, unique } from '@/lib/array.js';
// shuffle([...]);

// Example: Importing a specific module
import * as arrayUtils from '@/lib/array.js';
// arrayUtils.shuffle([...]);
```

# License

This project is licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Happy Coding!
