@@Title: Jenkins Server Part 1
@@URL: jenkins-server-part-1
@@Date: 1/12/1999
@@TLDR: architecture and design for dockerized jenkins web servers
@@Tags: jenkins, web

- [**Workflows**](#workflows)
  - [**DEVELOPMENT WORKFLOW**](#development-workflow)
  - [**WEB VISIT WORKFLOW**](#web-visit-workflow)


1. **Github**: This is where the development happens. Any updates pushed here will trigger a webhook.
2. **Reverse Proxy Server**: This server is exposed and runs as a Docker image on the Docker network intervolz-network. It receives the webhook from Github and sends an update to Jenkins.
3. **Jenkins**: Jenkins is a CI/CD tool that rebuilds the Docker image for intervolz.com upon receiving an update from the Reverse Proxy Server.
4. **Docker**: Docker hosts the intervolz.com image locally, and the jenkins server, and the reverse proxy, and the network

## **Workflows**

### **DEVELOPMENT WORKFLOW**

1. Developer pushes an update to Github.
2. The Github update triggers a webhook.
3. The exposed Reverse Proxy Server running as a Docker image on the Docker network intervolz-network receives the webhook.
4. The Reverse Proxy Server sends an update to Jenkins.
5. Jenkins rebuilds the intervolz.com Docker image.

### **WEB VISIT WORKFLOW**

1. A user requests www.intervolz.com.
2. The exposed Reverse Proxy Server running as a Docker image on the Docker network intervolz-network receives the request.
3. The Reverse Proxy Server directs the request to the locally hosted Docker image intervolzdotcom.