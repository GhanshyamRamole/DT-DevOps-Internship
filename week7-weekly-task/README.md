# DevOps Week 7 — Weekly Task: Kubernetes Fundamentals

A complete set of Kubernetes manifests (Namespace, ConfigMap, Secret,
Deployment, Service, Ingress) plus a basic Helm chart wrapping the same app.

## Project Structure

```
.
├── manifests/
│   ├── 00-namespace.yaml
│   ├── 01-configmap.yaml
│   ├── 02-secret.yaml
│   ├── 03-deployment.yaml
│   ├── 04-service.yaml
│   └── 05-ingress.yaml
└── helm-chart/
    └── week7-app/
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
            ├── configmap.yaml
            ├── deployment.yaml
            ├── service.yaml
            └── NOTES.txt
```

## Validation Note

Every manifest in this project (and the Helm chart's rendered output with
default values) has been validated against the real Kubernetes OpenAPI
schema for versions 1.25 through 1.36 using the `kubernetes-validate` Python
package — confirming they are structurally correct Kubernetes objects before
you ever run `kubectl apply`. This doesn't replace testing them on a real
cluster (some things, like whether an image actually exists and starts up
correctly, can only be verified live) but it does rule out YAML typos and
schema mistakes upfront.

## Prerequisites

Install **one** of:
```bash
# Minikube
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube /usr/local/bin/

# OR Kind
go install sigs.k8s.io/kind@latest
```
Plus `kubectl`:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/
```

## Step 1: Start the Cluster

```bash
minikube start
# OR
kind create cluster --name week7
```

Screenshot `kubectl cluster-info` and `kubectl get nodes` — satisfies
"Screenshot of Running Cluster".

## Step 2: Apply the Manifests

```bash
kubectl apply -f manifests/00-namespace.yaml
kubectl apply -f manifests/01-configmap.yaml
kubectl apply -f manifests/02-secret.yaml
kubectl apply -f manifests/03-deployment.yaml
kubectl apply -f manifests/04-service.yaml

# Ingress needs a controller first (optional, exploration-level per the assignment):
minikube addons enable ingress          # Minikube only
kubectl apply -f manifests/05-ingress.yaml
```

## Step 3: Inspect Everything

```bash
kubectl get pods -n devops-week7                    # screenshot: Pods
kubectl get deployment -n devops-week7                # screenshot: Deployment
kubectl get service -n devops-week7                    # screenshot: Service
kubectl get configmap,secret -n devops-week7             # screenshot: ConfigMap/Secret
kubectl describe pod <pod-name> -n devops-week7
kubectl logs <pod-name> -n devops-week7
```

## Step 4: Access the App

```bash
minikube service week7-app-service -n devops-week7 --url
# or
curl http://<minikube-ip>:30080
```

## Step 5: Try the Helm Chart (Alternative to Step 2)

```bash
cd helm-chart
helm install week7-release ./week7-app -n devops-week7 --create-namespace
helm list -n devops-week7
helm uninstall week7-release -n devops-week7
```

## Practicing Important kubectl Commands

```bash
kubectl get all -n devops-week7
kubectl get events -n devops-week7 --sort-by='.lastTimestamp'
kubectl exec -it <pod-name> -n devops-week7 -- sh
kubectl port-forward svc/week7-app-service 8080:80 -n devops-week7
kubectl delete -f manifests/          # tear everything down
```
