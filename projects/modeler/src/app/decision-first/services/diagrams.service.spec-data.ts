/* tslint:disable */
export const diagramsData = {
    "_embedded": {
        "diagrams": [
            {
                "goNodes": "{\"decision1\":{\"type\":0,\"text\":\"Decision A\"},\"decision2\":{\"type\":0,\"text\":\"Decision B\"},\"inputdata1\":{\"type\":1,\"text\":\"Input Data G\"},\"knowledgesource1\":{\"type\":2,\"text\":\"Knowledge Source J\"}}",
                "goLocations": "{\"decision1\":{\"loc\":\"-610.328125 -85\"},\"decision2\":{\"loc\":\"-302.984375 -88\"},\"inputdata1\":{\"loc\":\"-475.65625 91\"},\"knowledgesource1\":{\"loc\":\"-450.328125 -271\"}}",
                "_links": {
                    "diagram": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1{?projection}"
                    },
                    "knowledgeSources": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1/knowledgeSources{?projection}"
                    },
                    "self": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1"
                    },
                    "decisions": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1/decisions{?projection}"
                    },
                    "inputDatas": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1/decisions{?projection}"
                    },
                    "tags": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram1/tags{?projection}"
                    }
                },
                "goConnectors": "[{\"from\":\"inputdata1\",\"to\":\"decision1\"},{\"from\":\"inputdata1\",\"to\":\"decision2\"},{\"from\":\"decision1\",\"to\":\"decision2\"},{\"from\":\"knowledgesource1\",\"to\":\"decision2\"}]",
                "name": "Diagram X",
                "knowledgeSources": [
                    {
                        "requiresDecisions": [],
                        "requiresInputData": [],
                        "_links": {
                            "knowledgeSource": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/requiresDecisions{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/requiresInputData{?projection}"
                            },
                            "organizations": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/organizations{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/requiredByKnowledgeSources{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/requiresKnowledgeSources{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource1/tags{?projection}"
                            }
                        },
                        "name": "Knowledge Source J",
                        "description": "",
                        "requiredByDecisions": [],
                        "id": "knowledgesource1",
                        "requiredByKnowledgeSources": [],
                        "requiresKnowledgeSources": []
                    }
                ],
                "description": "",
                "decisions": [
                    {
                        "requiresInputData": [],
                        "_links": {
                            "businessObjectives": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/businessObjectives{?projection}"
                            },
                            "processes": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/processes{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/requiresInputData{?projection}"
                            },
                            "organizationsMakesDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/organizationsMakesDecisions{?projection}"
                            },
                            "decision": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2{?projection}"
                            },
                            "organizationsImpactedByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/organizationsImpactedByDecisions{?projection}"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/requiredByKnowledgeSources{?projection}"
                            },
                            "implementationComponents": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/implementationComponents{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/tags{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/requiresDecisions{?projection}"
                            },
                            "systems": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/systems{?projection}"
                            },
                            "organizationsOwnsDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/organizationsOwnsDecisions{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/decisions/decision2"
                            },
                            "events": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/events{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision2/requiresKnowledgeSources{?projection}"
                            }
                        },
                        "description": "",
                        "requiredByKnowledgeSources": [],
                        "implementationComponents": [
                            {
                                "_links": {
                                    "implementationComponent": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10{?projection}"
                                    },
                                    "self": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10"
                                    },
                                    "decisions": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10/decisions{?projection}"
                                    },
                                    "tags": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10/tags{?projection}"
                                    }
                                },
                                "name": "Implementation Component W",
                                "icon": "https://secure.decisionsfirst.com/ODM.png",
                                "description": "",
                                "id": "ed7c29e6-a684-42e2-bf9f-af93e5139e10",
                                "url": "https://example.com/implementation-component-w"
                            }
                        ],
                        "requiresDecisions": [],
                        "name": "Decision B",
                        "requiredByDecisions": [],
                        "id": "decision2",
                        "requiresKnowledgeSources": []
                    },
                    {
                        "requiresInputData": [],
                        "_links": {
                            "businessObjectives": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/businessObjectives{?projection}"
                            },
                            "processes": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/processes{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/requiresInputData{?projection}"
                            },
                            "organizationsMakesDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/organizationsMakesDecisions{?projection}"
                            },
                            "decision": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1{?projection}"
                            },
                            "organizationsImpactedByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/organizationsImpactedByDecisions{?projection}"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/requiredByKnowledgeSources{?projection}"
                            },
                            "implementationComponents": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/implementationComponents{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/tags{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/requiresDecisions{?projection}"
                            },
                            "systems": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/systems{?projection}"
                            },
                            "organizationsOwnsDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/organizationsOwnsDecisions{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/decisions/decision1"
                            },
                            "events": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/events{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision1/requiresKnowledgeSources{?projection}"
                            }
                        },
                        "description": "",
                        "requiredByKnowledgeSources": [],
                        "implementationComponents": [
                            {
                                "_links": {
                                    "implementationComponent": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/99de5331-af29-429c-9210-aee6042499c7{?projection}"
                                    },
                                    "self": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/99de5331-af29-429c-9210-aee6042499c7"
                                    },
                                    "decisions": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/99de5331-af29-429c-9210-aee6042499c7/decisions{?projection}"
                                    },
                                    "tags": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/99de5331-af29-429c-9210-aee6042499c7/tags{?projection}"
                                    }
                                },
                                "name": "Implementation Component V",
                                "icon": "https://secure.decisionsfirst.com/ODM.png",
                                "description": "",
                                "id": "99de5331-af29-429c-9210-aee6042499c7",
                                "url": "https://example.com/implementation-component-v"
                            }
                        ],
                        "requiresDecisions": [],
                        "name": "Decision A",
                        "requiredByDecisions": [],
                        "id": "decision1",
                        "requiresKnowledgeSources": []
                    }
                ],
                "id": "diagram1",
                "inputDatas": [
                    {
                        "_links": {
                            "organizations": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1/organizations{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1/requiredByKnowledgeSources{?projection}"
                            },
                            "InputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata1/tags{?projection}"
                            }
                        },
                        "name": "Input Data G",
                        "description": "",
                        "requiredByDecisions": [],
                        "id": "inputdata1",
                        "requiredByKnowledgeSources": []
                    }
                ],
                "tags": []
            },
            {
                "goNodes": "{\"decision3\":{\"type\":0,\"text\":\"Decision C\"},\"decision5\":{\"type\":0,\"text\":\"Decision E\"},\"decision4\":{\"type\":0,\"text\":\"Decision D\"},\"inputdata2\":{\"type\":1,\"text\":\"Input Data H\"},\"knowledgesource2\":{\"type\":2,\"text\":\"Knowledge Source K\"},\"a6444cfe-8f5e-9cdc-b4f7-468ba1048795\":{\"type\":3,\"text\":\"Annotation\"},\"a6444cfe-8f5e-9cdc-b4f7-468ba10487952\":{\"type\":3,\"text\":\"Annotation\"},\"9f484921-7cbe-a78c-269b-110702ae9a75\":{\"type\":4,\"text\":\"Group Item\",\"size\":{\"width\":541,\"height\":332}}}",
                "goLocations": "{\"decision3\":{\"loc\":\"-596.328125 -88\"},\"decision5\":{\"loc\":\"-388.328125 -279\"},\"decision4\":{\"loc\":\"-285.328125 -98\"},\"inputdata2\":{\"loc\":\"-434.65625 67\"},\"knowledgesource2\":{\"loc\":\"-53.65625 -135\"},\"a6444cfe-8f5e-9cdc-b4f7-468ba1048795\":{\"loc\":\"-790.65625 -220\"},\"a6444cfe-8f5e-9cdc-b4f7-468ba10487952\":{\"loc\":\"154.34375 -340\"},\"9f484921-7cbe-a78c-269b-110702ae9a75\":{\"loc\":\"-439.328125 -316\"}}",
                "_links": {
                    "diagram": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2{?projection}"
                    },
                    "knowledgeSources": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2/knowledgeSources{?projection}"
                    },
                    "self": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2"
                    },
                    "decisions": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2/decisions{?projection}"
                    },
                    "inputDatas": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2/decisions{?projection}"
                    },
                    "tags": {
                        "templated": true,
                        "href": "http://18.185.65.48:7070/diagrams/diagram2/tags{?projection}"
                    }
                },
                "goConnectors": "[{\"from\":\"a6444cfe-8f5e-9cdc-b4f7-468ba1048795\",\"to\":\"decision3\"},{\"from\":\"a6444cfe-8f5e-9cdc-b4f7-468ba10487952\",\"to\":\"9f484921-7cbe-a78c-269b-110702ae9a75\"},{\"from\":\"decision3\",\"to\":\"decision5\"},{\"from\":\"decision4\",\"to\":\"decision5\"},{\"from\":\"inputdata2\",\"to\":\"decision5\"},{\"from\":\"inputdata2\",\"to\":\"decision3\"},{\"from\":\"knowledgesource2\",\"to\":\"decision5\"},{\"from\":\"knowledgesource2\",\"to\":\"decision4\"}]",
                "name": "Diagram Y",
                "knowledgeSources": [
                    {
                        "requiresDecisions": [],
                        "requiresInputData": [],
                        "_links": {
                            "knowledgeSource": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/requiresDecisions{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/requiresInputData{?projection}"
                            },
                            "organizations": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/organizations{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/requiredByKnowledgeSources{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/requiresKnowledgeSources{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/knowledgeSources/knowledgesource2/tags{?projection}"
                            }
                        },
                        "name": "Knowledge Source K",
                        "description": "",
                        "requiredByDecisions": [],
                        "id": "knowledgesource2",
                        "requiredByKnowledgeSources": [],
                        "requiresKnowledgeSources": []
                    }
                ],
                "description": "",
                "decisions": [
                    {
                        "requiresInputData": [],
                        "_links": {
                            "businessObjectives": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/businessObjectives{?projection}"
                            },
                            "processes": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/processes{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/requiresInputData{?projection}"
                            },
                            "organizationsMakesDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/organizationsMakesDecisions{?projection}"
                            },
                            "decision": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4{?projection}"
                            },
                            "organizationsImpactedByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/organizationsImpactedByDecisions{?projection}"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/requiredByKnowledgeSources{?projection}"
                            },
                            "implementationComponents": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/implementationComponents{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/tags{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/requiresDecisions{?projection}"
                            },
                            "systems": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/systems{?projection}"
                            },
                            "organizationsOwnsDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/organizationsOwnsDecisions{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/decisions/decision4"
                            },
                            "events": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/events{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision4/requiresKnowledgeSources{?projection}"
                            }
                        },
                        "description": "",
                        "requiredByKnowledgeSources": [],
                        "implementationComponents": [],
                        "requiresDecisions": [],
                        "name": "Decision D",
                        "requiredByDecisions": [],
                        "id": "decision4",
                        "requiresKnowledgeSources": []
                    },
                    {
                        "requiresInputData": [],
                        "_links": {
                            "businessObjectives": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/businessObjectives{?projection}"
                            },
                            "processes": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/processes{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/requiresInputData{?projection}"
                            },
                            "organizationsMakesDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/organizationsMakesDecisions{?projection}"
                            },
                            "decision": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3{?projection}"
                            },
                            "organizationsImpactedByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/organizationsImpactedByDecisions{?projection}"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/requiredByKnowledgeSources{?projection}"
                            },
                            "implementationComponents": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/implementationComponents{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/tags{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/requiresDecisions{?projection}"
                            },
                            "systems": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/systems{?projection}"
                            },
                            "organizationsOwnsDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/organizationsOwnsDecisions{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/decisions/decision3"
                            },
                            "events": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/events{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision3/requiresKnowledgeSources{?projection}"
                            }
                        },
                        "description": "",
                        "requiredByKnowledgeSources": [],
                        "implementationComponents": [
                            {
                                "_links": {
                                    "implementationComponent": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10{?projection}"
                                    },
                                    "self": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10"
                                    },
                                    "decisions": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10/decisions{?projection}"
                                    },
                                    "tags": {
                                        "templated": true,
                                        "href": "http://18.185.65.48:7070/implementationComponents/ed7c29e6-a684-42e2-bf9f-af93e5139e10/tags{?projection}"
                                    }
                                },
                                "name": "Implementation Component W",
                                "icon": "https://secure.decisionsfirst.com/ODM.png",
                                "description": "",
                                "id": "ed7c29e6-a684-42e2-bf9f-af93e5139e10",
                                "url": "https://example.com/implementation-component-w"
                            }
                        ],
                        "requiresDecisions": [],
                        "name": "Decision C",
                        "requiredByDecisions": [],
                        "id": "decision3",
                        "requiresKnowledgeSources": []
                    },
                    {
                        "requiresInputData": [],
                        "_links": {
                            "businessObjectives": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/businessObjectives{?projection}"
                            },
                            "processes": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/processes{?projection}"
                            },
                            "requiresInputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/requiresInputData{?projection}"
                            },
                            "organizationsMakesDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/organizationsMakesDecisions{?projection}"
                            },
                            "decision": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5{?projection}"
                            },
                            "organizationsImpactedByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/organizationsImpactedByDecisions{?projection}"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/requiredByKnowledgeSources{?projection}"
                            },
                            "implementationComponents": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/implementationComponents{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/tags{?projection}"
                            },
                            "requiresDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/requiresDecisions{?projection}"
                            },
                            "systems": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/systems{?projection}"
                            },
                            "organizationsOwnsDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/organizationsOwnsDecisions{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/decisions/decision5"
                            },
                            "events": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/events{?projection}"
                            },
                            "requiresKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/decisions/decision5/requiresKnowledgeSources{?projection}"
                            }
                        },
                        "description": "",
                        "requiredByKnowledgeSources": [],
                        "implementationComponents": [],
                        "requiresDecisions": [],
                        "name": "Decision E",
                        "requiredByDecisions": [],
                        "id": "decision5",
                        "requiresKnowledgeSources": []
                    }
                ],
                "id": "diagram2",
                "inputDatas": [
                    {
                        "_links": {
                            "organizations": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2/organizations{?projection}"
                            },
                            "requiredByDecisions": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2/requiredByDecisions{?projection}"
                            },
                            "self": {
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2"
                            },
                            "requiredByKnowledgeSources": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2/requiredByKnowledgeSources{?projection}"
                            },
                            "InputData": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2{?projection}"
                            },
                            "tags": {
                                "templated": true,
                                "href": "http://18.185.65.48:7070/inputDatas/inputdata2/tags{?projection}"
                            }
                        },
                        "name": "Input Data H",
                        "description": "",
                        "requiredByDecisions": [],
                        "id": "inputdata2",
                        "requiredByKnowledgeSources": []
                    }
                ],
                "tags": []
            }
        ]
    },
    "_links": {
        "self": {
            "templated": true,
            "href": "http://18.185.65.48:7070/diagrams{?projection}"
        }
    }
}