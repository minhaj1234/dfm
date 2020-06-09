/* tslint:disable */
export const businessObjectiveData = {
  "_embedded": {
      "businessObjectives": [
          {
              "_links": {
                  "businessObjective": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/67cfa5a6-b052-495a-a4e2-1773abec1164{?projection}"
                  },
                  "organizations": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/67cfa5a6-b052-495a-a4e2-1773abec1164/organizations{?projection}"
                  },
                  "self": {
                      "href": "http://18.185.65.48:7070/businessObjectives/67cfa5a6-b052-495a-a4e2-1773abec1164"
                  },
                  "decisions": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/67cfa5a6-b052-495a-a4e2-1773abec1164/decisions{?projection}"
                  },
                  "tags": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/67cfa5a6-b052-495a-a4e2-1773abec1164/tags{?projection}"
                  }
              },
              "name": "test business objective 2",
              "tenantId": "default",
              "organizations": [
                  {
                      "_links": {
                          "businessObjectives": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/businessObjectives{?projection}"
                          },
                          "childrens": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/childrens{?projection}"
                          },
                          "organization": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c{?projection}"
                          },
                          "knowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/knowledgeSources{?projection}"
                          },
                          "self": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c"
                          },
                          "impactedByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/impactedByDecisions{?projection}"
                          },
                          "ownsDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/ownsDecisions{?projection}"
                          },
                          "parentOrganization": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/parentOrganization{?projection}"
                          },
                          "inputDatas": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/inputDatas{?projection}"
                          },
                          "makesDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/makesDecisions{?projection}"
                          },
                          "tags": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/tags{?projection}"
                          }
                      },
                      "name": "test organization",
                      "description": "<p>description</p>",
                      "id": "dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c"
                  }
              ],
              "description": "<p>description</p>",
              "decisions": [
                  {
                      "_links": {
                          "businessObjectives": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/businessObjectives{?projection}"
                          },
                          "processes": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/processes{?projection}"
                          },
                          "requiresInputData": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresInputData{?projection}"
                          },
                          "organizationsMakesDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsMakesDecisions{?projection}"
                          },
                          "decision": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4{?projection}"
                          },
                          "organizationsImpactedByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsImpactedByDecisions{?projection}"
                          },
                          "requiredByKnowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiredByKnowledgeSources{?projection}"
                          },
                          "implementationComponents": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/implementationComponents{?projection}"
                          },
                          "tags": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/tags{?projection}"
                          },
                          "requiresDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresDecisions{?projection}"
                          },
                          "systems": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/systems{?projection}"
                          },
                          "organizationsOwnsDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsOwnsDecisions{?projection}"
                          },
                          "requiredByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiredByDecisions{?projection}"
                          },
                          "self": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4"
                          },
                          "events": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/events{?projection}"
                          },
                          "requiresKnowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresKnowledgeSources{?projection}"
                          }
                      },
                      "name": "test decision",
                      "description": "<p>description</p>",
                      "id": "2afb48c1-67b2-41ed-a290-871ecbc507d4"
                  }
              ],
              "id": "67cfa5a6-b052-495a-a4e2-1773abec1164",
              "url": "https://example.com/business-objective",
              "tags": []
          },
          {
              "_links": {
                  "businessObjective": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/f20e8655-d60f-452b-97b7-4be3f80c8cda{?projection}"
                  },
                  "organizations": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/f20e8655-d60f-452b-97b7-4be3f80c8cda/organizations{?projection}"
                  },
                  "self": {
                      "href": "http://18.185.65.48:7070/businessObjectives/f20e8655-d60f-452b-97b7-4be3f80c8cda"
                  },
                  "decisions": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/f20e8655-d60f-452b-97b7-4be3f80c8cda/decisions{?projection}"
                  },
                  "tags": {
                      "templated": true,
                      "href": "http://18.185.65.48:7070/businessObjectives/f20e8655-d60f-452b-97b7-4be3f80c8cda/tags{?projection}"
                  }
              },
              "name": "test business objective 1",
              "tenantId": "default",
              "organizations": [
                  {
                      "_links": {
                          "businessObjectives": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/businessObjectives{?projection}"
                          },
                          "childrens": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/childrens{?projection}"
                          },
                          "organization": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c{?projection}"
                          },
                          "knowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/knowledgeSources{?projection}"
                          },
                          "self": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c"
                          },
                          "impactedByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/impactedByDecisions{?projection}"
                          },
                          "ownsDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/ownsDecisions{?projection}"
                          },
                          "parentOrganization": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/parentOrganization{?projection}"
                          },
                          "inputDatas": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/inputDatas{?projection}"
                          },
                          "makesDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/makesDecisions{?projection}"
                          },
                          "tags": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/organizations/dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c/tags{?projection}"
                          }
                      },
                      "name": "test organization",
                      "description": "<p>description</p>",
                      "id": "dcf6bd83-ac35-4523-86b1-cc7c3c5dc85c"
                  }
              ],
              "description": "<p>description</p>",
              "decisions": [
                  {
                      "_links": {
                          "businessObjectives": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/businessObjectives{?projection}"
                          },
                          "processes": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/processes{?projection}"
                          },
                          "requiresInputData": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresInputData{?projection}"
                          },
                          "organizationsMakesDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsMakesDecisions{?projection}"
                          },
                          "decision": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4{?projection}"
                          },
                          "organizationsImpactedByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsImpactedByDecisions{?projection}"
                          },
                          "requiredByKnowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiredByKnowledgeSources{?projection}"
                          },
                          "implementationComponents": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/implementationComponents{?projection}"
                          },
                          "tags": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/tags{?projection}"
                          },
                          "requiresDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresDecisions{?projection}"
                          },
                          "systems": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/systems{?projection}"
                          },
                          "organizationsOwnsDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/organizationsOwnsDecisions{?projection}"
                          },
                          "requiredByDecisions": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiredByDecisions{?projection}"
                          },
                          "self": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4"
                          },
                          "events": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/events{?projection}"
                          },
                          "requiresKnowledgeSources": {
                              "templated": true,
                              "href": "http://18.185.65.48:7070/decisions/2afb48c1-67b2-41ed-a290-871ecbc507d4/requiresKnowledgeSources{?projection}"
                          }
                      },
                      "name": "test decision",
                      "description": "<p>description</p>",
                      "id": "2afb48c1-67b2-41ed-a290-871ecbc507d4"
                  }
              ],
              "id": "f20e8655-d60f-452b-97b7-4be3f80c8cda",
              "url": "https://example.com/business-objective",
              "tags": []
          }
      ]
  },
  "_links": {
      "self": {
          "templated": true,
          "href": "http://18.185.65.48:7070/businessObjectives"
      }
  }
}