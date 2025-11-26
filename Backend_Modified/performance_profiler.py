"""
Performance Profiler for KairosCV Backend

Measures and reports on key performance metrics:
- Endpoint response times
- Memory usage
- CPU usage
- Request throughput
- LaTeX compilation time
"""

import time
import psutil
import requests
import json
import statistics
from typing import Dict, List, Any
from datetime import datetime
import argparse


class PerformanceProfiler:
    """Profile backend performance and generate reports"""

    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.process = psutil.Process()
        self.results: Dict[str, Any] = {}

    def measure_memory(self) -> Dict[str, float]:
        """Get current memory usage"""
        memory_info = self.process.memory_info()
        return {
            "rss_mb": memory_info.rss / (1024 * 1024),  # Resident Set Size
            "vms_mb": memory_info.vms / (1024 * 1024),  # Virtual Memory Size
        }

    def measure_cpu(self, interval: float = 1.0) -> float:
        """Get CPU usage percentage"""
        return self.process.cpu_percent(interval=interval)

    def test_endpoint_latency(
        self,
        endpoint: str,
        method: str = "GET",
        data: Dict = None,
        iterations: int = 10
    ) -> Dict[str, Any]:
        """Test endpoint response time"""
        print(f"\n{'='*60}")
        print(f"Testing: {method} {endpoint}")
        print(f"Iterations: {iterations}")
        print(f"{'='*60}")

        latencies = []
        errors = 0

        for i in range(iterations):
            try:
                start_time = time.time()

                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", timeout=30)
                elif method == "POST":
                    response = requests.post(
                        f"{self.base_url}{endpoint}",
                        json=data,
                        timeout=30
                    )
                else:
                    raise ValueError(f"Unsupported method: {method}")

                latency = (time.time() - start_time) * 1000  # Convert to ms
                latencies.append(latency)

                status = "[OK]" if response.status_code < 400 else "[ERR]"
                print(f"  {status} Request {i+1}/{iterations}: {latency:.2f}ms (Status: {response.status_code})", flush=True)

                if response.status_code >= 400:
                    errors += 1

                # Small delay between requests
                time.sleep(0.1)

            except Exception as e:
                print(f"  [ERR] Request {i+1}/{iterations}: ERROR - {str(e)}", flush=True)
                errors += 1

        if latencies:
            results = {
                "endpoint": endpoint,
                "method": method,
                "iterations": iterations,
                "successful": iterations - errors,
                "errors": errors,
                "min_ms": min(latencies),
                "max_ms": max(latencies),
                "mean_ms": statistics.mean(latencies),
                "median_ms": statistics.median(latencies),
                "stdev_ms": statistics.stdev(latencies) if len(latencies) > 1 else 0,
                "p95_ms": self._percentile(latencies, 95),
                "p99_ms": self._percentile(latencies, 99),
            }
        else:
            results = {
                "endpoint": endpoint,
                "method": method,
                "iterations": iterations,
                "successful": 0,
                "errors": errors,
                "error": "All requests failed"
            }

        print(f"\nResults:")
        if "error" not in results:
            print(f"  Success Rate: {results['successful']}/{results['iterations']} ({results['successful']/results['iterations']*100:.1f}%)")
            print(f"  Mean Latency: {results['mean_ms']:.2f}ms")
            print(f"  Median Latency: {results['median_ms']:.2f}ms")
            print(f"  95th Percentile: {results['p95_ms']:.2f}ms")
            print(f"  Min/Max: {results['min_ms']:.2f}ms / {results['max_ms']:.2f}ms")
        else:
            print(f"  [ERR] {results['error']}", flush=True)

        return results

    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile value"""
        sorted_data = sorted(data)
        index = (len(sorted_data) - 1) * percentile / 100
        floor_index = int(index)
        ceil_index = floor_index + 1

        if ceil_index >= len(sorted_data):
            return sorted_data[floor_index]

        fraction = index - floor_index
        return sorted_data[floor_index] * (1 - fraction) + sorted_data[ceil_index] * fraction

    def run_baseline_tests(self) -> Dict[str, Any]:
        """Run comprehensive baseline performance tests"""
        print("\n" + "="*80)
        print("KAIROSCV BACKEND - PERFORMANCE BASELINE")
        print("="*80)
        print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Base URL: {self.base_url}")
        print("="*80)

        # Initial memory snapshot
        initial_memory = self.measure_memory()
        print(f"\nInitial Memory: {initial_memory['rss_mb']:.2f} MB")

        results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": self.base_url,
            "initial_memory_mb": initial_memory['rss_mb'],
            "tests": {}
        }

        # Test 1: Health endpoint (lightweight)
        print("\n" + "="*80)
        print("TEST 1: Health Endpoint")
        print("="*80)
        health_results = self.test_endpoint_latency(
            "/health",
            method="GET",
            iterations=20
        )
        results["tests"]["health"] = health_results

        # Test 2: JSON to LaTeX conversion (compute-intensive)
        print("\n" + "="*80)
        print("TEST 2: PDF Generation (JSON to LaTeX)")
        print("="*80)

        # Sample resume data
        sample_resume = {
            "basicInfo": {
                "fullName": "Performance Test User",
                "email": "perf@test.com",
                "phone": "+1234567890",
                "linkedin": "linkedin.com/in/test",
                "github": "github.com/test"
            },
            "education": [
                {
                    "id": "edu1",
                    "institution": "Test University",
                    "location": "Test City, TC",
                    "degree": "B.S. in Computer Science",
                    "minor": None,
                    "startDate": "2018-09",
                    "endDate": "2022-05",
                    "isPresent": False
                }
            ],
            "experience": [
                {
                    "id": "exp1",
                    "organization": "Tech Company",
                    "jobTitle": "Software Engineer",
                    "location": "Tech City, TC",
                    "startDate": "2022-06",
                    "endDate": None,
                    "isPresent": True,
                    "description": [
                        "Developed scalable backend services using Python and FastAPI",
                        "Optimized database queries resulting in 40% performance improvement",
                        "Collaborated with cross-functional teams to deliver features"
                    ]
                }
            ],
            "projects": [
                {
                    "id": "proj1",
                    "name": "Performance Testing Tool",
                    "technologies": "Python, FastAPI, PostgreSQL",
                    "startDate": "2023-01",
                    "endDate": "2023-06",
                    "isPresent": False,
                    "description": [
                        "Built automated performance testing framework",
                        "Reduced test execution time by 60%"
                    ]
                }
            ],
            "skills": {
                "languages": "Python, JavaScript, TypeScript",
                "frameworks": "FastAPI, React, Next.js",
                "developerTools": "Git, Docker, Kubernetes",
                "libraries": "LangChain, Pandas, NumPy"
            }
        }

        pdf_results = self.test_endpoint_latency(
            "/convert-json-to-latex",
            method="POST",
            data=sample_resume,
            iterations=5  # Fewer iterations for expensive operation
        )
        results["tests"]["pdf_generation"] = pdf_results

        # Final memory snapshot
        final_memory = self.measure_memory()
        memory_growth = final_memory['rss_mb'] - initial_memory['rss_mb']

        results["final_memory_mb"] = final_memory['rss_mb']
        results["memory_growth_mb"] = memory_growth

        print("\n" + "="*80)
        print("MEMORY ANALYSIS")
        print("="*80)
        print(f"Initial Memory: {initial_memory['rss_mb']:.2f} MB")
        print(f"Final Memory: {final_memory['rss_mb']:.2f} MB")
        print(f"Growth: {memory_growth:+.2f} MB")

        # CPU usage (approximate)
        print("\n" + "="*80)
        print("CPU USAGE (1 second sample)")
        print("="*80)
        cpu_percent = self.measure_cpu(interval=1.0)
        results["cpu_percent"] = cpu_percent
        print(f"CPU: {cpu_percent:.1f}%")

        return results

    def generate_report(self, results: Dict[str, Any], output_file: str = None):
        """Generate performance report"""
        report = []
        report.append("\n" + "="*80)
        report.append("PERFORMANCE BASELINE REPORT")
        report.append("="*80)
        report.append(f"Timestamp: {results['timestamp']}")
        report.append(f"Base URL: {results['base_url']}")
        report.append("")

        # Summary table
        report.append("SUMMARY")
        report.append("-"*80)
        report.append(f"{'Metric':<30} {'Value':<20}")
        report.append("-"*80)
        report.append(f"{'Initial Memory':<30} {results['initial_memory_mb']:.2f} MB")
        report.append(f"{'Final Memory':<30} {results['final_memory_mb']:.2f} MB")
        report.append(f"{'Memory Growth':<30} {results['memory_growth_mb']:+.2f} MB")
        report.append(f"{'CPU Usage':<30} {results.get('cpu_percent', 0):.1f}%")
        report.append("")

        # Test results
        for test_name, test_results in results['tests'].items():
            report.append(f"\nTEST: {test_name.upper()}")
            report.append("-"*80)

            if "error" in test_results:
                report.append(f"[ERR] {test_results['error']}")
                continue

            report.append(f"Endpoint: {test_results['method']} {test_results['endpoint']}")
            report.append(f"Success Rate: {test_results['successful']}/{test_results['iterations']} ({test_results['successful']/test_results['iterations']*100:.1f}%)")
            report.append(f"Mean Latency: {test_results['mean_ms']:.2f} ms")
            report.append(f"Median Latency: {test_results['median_ms']:.2f} ms")
            report.append(f"95th Percentile: {test_results['p95_ms']:.2f} ms")
            report.append(f"99th Percentile: {test_results['p99_ms']:.2f} ms")
            report.append(f"Min Latency: {test_results['min_ms']:.2f} ms")
            report.append(f"Max Latency: {test_results['max_ms']:.2f} ms")
            report.append(f"Std Deviation: {test_results['stdev_ms']:.2f} ms")

        report.append("\n" + "="*80)
        report.append("ANALYSIS & RECOMMENDATIONS")
        report.append("="*80)

        # Analyze results and provide recommendations
        health_mean = results['tests'].get('health', {}).get('mean_ms', 0)
        pdf_mean = results['tests'].get('pdf_generation', {}).get('mean_ms', 0)

        if health_mean > 0:
            if health_mean < 50:
                report.append("[OK] Health endpoint: EXCELLENT (<50ms)")
            elif health_mean < 100:
                report.append("[OK] Health endpoint: GOOD (<100ms)")
            else:
                report.append("[WARN] Health endpoint: SLOW (>100ms) - Consider caching")

        if pdf_mean > 0:
            if pdf_mean < 500:
                report.append("[OK] PDF generation: EXCELLENT (<500ms)")
            elif pdf_mean < 1000:
                report.append("[OK] PDF generation: GOOD (<1s)")
            elif pdf_mean < 3000:
                report.append("[WARN] PDF generation: ACCEPTABLE (<3s) - Room for improvement")
            else:
                report.append("[ERR] PDF generation: SLOW (>3s) - Needs optimization")

        if results['memory_growth_mb'] > 100:
            report.append("[WARN] Memory growth: HIGH (>100MB) - Check for leaks")
        elif results['memory_growth_mb'] > 50:
            report.append("[WARN] Memory growth: MODERATE (>50MB) - Monitor closely")
        else:
            report.append("[OK] Memory growth: LOW - Excellent memory management")

        report_text = "\n".join(report)
        print(report_text)

        # Save to file if specified
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
            print(f"\n[OK] Report saved to: {output_file}", flush=True)

        # Save JSON results
        json_file = output_file.replace('.txt', '.json') if output_file else 'performance_baseline.json'
        with open(json_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"[OK] JSON results saved to: {json_file}", flush=True)

        return report_text


def main():
    parser = argparse.ArgumentParser(description="Profile KairosCV backend performance")
    parser.add_argument('--url', default='http://localhost:8080', help='Backend base URL')
    parser.add_argument('--output', default='performance_baseline_day12.txt', help='Output report file')
    parser.add_argument('--baseline', action='store_true', help='Run baseline tests')

    args = parser.parse_args()

    profiler = PerformanceProfiler(base_url=args.url)

    if args.baseline:
        results = profiler.run_baseline_tests()
        profiler.generate_report(results, output_file=args.output)
    else:
        print("Use --baseline to run baseline performance tests")
        print(f"Example: python performance_profiler.py --baseline")


if __name__ == "__main__":
    main()
