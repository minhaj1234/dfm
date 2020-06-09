import { Guid } from 'guid-typescript';

/* tslint:disable */
export const tagsData = {
  "_embedded" : {
    "tags" : [ {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ {
        "name" : "Diagram Y",
        "id" : "diagram2",
        "description" : "<p>The second diagram description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/diagrams/diagram2{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/diagrams/diagram2/inputDatas{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/diagrams/diagram2/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/diagrams/diagram2/decisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/diagrams/diagram2/knowledgeSources{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Diagram Z",
        "id" : "diagram3",
        "description" : "<p>The second diagram description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/diagrams/diagram3{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/diagrams/diagram3/inputDatas{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/diagrams/diagram3/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/diagrams/diagram3/decisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/diagrams/diagram3/knowledgeSources{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Diagram X",
        "id" : "diagram1",
        "description" : "<p>The first diagram description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/diagrams/diagram1{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/diagrams/diagram1/inputDatas{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/diagrams/diagram1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/diagrams/diagram1/decisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/diagrams/diagram1/knowledgeSources{?projection}",
            "templated" : true
          }
        }
      } ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#diagram",
      "id" : "tag1",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag1"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag1{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag1/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ {
        "name" : "Decision A",
        "id" : "decision1",
        "description" : "<p>Description for Decision A</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision1{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision1/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision1/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision1/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision1/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision1/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision1/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision1/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision1/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision1/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Decision B",
        "id" : "decision2",
        "description" : "<p>Description for Decision B</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision2{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision2/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision2/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision2/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision2/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision2/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision2/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision2/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision2/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision2/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision2/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision2/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision2/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision2/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision2/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision2/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision2/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Decision E",
        "id" : "decision5",
        "description" : "<p>Description for Decision E</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision5{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision5/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision5/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision5/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision5/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision5/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision5/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision5/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision5/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision5/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision5/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision5/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision5/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision5/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision5/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision5/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision5/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Decision D",
        "id" : "decision4",
        "description" : "<p>Description for Decision D</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision4{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision4/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision4/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision4/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision4/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision4/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision4/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision4/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision4/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision4/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision4/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision4/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision4/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision4/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision4/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision4/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision4/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Decision C",
        "id" : "decision3",
        "description" : "<p>Description for Decision C</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision3{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision3/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision3/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision3/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision3/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision3/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision3/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision3/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision3/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision3/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision3/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision3/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision3/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision3/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision3/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision3/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision3/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Decision F",
        "id" : "decision6",
        "description" : "<p>Description for Decision F</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision6{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision6/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision6/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision6/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision6/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision6/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision6/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision6/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision6/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision6/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision6/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision6/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision6/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision6/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision6/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision6/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision6/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#decision",
      "id" : "tag2",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag2"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag2{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag2/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ {
        "name" : "Input Data G",
        "id" : "inputdata1",
        "description" : "<p>Description for Input Data G</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/tags{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/requiredByDecisions{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/diagrams{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/organizations{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Input Data I",
        "id" : "inputdata3",
        "description" : "<p>Description for Input Data I</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3/tags{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3/requiredByDecisions{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3/diagrams{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/inputDatas/inputdata3/organizations{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Input Data H",
        "id" : "inputdata2",
        "description" : "<p>Description for Input Data H</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2/tags{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2/requiredByDecisions{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2/diagrams{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/inputDatas/inputdata2/organizations{?projection}",
            "templated" : true
          }
        }
      } ],
      "name" : "#input-data",
      "id" : "tag3",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag3"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag3{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag3/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#knowledge-source",
      "id" : "tag4",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag4"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag4{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag4/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ {
        "name" : "Organization N",
        "id" : "organization2",
        "description" : "<p>Description for Organization N</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/organizations/organization2{?projection}",
            "templated" : true
          },
          "impactedByDecisions" : {
            "href" : "http://localhost:8080/organizations/organization2/impactedByDecisions{?projection}",
            "templated" : true
          },
          "ownsDecisions" : {
            "href" : "http://localhost:8080/organizations/organization2/ownsDecisions{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/organizations/organization2/decisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/organizations/organization2/businessObjectives{?projection}",
            "templated" : true
          },
          "childOrganizations" : {
            "href" : "http://localhost:8080/organizations/organization2/childOrganizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/organizations/organization2/tags{?projection}",
            "templated" : true
          },
          "makesDecisions" : {
            "href" : "http://localhost:8080/organizations/organization2/makesDecisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/organizations/organization2/knowledgeSources{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/organizations/organization2/inputDatas{?projection}",
            "templated" : true
          },
          "parentOrganization" : {
            "href" : "http://localhost:8080/organizations/organization2/parentOrganization{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Organization M",
        "id" : "organization1",
        "description" : "<p>Description for Organization M</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/organizations/organization1{?projection}",
            "templated" : true
          },
          "impactedByDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/impactedByDecisions{?projection}",
            "templated" : true
          },
          "ownsDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/ownsDecisions{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/organizations/organization1/decisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/organizations/organization1/businessObjectives{?projection}",
            "templated" : true
          },
          "childOrganizations" : {
            "href" : "http://localhost:8080/organizations/organization1/childOrganizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/organizations/organization1/tags{?projection}",
            "templated" : true
          },
          "makesDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/makesDecisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/organizations/organization1/knowledgeSources{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/organizations/organization1/inputDatas{?projection}",
            "templated" : true
          },
          "parentOrganization" : {
            "href" : "http://localhost:8080/organizations/organization1/parentOrganization{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Organization O",
        "id" : "organization3",
        "description" : "<p>Description for Organization O</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/organizations/organization3{?projection}",
            "templated" : true
          },
          "impactedByDecisions" : {
            "href" : "http://localhost:8080/organizations/organization3/impactedByDecisions{?projection}",
            "templated" : true
          },
          "ownsDecisions" : {
            "href" : "http://localhost:8080/organizations/organization3/ownsDecisions{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/organizations/organization3/decisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/organizations/organization3/businessObjectives{?projection}",
            "templated" : true
          },
          "childOrganizations" : {
            "href" : "http://localhost:8080/organizations/organization3/childOrganizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/organizations/organization3/tags{?projection}",
            "templated" : true
          },
          "makesDecisions" : {
            "href" : "http://localhost:8080/organizations/organization3/makesDecisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/organizations/organization3/knowledgeSources{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/organizations/organization3/inputDatas{?projection}",
            "templated" : true
          },
          "parentOrganization" : {
            "href" : "http://localhost:8080/organizations/organization3/parentOrganization{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Organization P",
        "id" : "organization4",
        "description" : "<p>Description for Organization P</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/organizations/organization4{?projection}",
            "templated" : true
          },
          "impactedByDecisions" : {
            "href" : "http://localhost:8080/organizations/organization4/impactedByDecisions{?projection}",
            "templated" : true
          },
          "ownsDecisions" : {
            "href" : "http://localhost:8080/organizations/organization4/ownsDecisions{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/organizations/organization4/decisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/organizations/organization4/businessObjectives{?projection}",
            "templated" : true
          },
          "childOrganizations" : {
            "href" : "http://localhost:8080/organizations/organization4/childOrganizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/organizations/organization4/tags{?projection}",
            "templated" : true
          },
          "makesDecisions" : {
            "href" : "http://localhost:8080/organizations/organization4/makesDecisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/organizations/organization4/knowledgeSources{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/organizations/organization4/inputDatas{?projection}",
            "templated" : true
          },
          "parentOrganization" : {
            "href" : "http://localhost:8080/organizations/organization4/parentOrganization{?projection}",
            "templated" : true
          }
        }
      } ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#organization",
      "id" : "tag5",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag5"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag5{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag5/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ {
        "name" : "Business Objective R",
        "id" : "businessobjective2",
        "description" : "<p>Description for Business Objective R</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective2{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective2/decisions{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective2/tags{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective2/organizations{?projection}",
            "templated" : true
          }
        }
      }, {
        "name" : "Performance Indicator Q",
        "id" : "businessobjective1",
        "description" : "<p>Description for Performance Indicator Q</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/decisions{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/tags{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/organizations{?projection}",
            "templated" : true
          }
        }
      } ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#business-objective",
      "id" : "tag6",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag6"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag6{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag6/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ {
        "name" : "Process S",
        "id" : "process1",
        "description" : "<p>Description for Process S</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/processes/process1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/processes/process1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/processes/process1/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#process",
      "id" : "tag7",
      "description" : "test",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag7"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag7{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag7/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ {
        "name" : "System U",
        "id" : "system1",
        "description" : "<p>Description for System U</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/systems/system1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/systems/system1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/systems/system1/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "inputDatas" : [ ],
      "name" : "#system",
      "id" : "tag8",
      "description" : "",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag8"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag8{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag8/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ {
        "name" : "Event T",
        "id" : "event1",
        "description" : "<p>Description for Event T</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/events/event1{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/events/event1/decisions{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/events/event1/tags{?projection}",
            "templated" : true
          }
        }
      } ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#event",
      "id" : "tag9",
      "description" : "",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag9"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag9{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag9/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ ],
      "implementationComponents" : [ {
        "icon" : "https://secure.decisionsfirst.com/ODM.png",
        "name" : "Implementation Component V",
        "id" : "implementation1",
        "description" : "<p>Description for Implementation Component V</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1/decisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "icon" : "https://secure.decisionsfirst.com/ODM.png",
        "name" : "Implementation Component for test 1",
        "id" : "implementation3",
        "description" : "<p>description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/implementationComponents/implementation3{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/implementationComponents/implementation3/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/implementationComponents/implementation3/decisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "icon" : "https://secure.decisionsfirst.com/ODM.png",
        "name" : "Implementation Component for test 2",
        "id" : "implementation4",
        "description" : "<p>description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/implementationComponents/implementation4{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/implementationComponents/implementation4/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/implementationComponents/implementation4/decisions{?projection}",
            "templated" : true
          }
        }
      }, {
        "icon" : "https://secure.decisionsfirst.com/ODM.png",
        "name" : "Implementation Component W",
        "id" : "implementation2",
        "description" : "<p>Description for Implementation Component W</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/implementationComponents/implementation2{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/implementationComponents/implementation2/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/implementationComponents/implementation2/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "diagrams" : [ ],
      "decisions" : [ ],
      "organizations" : [ ],
      "processes" : [ ],
      "events" : [ ],
      "systems" : [ ],
      "inputDatas" : [ ],
      "name" : "#implementation-component",
      "id" : "tag10",
      "description" : "",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag10"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag10{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag10/tagEntities"
        }
      }
    }, {
      "businessObjectives" : [ {
        "name" : "Performance Indicator Q",
        "id" : "businessobjective1",
        "description" : "<p>Description for Performance Indicator Q</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/decisions{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/tags{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/businessObjectives/businessobjective1/organizations{?projection}",
            "templated" : true
          }
        }
      } ],
      "implementationComponents" : [ {
        "icon" : "https://secure.decisionsfirst.com/ODM.png",
        "name" : "Implementation Component V",
        "id" : "implementation1",
        "description" : "<p>Description for Implementation Component V</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/implementationComponents/implementation1/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "diagrams" : [ {
        "name" : "Diagram X",
        "id" : "diagram1",
        "description" : "<p>The first diagram description</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/diagrams/diagram1{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/diagrams/diagram1/inputDatas{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/diagrams/diagram1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/diagrams/diagram1/decisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/diagrams/diagram1/knowledgeSources{?projection}",
            "templated" : true
          }
        }
      } ],
      "decisions" : [ {
        "name" : "Decision A",
        "id" : "decision1",
        "description" : "<p>Description for Decision A</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/decisions/decision1{?projection}",
            "templated" : true
          },
          "implementationComponents" : {
            "href" : "http://localhost:8080/decisions/decision1/implementationComponents{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision1/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "systems" : {
            "href" : "http://localhost:8080/decisions/decision1/systems{?projection}",
            "templated" : true
          },
          "requiresDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresDecisions{?projection}",
            "templated" : true
          },
          "processes" : {
            "href" : "http://localhost:8080/decisions/decision1/processes{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/requiredByDecisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/decisions/decision1/businessObjectives{?projection}",
            "templated" : true
          },
          "organizationsImpactedByDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsImpactedByDecisions{?projection}",
            "templated" : true
          },
          "organizationsOwnsDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsOwnsDecisions{?projection}",
            "templated" : true
          },
          "requiresKnowledgeSources" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresKnowledgeSources{?projection}",
            "templated" : true
          },
          "events" : {
            "href" : "http://localhost:8080/decisions/decision1/events{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/decisions/decision1/organizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/decisions/decision1/tags{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/decisions/decision1/diagrams{?projection}",
            "templated" : true
          },
          "requiresInputDatas" : {
            "href" : "http://localhost:8080/decisions/decision1/requiresInputDatas{?projection}",
            "templated" : true
          },
          "organizationsMakesDecisions" : {
            "href" : "http://localhost:8080/decisions/decision1/organizationsMakesDecisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "organizations" : [ {
        "name" : "Organization M",
        "id" : "organization1",
        "description" : "<p>Description for Organization M</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/organizations/organization1{?projection}",
            "templated" : true
          },
          "impactedByDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/impactedByDecisions{?projection}",
            "templated" : true
          },
          "ownsDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/ownsDecisions{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/organizations/organization1/decisions{?projection}",
            "templated" : true
          },
          "businessObjectives" : {
            "href" : "http://localhost:8080/organizations/organization1/businessObjectives{?projection}",
            "templated" : true
          },
          "childOrganizations" : {
            "href" : "http://localhost:8080/organizations/organization1/childOrganizations{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/organizations/organization1/tags{?projection}",
            "templated" : true
          },
          "makesDecisions" : {
            "href" : "http://localhost:8080/organizations/organization1/makesDecisions{?projection}",
            "templated" : true
          },
          "knowledgeSources" : {
            "href" : "http://localhost:8080/organizations/organization1/knowledgeSources{?projection}",
            "templated" : true
          },
          "inputDatas" : {
            "href" : "http://localhost:8080/organizations/organization1/inputDatas{?projection}",
            "templated" : true
          },
          "parentOrganization" : {
            "href" : "http://localhost:8080/organizations/organization1/parentOrganization{?projection}",
            "templated" : true
          }
        }
      } ],
      "processes" : [ {
        "name" : "Process S",
        "id" : "process1",
        "description" : "<p>Description for Process S</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/processes/process1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/processes/process1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/processes/process1/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "events" : [ {
        "name" : "Event T",
        "id" : "event1",
        "description" : "<p>Description for Event T</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/events/event1{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/events/event1/decisions{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/events/event1/tags{?projection}",
            "templated" : true
          }
        }
      } ],
      "systems" : [ {
        "name" : "System U",
        "id" : "system1",
        "description" : "<p>Description for System U</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/systems/system1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/systems/system1/tags{?projection}",
            "templated" : true
          },
          "decisions" : {
            "href" : "http://localhost:8080/systems/system1/decisions{?projection}",
            "templated" : true
          }
        }
      } ],
      "inputDatas" : [ {
        "name" : "Input Data G",
        "id" : "inputdata1",
        "description" : "<p>Description for Input Data G</p>",
        "_links" : {
          "self" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1{?projection}",
            "templated" : true
          },
          "tags" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/tags{?projection}",
            "templated" : true
          },
          "requiredByDecisions" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/requiredByDecisions{?projection}",
            "templated" : true
          },
          "diagrams" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/diagrams{?projection}",
            "templated" : true
          },
          "requiredByKnowledgeSources" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/requiredByKnowledgeSources{?projection}",
            "templated" : true
          },
          "organizations" : {
            "href" : "http://localhost:8080/inputDatas/inputdata1/organizations{?projection}",
            "templated" : true
          }
        }
      } ],
      "name" : "#multiple",
      "id" : "tag11",
      "description" : "",
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/tags/tag11"
        },
        "tag" : {
          "href" : "http://localhost:8080/tags/tag11{?projection}",
          "templated" : true
        },
        "tagEntities" : {
          "href" : "http://localhost:8080/tags/tag11/tagEntities"
        }
      }
    } ]
  },
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/tags{?page,size,sort,projection}",
      "templated" : true
    },
    "profile" : {
      "href" : "http://localhost:8080/profile/tags"
    },
    "search" : {
      "href" : "http://localhost:8080/tags/search"
    }
  },
  "page" : {
    "size" : 20,
    "totalElements" : 11,
    "totalPages" : 1,
    "number" : 0
  }
}
