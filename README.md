# intervolzdotcom
the website repo


## TODO:

1. /resources - for linking to raw data like scripts and CSVs
2. Post articles for January
3. 

## Article formatting

1. The first 5 lines of the article contain metadata that needs to be parsed and trimmed.
2. The rest of the article will be rendered as HTML using Markdown-it in a Handlebars template

### Example:

/articles/hello_world.md
```md
@@Title: Hello World
@@URL: hello_world
@@Tags: py
@@Date: 1/1/24
@@TLDR: new dawn day me
```

/templates/article
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{{title}}}</title>
    <link rel="stylesheet" href="css/main.css">
    <!-- Add any head elements like CSS links -->
</head>
<body>
    <header>
        <!-- Your site's header content -->
    </header>
    <main>
        <h1 class="title">{{{title}}}</h1>
        <div class="snip">{{{date}}} {{{amount_of_words}}} {{{read_duration}}}</div>
        <div class="content">{{{content}}}</div>
        <div class="tags">{{{tags}}}</div>
    </main>
    <footer>
        <!-- Your site's footer content -->
    </footer>
</body>
</html>

```

## Article Processing

- Parsing Metadata: The parseArticle method splits the article into lines, extracts metadata from the first five lines, and separates the content.
- Rendering and Processing: The processArticle method renders the Markdown content and injects both the rendered content and the metadata into the Handlebars template.

This approach dynamically creates HTML pages for each article, populated with both their metadata and content.