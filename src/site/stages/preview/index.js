// Builds the site using Metalsmith as the top-level build runner.
const Metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdownit');
const navigation = require('metalsmith-navigation');
const permalinks = require('metalsmith-permalinks');
const registerLiquidFilters = require('../../filters/liquid');

const getOptions = require('../build/options');
const environments = require('../../constants/environments');
const createBuildSettings = require('../build/plugins/create-build-settings');
const updateExternalLinks = require('../build/plugins/update-external-links');
const createEnvironmentFilter = require('../build/plugins/create-environment-filter');
const addNonceToScripts = require('../build/plugins/add-nonce-to-scripts');
const leftRailNavResetLevels = require('../build/plugins/left-rail-nav-reset-levels');
const rewriteVaDomains = require('../build/plugins/rewrite-va-domains');
const rewriteAWSUrls = require('../build/plugins/rewrite-cms-aws-urls');
const applyFragments = require('../build/plugins/apply-fragments');
const addAssetHashes = require('../build/plugins/add-asset-hashes');
const addSubheadingsIds = require('../build/plugins/add-id-to-subheadings');

function createPipeline(options) {
  const BUILD_OPTIONS = getOptions(options);
  const smith = Metalsmith(__dirname); // eslint-disable-line new-cap
  const isDevBuild = [environments.LOCALHOST, environments.VAGOVDEV].includes(
    BUILD_OPTIONS.buildtype,
  );

  registerLiquidFilters();

  // Set up Metalsmith. BE CAREFUL if you change the order of the plugins. Read the comments and
  // add comments about any implicit dependencies you are introducing!!!
  //
  smith.source(`${BUILD_OPTIONS.contentPagesRoot}`);
  // smith.destination(BUILD_OPTIONS.destination);

  // This lets us access the {{buildtype}} variable within liquid templates.
  smith.metadata({
    buildtype: BUILD_OPTIONS.buildtype,
    hostUrl: BUILD_OPTIONS.hostUrl,
  });

  smith.use(createEnvironmentFilter(BUILD_OPTIONS));

  smith.use(applyFragments(BUILD_OPTIONS));
  smith.use(collections(BUILD_OPTIONS.collections));
  smith.use(leftRailNavResetLevels());

  // smith.use(cspHash({ pattern: ['js/*.js', 'generated/*.css', 'generated/*.js'] }))

  // Liquid substitution must occur before markdown is run otherwise markdown will escape the
  // bits of liquid commands (eg., quotes) and break things.
  //
  // Unfortunately this must come before permalinks and navgation because of limitation in both
  // modules regarding what files they understand. The consequence here is that liquid templates
  // *within* a single file do NOT have access to the final path that they will be rendered under
  // or any other metadata added by the permalinks() and navigation() filters.
  //
  // Thus far this has not been a problem because the only references to such paths are in the
  // includes which are handled by the layout module. The layout module, luckily, can be run
  // near the end of the filter chain and therefore has access to all the metadata.
  //
  // If this becomes a barrier in the future, permalinks should be patched to understand
  // translating .md files which would allow inPlace() and markdown() to be moved under the
  // permalinks() and navigation() filters making the variable stores uniform between inPlace()
  // and layout().
  smith.use(inPlace({ engine: 'liquid', pattern: '*.{md,html}' }));
  smith.use(
    markdown({
      typographer: true,
      html: true,
    }),
  );

  // Responsible for create permalink structure. Most commonly used change foo.md to foo/index.html.
  //
  // This must come before navigation module, otherwise breadcrunmbs will see the wrong URLs.
  //
  // It also must come AFTER the markdown() module because it only recognizes .html files. See
  // comment above the inPlace() module for explanation of effects on the metadata().
  smith.use(
    permalinks({
      relative: false,
      linksets: [
        {
          match: { collection: 'posts' },
          pattern: ':date/:slug',
        },
      ],
    }),
  );

  smith.use(
    navigation({
      navConfigs: {
        sortByNameFirst: true,
        breadcrumbProperty: 'breadcrumb_path',
        pathProperty: 'nav_path',
        includeDirs: true,
      },
      navSettings: {},
    }),
  );

  smith.use(
    layouts({
      engine: 'liquid',
      directory: BUILD_OPTIONS.layouts,
      // Only apply layouts to markdown and html files.
      pattern: '**/*.{md,html}',
    }),
  );

  /*
  Add nonce attribute with substition string to all inline script tags
  Convert onclick event handles into nonced script tags
  */
  smith.use(addNonceToScripts);

  /*
   * This will replace links in static pages with a staging domain,
   * if it is in the list of domains to replace
   */
  smith.use(rewriteVaDomains(BUILD_OPTIONS));
  smith.use(rewriteAWSUrls(BUILD_OPTIONS));

  // Create the data passed from the content build to the assets compiler.
  // On the server, it can be accessed at BUILD_OPTIONS.buildSettings.
  // In the browser, it can be accessed at window.settings.
  smith.use(createBuildSettings(BUILD_OPTIONS));

  smith.use(updateExternalLinks(BUILD_OPTIONS));
  smith.use(addSubheadingsIds(BUILD_OPTIONS));

  // For prod builds, we need to add asset hashes, but since this is a live
  // request, we're not doing a webpack build.
  if (!isDevBuild) {
    smith.use(addAssetHashes(true));
  }

  return smith;
}

module.exports = createPipeline;
