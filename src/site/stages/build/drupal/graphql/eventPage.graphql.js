/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */

module.exports = `
 fragment eventPage on NodeEvent {
    entityId
    entityBundle
    entityPublished
    title
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: CROP_7_2) {
              url
              width
              height
            }
          }
        }
      }
    }
    fieldEventDate {
      date
      value
    }
    fieldEventDateEnd {
      date
      value
    }
    fieldAddress {
      addressLine1
      addressLine2
      locality
      administrativeArea
    }
    fieldFacilityLocation {
      entity {
        ... on NodeHealthCareLocalFacility {
          title
          fieldFacilityLocatorApiId
          entityUrl {
            path
          }
        }
      }
    }
    fieldLocationHumanreadable
    fieldDescription
    fieldBody {
      processed
    }
    fieldEventCost
    fieldEventRegistrationrequired
    fieldAdditionalInformationAbo
 }
`;