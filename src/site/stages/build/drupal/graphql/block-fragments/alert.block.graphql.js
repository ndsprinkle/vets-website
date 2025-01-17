/**
 * An alert block in Drupal
 *
 */

// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('../../../../../utilities/featureFlags');

const FIELD_ALERT = `
fieldAlert {
  entity {
    entityBundle
    ... on BlockContentAlert {
      ... alert
    }
  }
}
`;

const alert = `
fragment alert on BlockContentAlert {
  ${
    enabledFeatureFlags[featureFlags.FEATURE_FIELD_ALERT_DISMISSABLE]
      ? 'fieldAlertDismissable'
      : ''
  }
  fieldAlertType
  fieldAlertTitle
  fieldReusability
  fieldAlertContent {
    entity {
      ... on ParagraphWysiwyg {
        fieldWysiwyg {
          processed
        }
      }
      ... on ParagraphExpandableText {
        entityId
        entityBundle
        fieldWysiwyg {
          processed
        }
        fieldTextExpander
      }
    }
  }
}
`;

module.exports = { alert, FIELD_ALERT };
