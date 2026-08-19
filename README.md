# Aspecta Demo

Lightweight frontend/backend application used to demonstrate containerization and Kubernetes deployment with Helm.

## Components

- Frontend: static HTML/JavaScript served by NGINX on port `8080`
- Backend: Flask API served by Gunicorn on port `5000`
- Deployment: Docker or Kubernetes with Helm

## Build images

Run from the repository root:

```powershell
docker build -t aspecta-demo-backend:latest src/backend
docker build -t aspecta-demo-frontend:latest src/frontend
```

Verify:

```powershell
docker images aspecta-demo-backend
docker images aspecta-demo-frontend
```

## Deploy with Docker

Create a shared network:

```powershell
docker network create aspecta-demo
```

Start the backend:

```powershell
docker run -d --name aspecta-demo-backend --network aspecta-demo -e APP_ENV=local -e "APP_MESSAGE=Hello from Aspecta Demo!" -p 5000:5000 aspecta-demo-backend:latest
```

Start the frontend:

```powershell
docker run -d --name aspecta-demo-frontend --network aspecta-demo -p 8080:8080 aspecta-demo-frontend:latest
```

Verify:

```powershell
docker ps
curl.exe http://localhost:5000/health
curl.exe http://localhost:5000/api/message
```

Open `http://localhost:8080`.

Remove the containers:

```powershell
docker rm -f aspecta-demo-frontend aspecta-demo-backend
docker network rm aspecta-demo
```

## Deploy with Helm

The following example uses minikube with the Docker driver.

Start the cluster and enable NGINX Ingress:

```powershell
minikube start --driver=docker
minikube addons enable ingress
```

Load the locally built images:

```powershell
minikube image load aspecta-demo-backend:latest
minikube image load aspecta-demo-frontend:latest
```

Validate the chart:

```powershell
helm lint helm/aspecta-demo
helm template aspecta-demo helm/aspecta-demo --namespace aspecta-demo
```

Deploy:

```powershell
helm upgrade --install aspecta-demo helm/aspecta-demo --namespace aspecta-demo --create-namespace
```

Check the release:

```powershell
helm list --namespace aspecta-demo
kubectl get all --namespace aspecta-demo
kubectl get ingress,configmap,secret --namespace aspecta-demo
```

Wait for the Deployments:

```powershell
kubectl rollout status deployment/aspecta-demo-backend --namespace aspecta-demo
kubectl rollout status deployment/aspecta-demo-frontend --namespace aspecta-demo
```

## Test the Kubernetes deployment

Forward the frontend Service:

```powershell
kubectl port-forward service/aspecta-demo-frontend 8081:80 --namespace aspecta-demo
```

Open `http://localhost:8081`.

Expected application configuration:

```text
Hello from Aspecta Demo running in Kubernetes!
Environment: demo
```

Test the backend directly:

```powershell
kubectl port-forward service/aspecta-demo-backend 5001:5000 --namespace aspecta-demo
curl.exe http://localhost:5001/health
curl.exe http://localhost:5001/api/message
```

Test Ingress by forwarding the NGINX controller:

```powershell
kubectl port-forward service/ingress-nginx-controller 8082:80 --namespace ingress-nginx
```

From another terminal:

```powershell
curl.exe -H "Host: aspecta-demo.local" http://localhost:8082
```

## Cleanup

```powershell
helm uninstall aspecta-demo --namespace aspecta-demo
kubectl delete namespace aspecta-demo
minikube stop
```

Runtime configuration is defined in `helm/aspecta-demo/values.yaml`.