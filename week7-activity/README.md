# DevOps Week 7 — Hands-on Activity: Scaling, Rolling Updates &amp; Rollback

A 3-replica Deployment used to demonstrate scaling, a rolling update between
two real nginx versions, and rolling back to the previous version — all in a
dedicated namespace.

## Project Structure

```
.
└── manifests/
    ├── 00-namespace.yaml   # week7-activity
    ├── 01-deployment.yaml   # web-app, 3 replicas, nginx:1.25
    └── 02-service.yaml       # NodePort 30081
```

Both manifests are schema-validated against Kubernetes 1.25–1.36 (see the
Weekly Task README for details on how).

## Step 1: Deploy

```bash
kubectl apply -f manifests/00-namespace.yaml
kubectl apply -f manifests/01-deployment.yaml
kubectl apply -f manifests/02-service.yaml

kubectl get pods -n week7-activity

```

## Step 2: Access the App

```bash
minikube service web-app-service -n week7-activity --url

```

## Step 3: Scale Up and Down

```bash
kubectl scale deployment web-app --replicas=5 -n week7-activity
kubectl get pods -n week7-activity


kubectl scale deployment web-app --replicas=3 -n week7-activity
kubectl get pods -n week7-activity
```

## Step 4: Rolling Update

```bash
kubectl set image deployment/web-app web-app=nginx:1.27 -n week7-activity

kubectl rollout status deployment/web-app -n week7-activity


kubectl get pods -n week7-activity -o wide
kubectl describe deployment web-app -n week7-activity | grep Image
```

Because the Deployment's `maxUnavailable: 0` setting is used, the app stays
fully available (3 replicas minimum) throughout the entire update.

## Step 5: Rollback

```bash
kubectl rollout history deployment/web-app -n week7-activity
kubectl rollout undo deployment/web-app -n week7-activity
kubectl rollout status deployment/web-app -n week7-activity


kubectl describe deployment web-app -n week7-activity | grep Image
# Should show nginx:1.25 again
```

## What to Include in Your Short Explanation

See `Activity_Architecture_and_Summary.pdf` for a full write-up of what
happens mechanically during scaling and rollback — worth reading before
writing your own version in your own words, since a reviewer may ask you to
explain it verbally.

## Cleanup

```bash
kubectl delete namespace week7-activity
```
