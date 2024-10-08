---
layout: sub-navigation
title: Service standard
order: 2
eleventyNavigation:
  key: Service standard
  parent: Home
---
This documentation describes the standards we adhere to when writing services.

## README
All our services should have a github README.md at the root of their repository. Information in this should include:

* Who to contact with any questions
* Where the API docs are located
* How to call the endpoints and whether any authentication / special authorisation is required
* How to check that the service is up and running i.e. the health endpoint
* How to check that the service is responding to requests i.e. the ping endpoint
* How to find out the version of the deployed application and link it back to a specific git commit.
* How to rollback a deployed service to a previous version
* How to run the application locally

## Publishing APIs
All services should have clear API documentation that details the endpoints with the authorisation requirements.

The API documentation should be in OpenAPI 3 format, according to [GDS guidelines][openapi-3].
It should include examples for the various data elements as well as the possible values for constrained items.

## Coding standards
All our code is peer reviewed before being merged and then released.
All commits should include a JIRA reference so that we can trace back the reasons for the change etc.

### Breaking changes
We follow these principles for each of our endpoints:

* We do not take anything away
* We do not change processing rules
* We do not make optional things required
* Anything we add must be optional

Consumers need to be resilient enough to support these changes, e.g. they shouldn't bind tightly to an expected representation as new fields may be added at a later date.

This means that a new endpoint should be added instead of making a breaking change to an existing endpoint.
Since we know what clients call which endpoints we can then inform the clients to switch to the new endpoint.
When all the clients have switched over we can then remove the old endpoint.

### Releases
We will endeavour to release as soon as a new feature has been tested, rather than bulking up multiple changes into a release.
If an application release contains multiple changes since the last release then it is important that agreement with all the changers is sought before release.
A changelog will be generated containing all the changes since the last release to production and it will be posted in the appropriate slack channel.

## Service endpoints

### `/health`
Our services all provide a `/health` endpoint which checks all dependencies are healthy (e.g. database connection) and returns a http status of 200 if everything is up and running.
The endpoint shouldn't then call `/health` on any of the dependencies though as this will create cascading health checks so that one health check could call health checks in the dependencies, which could then call health checks in the dependencies etc.
This is called on a regular basis by our Pingdom check, which will then alert to us in slack in #dps_alerts if there are issues.
It is also called by the DPS Monitor at https://dps-monitor.prison.service.justice.gov.uk/health to provide a dashboard of all the DPS services health.

### `/ping`
This is a simple check that will just return a http status of 200 if the application is up and running.
It is therefore entirely suited to be called by other applications' health checks and also by kubernetes liveness and readiness probes if the application framework doesn't provide specific endpoints.

### `/info`
This provides basic information in a json format about the current application version, github commit reference and other useful application information.

## Deployments

Our release candidates are automatically deployed to our development environments using circleci.
When a ticket has been successfully tested it is then approved for deployment to a production like environment before then being deployed to production.

### Helm
We use helm to manage the kubernetes deployments and configuration.
A helm_deploy/README is included in all projects to provide information on how to find out the current deployed version and also to rollback to previous versions.

## Monitoring

We use [azure monitor][azure-monitor] and in particular application insights to monitor our production systems.
Our applications logs are ingested, as well as requests, exceptions and dependency calls.
This means that we can tell how long requests take in our systems and how long each of the individual dependencies (e.g. database interactions) take.

### Logging requests with individual clients
All HMPPS Auth tokens contain a `client_id` and optionally a `user_name`.
Each frontend application / service is issued with a different `client_id` so therefore this will uniquely identify a client.
For system to system interaction the `user_name` will normally be empty.
Both should then be included as extra attributes in the request logging so that clients can be identified and therefore we can track what clients are calling what endpoints and how often.

### Correlating requests
We confirm to [W3C tracing guidelines][w3c-tracing].
This means that we accept a `traceparent` header which can then be used to correlate requests across all applications and to identify a user's journey through the application stack.

### Application version
All our requests are also augmented with the current version of the application to help identify when issues first occurred and link back to the correct code.
This is of format `<date>.<circleci job number>.<github reference>` so can be traced back not only to the circleci job that built the code, but also the github commit of the code.

[openapi-3]: https://www.gov.uk/government/publications/recommended-open-standards-for-government/describing-restful-apis-with-openapi-3 "Describing RESTful APIs with OpenAPI 3"
[azure-monitor]: https://docs.microsoft.com/en-us/azure/azure-monitor/ "Azure Monitor documentation"
[w3c-tracing]: https://www.w3.org/TR/trace-context/ "Trace Context"