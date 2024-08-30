const govukEleventyPlugin = require('@x-govuk/govuk-eleventy-plugin')

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(govukEleventyPlugin, {
    header: {
      organisationLogo: false,
      organisationName: 'Ministry of Justice',
      productName: 'Hosting data'
    }
  })

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: './src',
      output: './dist',
      layouts: '../node_modules/@x-govuk/govuk-eleventy-plugin/layouts' // use gov.uk layouts
    }
  }
}
