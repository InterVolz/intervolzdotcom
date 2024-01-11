const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const Handlebars = require('handlebars');
const md = new MarkdownIt();

const { formatHumanReadableDate } = require('./utils');

class SiteGenerator {
    constructor() {
        this.articles = []; // Array to hold article metadata
        this.tags = new Set(); // Set to hold unique tags
    }

    // Load articles from markdown files
    loadArticles() {
        // Path to the articles directory
        const articlesDir = path.join(__dirname, '..', 'articles');

        // Read all markdown files from the articles directory
        const articleFiles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

        articleFiles.forEach(file => {
            const filePath = path.join(articlesDir, file);
            const articleContent = fs.readFileSync(filePath, 'utf-8');
            const { metadata, content } = this.parseArticle(articleContent);

            // Process each article - render HTML, save file, etc.
            this.processArticle(metadata, content);
            this.articles.push({ metadata, content });
        });
    }

    parseArticle(articleContent) {
        const lines = articleContent.split('\n');
        let metadata = {};
        let content = '';
    
        lines.forEach((line, index) => {
            if (index < 5) {
                // Extract metadata
                const [key, value] = line.split(':').map(part => part.trim());
                metadata[key.replace('@@', '')] = value;
    
                // When the date is found, format it and add to metadata
                if (key.includes('Date')) {
                    metadata['HumanDate'] = formatHumanReadableDate(value);
                }
            } else {
                // Rest of the article content
                content += line + '\n';
            }
        });
    
        return { metadata, content: content.trim() };
    }

    
    processArticle(metadata, content) {
        const renderedContent = md.render(content);

        // Load Handlebars template for article
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'article.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Insert metadata and content into the template
        const htmlOutput = template({ ...metadata, content: renderedContent });

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', `${metadata.URL}.html`), htmlOutput);
    }

    // Generate homepage
    generateHomepage() {
        // Sort articles by date, descending (newest first)
        const sortedArticles = this.articles.sort((a, b) => new Date(b.metadata.Date) - new Date(a.metadata.Date));

        // Take the first 3 articles
        const latestArticles = sortedArticles.slice(0, 3);

        // Load Handlebars template for homepage
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'homepage.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Create an object with latest articles data for the template
        const data = {
            articles: latestArticles.map(article => ({
                title: article.metadata.Title,
                date: article.metadata.Date,
                humandate: article.metadata.HumanDate,
                tldr: article.metadata.TLDR,
                url: `/${article.metadata.URL}.html` // Adjust URL as needed
            }))
        };

        // Generate the homepage HTML
        const htmlOutput = template(data);

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'index.html'), htmlOutput);
    }

    // Generate archive page
    generateArchive() {
        // Group articles by year
        const articlesByYear = this.groupArticlesByYear();

        // Load Handlebars template for the archive page
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'archive.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Generate the archive page HTML
        const htmlOutput = template({ years: articlesByYear });

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'archive.html'), htmlOutput);
    }

    groupArticlesByYear() {
        const grouped = {};
        this.articles.forEach(article => {
            const year = new Date(article.metadata.Date).getFullYear();
            if (!grouped[year]) {
                grouped[year] = [];
            }
            grouped[year].push(article);
        });

        // Create an array of { year, articles } objects, sorted by year in descending order
        const sortedYears = Object.keys(grouped).sort((a, b) => b - a).map(year => {
            return { year: year, articles: grouped[year] };
        });

        return sortedYears;
    }

    // Generate tags page and tag-specific archives
    generateTagsPages() {
        // Extract and sort tags
        const allTags = this.extractAndSortTags();

        // Generate main tags page
        this.generateMainTagsPage(allTags);

        // Generate individual tag pages
        allTags.forEach(tag => {
            this.generateTagPage(tag);
        });
    }

    extractAndSortTags() {
        const tagsMap = new Map();
        this.articles.forEach(article => {
            const tags = article.metadata.Tags.split(',').map(tag => tag.trim());
            tags.forEach(tag => {
                if (!tagsMap.has(tag)) {
                    tagsMap.set(tag, 1);
                } else {
                    tagsMap.set(tag, tagsMap.get(tag) + 1);
                }
            });
        });

        // Convert the map into an array of { tag, count } objects and sort alphabetically
        const tagsArray = Array.from(tagsMap, ([tag, count]) => ({ tag, count }));
        tagsArray.sort((a, b) => a.tag.localeCompare(b.tag));

        return tagsArray;
    }

    generateMainTagsPage(tags) {
        // Load Handlebars template for the tags page
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'tags.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Generate the tags page HTML
        const htmlOutput = template({ tags });

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'tags.html'), htmlOutput);
    }

    generateTagPage(tag) {
        // Ensure the tags directory exists
        const tagsDir = path.join(__dirname, '..', 'src', 'tags');
        if (!fs.existsSync(tagsDir)){
            fs.mkdirSync(tagsDir, { recursive: true });
        }

        // Filter articles by tag
        const articlesWithTag = this.articles.filter(article => article.metadata.Tags.includes(tag));

        // Load Handlebars template for individual tag page
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'tag.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Generate the individual tag page HTML
        const htmlOutput = template({ tag, articles: articlesWithTag });

        // Write the final HTML to the tags directory
        fs.writeFileSync(path.join(tagsDir, `${tag}.html`), htmlOutput);
    }

    // Generate about page
    generateAboutPage() {
        // Read Markdown content
        const markdownContent = fs.readFileSync(path.join(__dirname, '..', 'about.md'), 'utf-8');

        // Render Markdown to HTML
        const renderedContent = md.render(markdownContent);

        // Load Handlebars template
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'about.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Inject rendered content into template
        const htmlOutput = template({ content: renderedContent });

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'about.html'), htmlOutput);
    }

    // Method to copy assets
    copyAssets() {
        // List of asset directories to copy
        const assetDirs = ['css', 'js', 'images'];

        assetDirs.forEach(dir => {
            const sourceDir = path.join(__dirname, '..', 'assets', dir);
            const destinationDir = path.join(__dirname, '..', 'src', dir);

            this.copyDirectory(sourceDir, destinationDir);
        });
    }

    // Utility method to copy one directory to another
    copyDirectory(source, destination) {
        // Ensure the destination directory exists
        if (!fs.existsSync(destination)){
            fs.mkdirSync(destination, { recursive: true });
        }

        // Read all files from source directory
        const files = fs.readdirSync(source);

        files.forEach(file => {
            const srcFile = path.join(source, file);
            const destFile = path.join(destination, file);

            // Copy file to destination directory
            fs.copyFileSync(srcFile, destFile);
        });
    }

    // Render markdown to HTML
    renderMarkdownToHTML(markdownText) {
        return md.render(markdownText);
    }

    // Build the entire site
    buildSite() {
        this.loadArticles();
        this.generateHomepage();
        this.generateArchive();
        this.generateTagsPages();
        this.generateAboutPage();
        this.copyAssets();
    }
}

const generator = new SiteGenerator();
generator.buildSite();

