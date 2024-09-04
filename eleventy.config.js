const govukEleventyPlugin = require('@x-govuk/govuk-eleventy-plugin');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
    const markdownItOptions = {
      html: true,
    }
    const markdownItAnchorOptions = {
      permalink: markdownItAnchor.default.permalink.linkInsideHeader({
        symbol: `<span class="header-anchor__icon">
          <b>#</b>
          <span class="visually-hidden">Jump to heading</span>
        </span>`,
        placement: 'before',
      }),
    }
    
    const markdownLib = markdownIt(markdownItOptions).use(markdownItAnchor.default, markdownItAnchorOptions)
    eleventyConfig.setLibrary('md', markdownLib)

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(govukEleventyPlugin, {
        header: {
            organisationName: 'Ministry of Justice',
            organisationLogo: 'royal-arms',
            productName: 'DPS Tech Team docs',
            search: {
                indexPath: '/search.json',
                sitemapPath: '/sitemap'
            }
        },
        footer: {
            copyright: {
                organisationLogo: 'royal-arms',
            },
            meta: {
              items: [
                {
                  href: 'https://github.com/ministryofjustice/san-eleventy-test',
                  text: 'Github Repository',
                  attributes: {
                    target: '_blank'
                  }
                },
                {
                    href: 'mailto: sandhya.gandalwar@digital.justice.gov.uk',
                    text: 'Feedback / Report Problem',
                    attributes: {
                      target: '_blank'
                    }
                  },
                {}
                
              ]
            }
          },
        stylesheets: ["/assets/output.css"]
    })
    eleventyConfig.addWatchTarget('./tailwind.config.js')
    eleventyConfig.addWatchTarget('./src/assets/css/input.css')
    eleventyConfig.addPassthroughCopy({ './_tmp/output.css': './assets/output.css' })
    eleventyConfig.addPassthroughCopy("**/*.png");
    eleventyConfig.addShortcode('version', function () {
        return now
    })

    return {
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        dir: {
            input: './src/content',
            output: './dist',
            layouts: '../../node_modules/@x-govuk/govuk-eleventy-plugin/layouts',
        }
    }
};
