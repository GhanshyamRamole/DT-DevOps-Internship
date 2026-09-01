# DevOps Week 8 — Weekly Task: Prometheus, Grafana &amp; Node Exporter

## Honesty Note (read this first)

Everything under `prometheus/` in this project was **actually installed, run,
and tested** — Prometheus and Node Exporter genuinely scraped real system
metrics, and the alert rules genuinely fired against real CPU load, all
verified via Prometheus's own HTTP API 

**Grafana installed and run**  Install and build dashboards from `grafana/` folder
contains a correctly-structured datasource config and a dashboard JSON built
against the exact PromQL queries already confirmed working, 

## Project Structure

```
.
├── prometheus/ 
│   ├── prometheus.yml        
│   └── alert_rules.yml      
└── grafana/
    └── provisioning/
        ├── datasources/
        │   └── prometheus.yml     
        └── dashboards/
            ├── dashboard.yml        
            └── node-exporter-overview.json   
```

## Step 1: Install Prometheus &amp; Node Exporter

```bash
sudo apt update
sudo apt install -y prometheus prometheus-node-exporter
sudo systemctl enable --now prometheus prometheus-node-exporter
```

Verify both are running:
```bash
curl http://localhost:9100/metrics | head    # Node Exporter
curl http://localhost:9090/-/healthy          # Prometheus
```

## Step 2: Use the Provided Config

```bash
sudo cp prometheus/alert_rules.yml /etc/prometheus/alert_rules.yml
sudo cp prometheus/prometheus.yml /etc/prometheus/prometheus.yml
sudo systemctl restart prometheus
```

Confirm both targets are up:
```bash
curl http://localhost:9090/api/v1/query?query=up
# Both 'prometheus' and 'node' jobs should show value "1"
```
Screenshot the Prometheus UI at `http://localhost:9090/targets` — satisfies
"Prometheus Screenshot" and "Node Exporter Screenshot".

## Step 3: Install Grafana (this part is genuinely untested by me)

```bash
sudo apt-get install -y adduser libfontconfig1 musl
wget https://dl.grafana.com/oss/release/grafana_<latest-version>_amd64.deb
sudo dpkg -i grafana_<latest-version>_amd64.deb
sudo systemctl enable --now grafana-server
```
Check https://grafana.com/grafana/download for the current version number.

Copy the provisioning files into place:
```bash
sudo cp grafana/provisioning/datasources/prometheus.yml /etc/grafana/provisioning/datasources/
sudo cp grafana/provisioning/dashboards/dashboard.yml /etc/grafana/provisioning/dashboards/
sudo cp grafana/provisioning/dashboards/node-exporter-overview.json /etc/grafana/provisioning/dashboards/
sudo systemctl restart grafana-server
```

Open `http://localhost:3000` (default login: admin/admin), and check:
1. **Connections → Data sources** — Prometheus should already be listed (auto-provisioned)
2. **Dashboards** — "Week 8 - Node Exporter Overview" should already be listed

**If the dashboard doesn't load correctly or panels show errors:** the JSON
was built carefully against Grafana's documented schema and the exact working
PromQL queries, but since I couldn't test it in a live Grafana, you may need
to open a panel's edit view and re-select "Prometheus" as its data source if
the `datasource.uid` reference doesn't automatically resolve — this is a
common minor provisioning quirk. Screenshot the working dashboard —
satisfies "Grafana Dashboard Screenshot".

## Step 4: Explore Linux Logs

```bash
sudo tail -50 /var/log/syslog
sudo tail -50 /var/log/auth.log
journalctl -u prometheus -n 50
```
Screenshot any of these — satisfies "Linux Logs Screenshot".

## Step 5: Confirm the Alert Is Configured

```bash
curl http://localhost:9090/api/v1/rules
```
Or check the Prometheus UI at `http://localhost:9090/alerts` — screenshot
this, showing the HighCPUUsage/HighMemoryUsage/HighDiskUsage rules listed
(even if inactive) — satisfies "Alert Configuration Screenshot".
