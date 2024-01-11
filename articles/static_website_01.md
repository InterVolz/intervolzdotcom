@@Title: Static Website Generator: 2024
@@URL: static-website-2024
@@Date: 1/11/2024
@@TLDR: a short guide to how InterVolz.com and how it's made
@@Tags: web, js, nodejs

- [Overview](#overview)
  - [Key Features](#key-features)
- [Setting Up](#setting-up)
  - [Requirements](#requirements)
- [Running](#running)
  - [Build](#build)
  - [Preview](#preview)
  - [Development Workflow](#development-workflow)
- [Under the Hood](#under-the-hood)
  - [Core Functionalities](#core-functionalities)
  - [Special Features](#special-features)
  - [Customizable Components](#customizable-components)
- [Conclusion](#conclusion)


Welcome to the world of static site generation! Today, we're diving into the making [Intervolz.com](https://intervolz.com/), the very site you are looking at right now! 

This guide will walk you through the setup and usage of this generator, assuming you have a solid grasp of JavaScript, Node.js, and web development concepts.

## Overview

The `intervolzdotcom` generator is a custom-built static site generator. It processes Markdown files into HTML, organizes content by tags and dates, and creates a structured website with a homepage, archive, tag pages, and an about page. The generator uses Handlebars for templating and Markdown-It for rendering Markdown content.

### Key Features
- **Markdown Support:** Converts Markdown files into HTML.
- **Metadata Handling:** Extracts metadata like dates and tags from articles.
- **Custom Templates:** Uses Handlebars templates for rendering pages.
- **Syntax Highlighting:** Integrates Highlight.js for code blocks in articles.

## Setting Up

### Requirements

1. nodejs + npm
2. git

```sh
git clone https://github.com/InterVolz/intervolzdotcom
cd intervolzdotcom
npm install
```

## Running

### Build

Triggers the **static_site_generator.js** script, which reads Markdown files, applies templates, and generates the final HTML files in **/src**:
```sh
# Build the site
npm run build
```

### Preview

Hosts the site at [localhost:3000](localhost:3000):
```sh
# Build the site
npm run build

```
### Development Workflow

Combines watching and serving:
```sh
npm start
```


## Under the Hood

### Core Functionalities
1. **Article Processing:** Reads Markdown files, extracts metadata, and converts them into HTML.
2. **Template Rendering:** Uses Handlebars templates to generate the layout for different pages (home, archive, tag pages, etc.).
3. **Static Assets Management:** Copies assets like CSS, JavaScript, and images to the final build directory.

### Special Features
- **Tag System:** Organizes articles by tags, creating individual pages for each tag.
- **Archive Generation:** Automatically generates an archive page, sorting articles by year.
- **About Page:** Converts a Markdown file into an about page.

### Customizable Components
- **Metadata Extraction:** Flexible metadata handling allows for easy customization.
- **Handlebars Templates:** Modify templates in the `templates` directory to change the site's layout and style.
- **Styling:** Adjust CSS in the `assets` folder to customize the site’s appearance.

## Conclusion

The `intervolzdotcom` static site generator offers a streamlined, customizable approach to building static websites. Its use of modern JavaScript tools and simple design makes it an excellent choice for developers looking for a straightforward yet powerful site generator.

Whether you're a blogger, a developer, or someone who loves tinkering with code, this generator is designed to simplify your web development process, letting you focus on creating great content.

Ready to build your static site? Dive into the `intervolzdotcom` generator and start crafting your web presence today!