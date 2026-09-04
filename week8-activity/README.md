# DevOps Week 8 — Hands-on Activity: CPU Spike Investigation

 ## Prerequisites

Complete the Weekly Task setup first (Prometheus + Node Exporter installed
and running with the provided `alert_rules.yml`).

## Step 1: Capture Baseline

```bash
curl -s -G "http://localhost:9090/api/v1/query" \
  --data-urlencode 'query=100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)'
```

## Step 2: Generate a Controlled CPU Spike

```bash
# Run for 2 minutes, using all your CPU cores
for i in $(seq 1 $(nproc)); do
  timeout 120 sh -c 'while true; do :; done' &
done
```

## Step 3: Watch It in Prometheus

While the load runs, repeat the query from Step 1 every 15-30 seconds, or
just watch it live in the Prometheus UI:
```
http://localhost:9090/graph?g0.expr=100%20-%20(avg(irate(node_cpu_seconds_total%7Bmode%3D%22idle%22%7D%5B1m%5D))%20*%20100)
```
 

## Step 4: Watch the Alert Transition

```bash
watch -n 5 'curl -s http://localhost:9090/api/v1/alerts | python3 -m json.tool'
```
You should see `HighCPUUsage` move: (nothing) → `state: pending` →
`state: firing`, over roughly 90 seconds of **continuous** load — if the
load script gets interrupted even briefly, the timer resets, same as
documented in the report.

## Step 5: Check Logs

```bash
sudo tail -30 /var/log/prometheus/prometheus.log
```
If you don't have Alertmanager installed, you'll likely see the same
"connection refused" error documented in the report — that's expected and
is itself a useful, real finding worth including in your troubleshooting
summary. 

## Step 6: Restore Normal Operation

Just let the load script finish (or `pkill -f "while true"` to stop it
early). Re-run the Step 1 query — CPU should fall back toward baseline, and
within about a minute the alert should transition back to inactive on its
own.

## Writing Your Short Troubleshooting Summary

Base it on what you actually observed running the above — see
`Activity_Report.pdf` for a full worked example of the real data this
produces, including the genuine Alertmanager-connection-refused finding.
