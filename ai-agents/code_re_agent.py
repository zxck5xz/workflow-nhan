import os
import sys
import re
import json
from datetime import datetime

# Fix Windows console encoding issues for Unicode paths
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

class CodeREAgent:
    def __init__(self, root_dir="."):
        self.root_dir = os.path.abspath(root_dir)
        self.report = []
        self.findings = {
            "entry_points": [],
            "manifest_config": [],
            "api_flow": [],
            "data_flow": [],
            "permissions_security": []
        }

    def log(self, section, message):
        self.findings[section].append(message)

    def analyze_package_json(self):
        """Analogous to AndroidManifest.xml - understanding main architecture."""
        package_files = []
        for root, dirs, files in os.walk(self.root_dir):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if "package.json" in files:
                package_files.append(os.path.join(root, "package.json"))

        for pkg_path in package_files:
            rel_path = os.path.relpath(pkg_path, self.root_dir)
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    name = data.get("name", "unknown")
                    scripts = data.get("scripts", {})
                    deps = data.get("dependencies", {})
                    main = data.get("main", "N/A")
                    
                    self.log("manifest_config", f"**Module:** `{rel_path}` (Name: {name})")
                    self.log("manifest_config", f"- **Main Entry (from JSON):** `{main}`")
                    self.log("manifest_config", f"- **Key Scripts:** {', '.join(scripts.keys())}")
                    self.log("manifest_config", f"- **Key Dependencies:** {', '.join(list(deps.keys())[:10])}...")
                    
                    # Identify entry points from scripts
                    if "start" in scripts:
                        self.findings["entry_points"].append(f"Start Script ({rel_path}): `{scripts['start']}`")
                    if "dev" in scripts:
                        self.findings["entry_points"].append(f"Dev Script ({rel_path}): `{scripts['dev']}`")
            except Exception as e:
                self.log("manifest_config", f"Error reading {rel_path}: {str(e)}")

    def analyze_environment(self):
        """Searching for API keys/domains equivalent."""
        env_files = [".env", ".env.example", "vercel.json", "railway.json"]
        for env_file in env_files:
            path = os.path.join(self.root_dir, env_file)
            if os.path.exists(path):
                rel_path = os.path.relpath(path, self.root_dir)
                self.log("manifest_config", f"**Config File Found:** `{rel_path}`")
                
                if env_file.endswith(".json"):
                    try:
                        with open(path, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            if "env" in data:
                                keys = list(data["env"].keys())
                                self.log("permissions_security", f"Env keys in `{rel_path}`: {', '.join(keys)}")
                    except: pass
                else:
                    # Scan for keys in .env (names only for security)
                    try:
                        with open(path, "r", encoding="utf-8") as f:
                            for line in f:
                                if "=" in line and not line.strip().startswith("#"):
                                    key = line.split("=")[0].strip()
                                    self.log("permissions_security", f"Found Env Key: `{key}` in `{rel_path}`")
                    except: pass

    def analyze_api_flow(self):
        """Understand backend/frontend communication flow."""
        # Backend routes
        backend_dir = os.path.join(self.root_dir, "backend", "src")
        if os.path.exists(backend_dir):
            for root, dirs, files in os.walk(backend_dir):
                for file in files:
                    if file.endswith(".js"):
                        path = os.path.join(root, file)
                        try:
                            with open(path, "r", encoding="utf-8") as f:
                                content = f.read()
                                # Look for express routes
                                routes = re.findall(r'app\.(get|post|put|delete|patch)\([\'"](.+?)[\'"]', content)
                                for method, route in routes:
                                    self.log("api_flow", f"Backend Route: `[{method.upper()}] {route}` in `{os.path.basename(path)}`")
                        except: pass

        # Frontend API calls
        frontend_dir = os.path.join(self.root_dir, "task-dashboard", "src")
        if os.path.exists(frontend_dir):
            for root, dirs, files in os.walk(frontend_dir):
                for file in files:
                    if file.endswith((".ts", ".tsx")):
                        path = os.path.join(root, file)
                        try:
                            with open(path, "r", encoding="utf-8") as f:
                                content = f.read()
                                if "fetch(" in content or "axios." in content or "apiService" in content:
                                    # Try to extract URL or endpoint
                                    endpoints = re.findall(r'[\'"](/api/.+?)[\'"]', content)
                                    for ep in set(endpoints):
                                        self.log("api_flow", f"Frontend Call to: `{ep}` in `{os.path.basename(path)}`")
                        except: pass

    def analyze_data_flow(self):
        """Understand database/network code."""
        # Prisma Analysis
        prisma_schema = os.path.join(self.root_dir, "backend", "prisma", "schema.prisma")
        if os.path.exists(prisma_schema):
            self.log("data_flow", "**Prisma Schema Found:** `backend/prisma/schema.prisma`")
            try:
                with open(prisma_schema, "r", encoding="utf-8") as f:
                    content = f.read()
                    models = re.findall(r'model\s+(\w+)\s+{', content)
                    self.log("data_flow", f"Database Models: {', '.join(models)}")
            except: pass

        # Data Store Logic
        data_store = os.path.join(self.root_dir, "backend", "src", "data-store-db.js")
        if os.path.exists(data_store):
            self.log("data_flow", "**Data Store Logic:** `backend/src/data-store-db.js` (Handles DB interactions)")

    def generate_report(self, json_output=False):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if json_output:
            output = {
                "generated_at": now,
                "findings": self.findings
            }
            print(json.dumps(output, indent=2))
            return None

        report = []
        report.append(f"# Codebase Analysis Report: Project Engineering Reverse Engineering")
        report.append(f"*Generated on: {now}*")
        report.append("\n## Executive Summary")
        report.append("This report applies the 'Android Reverse Engineering' workflow logic to the current project's web/node architecture.")
        
        sections = {
            "manifest_config": "1. Manifest & Architecture Analysis (Project Mapping)",
            "entry_points": "2. Main Entry Points (Activity/Entry Point Equivalence)",
            "api_flow": "3. API & Communication Flow (Intent/Network Flow)",
            "data_flow": "4. Data Flow & Storage (Database/Local Storage)",
            "permissions_security": "5. Security & Permissions (Sensitive Data Mapping)"
        }
        
        for key, title in sections.items():
            report.append(f"\n## {title}")
            if self.findings[key]:
                for finding in self.findings[key]:
                    report.append(f"- {finding}")
            else:
                report.append("- No specific findings in this category.")
        
        report_path = os.path.join(self.root_dir, "CODE_RE_ANALYSIS.md")
        with open(report_path, "w", encoding="utf-8") as f:
            f.write("\n".join(report))
        
        print(f"Report generated at: {report_path}")
        return report_path

    def run(self, json_output=False):
        if not json_output:
            print("Starting Codebase Analysis...")
        self.analyze_package_json()
        self.analyze_environment()
        self.analyze_api_flow()
        self.analyze_data_flow()
        return self.generate_report(json_output=json_output)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Codebase Reverse Engineering Agent")
    parser.add_argument("--json", action="store_true", help="Output findings as JSON")
    args = parser.parse_args()
    
    agent = CodeREAgent()
    agent.run(json_output=args.json)
