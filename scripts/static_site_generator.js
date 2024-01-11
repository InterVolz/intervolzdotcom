const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const Handlebars = require('handlebars');
const hljs = require('highlight.js');

const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
})



const { formatHumanReadableDate, countWords } = require('./utils');

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
                    metadata['Year'] = metadata.Date.split('/')[2];
                    metadata['FullPath'] = `posts/${metadata['Year']}/${metadata['URL']}/`
                }

                if(key.includes('Tags')) {
                    metadata['Tags'] = metadata.Tags.split(',').map(item => item.trim());
                }

            } else {
                // Rest of the article content
                metadata['WordCount'] = countWords(content)
                metadata['ReadEstimate'] = (metadata['WordCount'] / 60).toFixed(1)
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
    
        // Extract year from the date
        const year = metadata.Date.split('/')[2];
        // Normalize the title to create a URL-friendly string
    
        // Define the directory path for the article
        // Updated to use the /posts/{{year}}/{{title}} format
        const articleDir = path.join(__dirname, '..', 'src', 'posts', metadata.Year, metadata.URL);
    
        // Ensure the article directory exists
        if (!fs.existsSync(articleDir)){
            fs.mkdirSync(articleDir, { recursive: true });
        }
    
        // Write the final HTML to the article directory as index.html
        fs.writeFileSync(path.join(articleDir, 'index.html'), htmlOutput);
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
                url: article.metadata.FullPath // Adjust URL as needed
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

        const archiveDir = path.join(__dirname, '..', 'src', 'archive');

        // Ensure the tag directory exists
        if (!fs.existsSync(archiveDir)){
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'archive', 'index.html'), htmlOutput);
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
            const tags = article.metadata.Tags;
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

        const tagsPath = path.join(__dirname, '..', 'src', 'tags')
        if (!fs.existsSync(tagsPath)){
            fs.mkdirSync(tagsPath, { recursive: true });
        }

        // Write the final HTML to the src directory
        fs.writeFileSync(path.join(__dirname, '..', 'src', 'tags', 'index.html'), htmlOutput);
    }

    generateTagPage(tagObject) {
        const tagString = tagObject.tag; // Extracting the tag string from the tag object
        console.log(tagString);
    
        // Articles filtered by the given tag
        const taggedArticles = this.articles.filter(article => 
            article.metadata.Tags.map(t => t.trim()).includes(tagString));
    
        // Load the Handlebars template for the tag page
        const templateSource = fs.readFileSync(path.join(__dirname, '..', 'templates', 'tag.hbs'), 'utf-8');
        const template = Handlebars.compile(templateSource);
    
        // Create data object for the template
        const data = {
            tag: tagString,
            articles: taggedArticles.map(article => ({
                title: article.metadata.Title,
                date: article.metadata.HumanDate,
                url: article.metadata.FullPath
            }))
        };
    
        // Generate HTML for this tag page
        const htmlOutput = template(data);
    
        // Define the directory path for this tag page
        const tagDir = path.join(__dirname, '..', 'src', 'tags', tagString);
        console.log(tagDir);
    
        // Ensure the tag directory exists
        if (!fs.existsSync(tagDir)){
            fs.mkdirSync(tagDir, { recursive: true });
        }
    
        // Write the final HTML to the tag directory as index.html
        fs.writeFileSync(path.join(tagDir, 'index.html'), htmlOutput);
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
        
        // Define the directory path for the about page
        const aboutDir = path.join(__dirname, '..', 'src', 'about');

        // Ensure the about directory exists
        if (!fs.existsSync(aboutDir)){
            fs.mkdirSync(aboutDir, { recursive: true });
        }

        // Write the final HTML to the about directory as index.html
        fs.writeFileSync(path.join(aboutDir, 'index.html'), htmlOutput);
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

