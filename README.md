Table Of Content

[TOC]

# Requirements

- NodeJS
- Npm
- Mysql Database

# Installation

- Run below command for local development

`npm run dev`

- Run below command for server environment

`npm run start`

- testing

`npm run test`

# Task Requirements

1. The system is supposed to send SMS to a list of schedules
2. Schedule is a list of recepients -> phone numbers
3. Schedule should have the following
   1. a time to run at
   2. a list of recipients to recieve the message
   3. a message to be sent
4. can have as many schedule as we want, some might be scheduled at the same time
5. the number of recipients is a variable, but the flow should be flexible enough to handle any size
6. the system should make sure that all SMS for all schedules are sent correctly, the status is updated to the database with the best performance possible in terms of server load and sending speed/time

# Task Descriptions

1. Build a database structure to cover the mentioned system requirements, can use mysql or mongodb
2. Build service that utilize this database structure
   1. run the scheduled SMS
   2. check the status of the sent SMS
      1. should recheck the status later until all SMS 'DELIVRD'
3. bonus api
4. consider Enviromental Setup when building this api

# Further Improvement

4. Consideration for building the API

   1. **Scallability**: For this concern, there are few possibility that I am think I could apply:

      1. seperate each process into independent service (microservices)

      2. horizontal scalling -> for database scalling when the data is getting bigger rathern than vertial scalling -> this could lead to other complexity, such as refactoring the queries to match the data size so we don't need to sacrifice the perfomance for scalability

   2. **Performance** : for this concern, there are few idea and new knowledge that i discover during the process

      1. Compression: Enable compression middleware in Express to compress the response data before sending it to the client. Compression reduces the size of the response, resulting in faster transmission over the network.

      2. Caching: Implement caching mechanisms to store frequently accessed data or responses. Caching eliminates the need to regenerate or reprocess the same data for every request, improving response time. You can use libraries like node-cache or redis for caching in Express.

      3. Query optimization: Ensure that necessary indexes are created, use query optimization techniques (e.g., JOINs, filtering), and consider caching frequently accessed data from the database.
      4. and many more that probably I'm not currently acquire the knowledge yet

   3. **Security**

      1. **Authentication** and Authorization -> not yet implemented, on my plan, that I will implement jsonwebtoken to generate authorization token, and bcrypt for password encryption

      2. **Secure Session Management**: Implement secure session management techniques to protect user sessions and prevent session hijacking or session fixation attacks. Use features like secure cookies, session expiration, and regenerate session IDs on authentication to enhance session security.

      3. **Rate Limiting and Request Throttling**: Implement rate limiting and request throttling mechanisms to protect your server from abusive or malicious traffic. Limit the number of requests from a single IP address or user within a specific time frame to prevent brute force attacks, DDoS attacks, or resource exhaustion.

      4. **Security Testing**: Conduct security testing and vulnerability assessments for it. Use tools like OWASP ZAP, Burp Suite, or automated security scanning tools to identify and fix security vulnerabilities. Perform penetration testing to simulate real-world attacks and identify any weaknesses in the application's security.

      5. and many more that I'm not currently acquire the knowledge yet

   4. Logging:

      1. Centralized Logging: Implement a centralized logging solution that aggregates logs from different parts of your application. This allows you to have a unified view of your application's logs, making it easier to analyze and troubleshoot issues. Tools like ELK Stack (Elasticsearch, Logstash, and Kibana) or Splunk can help in setting up a centralized logging infrastructure.

      2. Performance Monitoring: Integrate performance monitoring tools like New Relic, Datadog, or Prometheus to track and analyze application performance metrics. These tools provide insights into response times, database queries, CPU and memory usage, and other performance-related data. Monitoring performance metrics helps in identifying bottlenecks, optimizing performance, and ensuring a smooth user experience.

      3. Log Analysis and Alerting: Utilize log analysis and alerting tools to proactively detect anomalies, patterns, or security threats within your logs. Tools like Elasticsearch and Logstash provide powerful querying capabilities, allowing to search and analyze logs in real-time. set up alerts based on specific log patterns or conditions to receive notifications for critical events or suspicious activities.

   5. Enviromental Setup:

      1. I have identified several key improvements to enhance the environmental setup. Here's how I envision implementing best practices for environmental configuration:

      2. Use of Environment Variables: I will continue utilizing environment variables to store sensitive configuration values. However, I plan to implement a more robust approach to manage and secure these variables, such as using a secrets management solution or encrypted file storage.

      3. Centralized Configuration Management: To improve maintainability, I will explore the use of a centralized configuration management tool. This tool will allow me to store and manage application configuration settings in a centralized location, enabling easier updates and consistency across multiple deployment environments.

      4. Secrets Encryption: In order to enhance security, I plan to encrypt sensitive configuration values stored as environment variables. This extra layer of protection will ensure that even if unauthorized access occurs, the sensitive information remains encrypted and inaccessible.

      5. Automated Configuration Validation: I aim to implement an automated configuration validation process during application startup. This process will verify the presence and correctness of required environment variables, reducing the chances of runtime errors due to misconfiguration.

      6. Environment-Specific Configuration Profiles: To streamline the configuration process, I will create environment-specific configuration profiles. These profiles will include settings tailored to each deployment environment, such as database connection details, logging levels, and caching mechanisms. This approach will enable seamless deployment across different environments with minimal manual configuration.

      7. Infrastructure as Code (IaC): I plan to adopt Infrastructure as Code principles to provision and manage the infrastructure supporting my Express application. With tools like Terraform or AWS CloudFormation, I can define and version my infrastructure configuration alongside the application code. This approach ensures consistent and reproducible deployment environments.

      8. Continuous Integration/Continuous Deployment (CI/CD): As part of my future plans, I will implement CI/CD pipelines to automate the deployment process. This will include automated configuration deployment and validation, ensuring that configuration changes are seamlessly propagated to the application during the deployment process.

      9. Configuration Auditing and Monitoring: To maintain a robust and secure environment, I will implement configuration auditing and monitoring. This involves regularly reviewing and auditing configuration settings to identify any potential vulnerabilities or misconfigurations. Additionally, I will set up monitoring tools to track changes and receive alerts in case of any unauthorized modifications to the environment.

# Other plan improvement plan

- Typescript based for more type safety
- Containerization
- Documentation
