"use client";

import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";

interface TestResult {
  testType: string;
  testNumber: number;
  metrics: {
    http_reqs: { count: number; rate: number };
    http_req_duration: { avg: number; min: number; med: number; max: number; "p(90)": number; "p(95)": number };
    http_req_failed: { passes: number; fails: number; value: number };
    iterations: { count: number; rate: number };
    vus: { value: number; min: number; max: number };
    data_received: { count: number; rate: number };
    data_sent: { count: number; rate: number };
  };
}

export default function LoadBalancingDashboard() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTestType, setSelectedTestType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [echartsReady, setEchartsReady] = useState(false);

  useEffect(() => {
    loadTestResults();
    // Check if echarts is available
    const checkEcharts = () => {
      if (typeof window !== 'undefined' && (window as any).echarts) {
        setEchartsReady(true);
      } else {
        setTimeout(checkEcharts, 100);
      }
    };
    checkEcharts();
  }, []);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      // Load test results from JSON files in public/case/results
      const testTypes = ["smoke-test", "avg-load-test", "spike-test", "stress-test"];
      const results: TestResult[] = [];

      for (const testType of testTypes) {
        // Adjust the number of files based on test type
        let maxFiles = 3; // Most test types have 3 files
        if (testType === "smoke-test") {
          maxFiles = 6; // Assuming smoke test has 6 files
        }

        for (let i = 1; i <= maxFiles; i++) {
          try {
            // Fix the file naming pattern to match your actual files
            let fileName = "";
            switch (testType) {
              case "smoke-test":
                fileName = `smoke_${i}.json`;
                break;
              case "avg-load-test":
                fileName = `avg_${i}.json`;
                break;
              case "spike-test":
                fileName = `spike_${i}.json`;
                break;
              case "stress-test":
                fileName = `stress_${i}.json`;
                break;
            }

            const response = await fetch(`/case/results/${testType}/${fileName}`);
            if (response.ok) {
              const data = await response.json();
              results.push({
                testType: testType.replace("-test", "").replace("-", " ").toUpperCase(),
                testNumber: i,
                metrics: data.metrics
              });
            } else {
              console.log(`File not found: ${testType}/${fileName}`);
            }
          } catch (error) {
            console.log(`Error loading ${testType}_${i}.json:`, error);
          }
        }
      }

      setTestResults(results);
      console.log(`Loaded ${results.length} test results`);
    } catch (error) {
      console.error("Error loading test results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (selectedTestType === "all") return testResults;
    return testResults.filter(result => 
      result.testType.toLowerCase().includes(selectedTestType.toLowerCase())
    );
  };

  const getOverviewStats = () => {
    const filtered = getFilteredResults();
    if (filtered.length === 0) return null;

    const totalRequests = filtered.reduce((sum, result) => sum + result.metrics.http_reqs.count, 0);
    const avgDuration = filtered.reduce((sum, result) => sum + result.metrics.http_req_duration.avg, 0) / filtered.length;
    const totalFailures = filtered.reduce((sum, result) => sum + result.metrics.http_req_failed.fails, 0);
    const avgFailureRate = filtered.reduce((sum, result) => sum + result.metrics.http_req_failed.value, 0) / filtered.length;

    return {
      totalRequests,
      avgDuration,
      totalFailures,
      avgFailureRate: avgFailureRate * 100
    };
  };

  // Response Time Comparison Chart
  const getResponseTimeChart = () => {
    const filtered = getFilteredResults();
    const categories = filtered.map(result => `${result.testType} #${result.testNumber}`);
    
    return {
      title: {
        text: 'Response Time Analysis',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: function(params: any) {
          let tooltip = `<div style="min-width: 200px;">`;
          tooltip += `<strong>${params[0].name}</strong><br/>`;
          params.forEach((param: any) => {
            tooltip += `${param.marker} ${param.seriesName}: ${param.value.toFixed(2)}ms<br/>`;
          });
          tooltip += `</div>`;
          return tooltip;
        }
      },
      legend: {
        data: ['Average', 'P95', 'P90', 'Median'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 45, interval: 0, fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'Response Time (ms)',
        axisLabel: { formatter: '{value}ms' }
      },
      series: [
        {
          name: 'Average',
          type: 'line',
          data: filtered.map(r => r.metrics.http_req_duration.avg),
          lineStyle: { width: 3 },
          itemStyle: { color: '#3b82f6' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'P95',
          type: 'line',
          data: filtered.map(r => r.metrics.http_req_duration["p(95)"]),
          lineStyle: { width: 2, type: 'dashed' },
          itemStyle: { color: '#ef4444' },
          symbol: 'triangle',
          symbolSize: 6
        },
        {
          name: 'P90',
          type: 'line',
          data: filtered.map(r => r.metrics.http_req_duration["p(90)"]),
          lineStyle: { width: 2, type: 'dashed' },
          itemStyle: { color: '#f59e0b' },
          symbol: 'diamond',
          symbolSize: 6
        },
        {
          name: 'Median',
          type: 'line',
          data: filtered.map(r => r.metrics.http_req_duration.med),
          lineStyle: { width: 2 },
          itemStyle: { color: '#10b981' },
          symbol: 'rect',
          symbolSize: 6
        }
      ]
    };
  };

  // Throughput Chart - Fixed the echarts.graphic issue
  const getThroughputChart = () => {
    const filtered = getFilteredResults();
    
    return {
      title: {
        text: 'Throughput Analysis',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const data = params[0];
          return `<div style="min-width: 200px;">
            <strong>${data.name}</strong><br/>
            ${data.marker} Requests/sec: ${data.value.toFixed(2)}<br/>
            Total Requests: ${filtered[data.dataIndex].metrics.http_reqs.count}
          </div>`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: filtered.map(result => `${result.testType} #${result.testNumber}`),
        axisLabel: { rotate: 45, interval: 0, fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'Requests/sec',
        axisLabel: { formatter: '{value}/s' }
      },
      series: [{
        name: 'Throughput',
        type: 'bar',
        data: filtered.map(r => r.metrics.http_reqs.rate),
        itemStyle: {
          // Use a simple color instead of gradient to avoid echarts dependency
          color: '#3b82f6'
        },
        barWidth: '60%'
      }]
    };
  };

  // Error Rate Chart
  const getErrorRateChart = () => {
    const filtered = getFilteredResults();
    
    return {
      title: {
        text: 'Error Rate Analysis',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const data = params[0];
          const result = filtered[data.dataIndex];
          return `<div style="min-width: 200px;">
            <strong>${data.name}</strong><br/>
            ${data.marker} Error Rate: ${(data.value * 100).toFixed(2)}%<br/>
            Failed: ${result.metrics.http_req_failed.fails}<br/>
            Passed: ${result.metrics.http_req_failed.passes}
          </div>`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: filtered.map(result => `${result.testType} #${result.testNumber}`),
        axisLabel: { rotate: 45, interval: 0, fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'Error Rate (%)',
        max: 1,
        axisLabel: { formatter: '{value}%' }
      },
      series: [{
        name: 'Error Rate',
        type: 'bar',
        data: filtered.map(r => r.metrics.http_req_failed.value),
        itemStyle: {
          color: function(params: any) {
            const value = params.value;
            if (value < 0.01) return '#10b981'; // Green for low error rate
            if (value < 0.05) return '#f59e0b'; // Yellow for medium error rate
            return '#ef4444'; // Red for high error rate
          }
        },
        barWidth: '60%'
      }]
    };
  };

  // Virtual Users Chart
  const getVirtualUsersChart = () => {
    const filtered = getFilteredResults();
    
    return {
      title: {
        text: 'Virtual Users Load',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const data = params[0];
          const result = filtered[data.dataIndex];
          return `<div style="min-width: 200px;">
            <strong>${data.name}</strong><br/>
            ${data.marker} Current VUs: ${result.metrics.vus.value}<br/>
            Min VUs: ${result.metrics.vus.min}<br/>
            Max VUs: ${result.metrics.vus.max}
          </div>`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: filtered.map(result => `${result.testType} #${result.testNumber}`),
        axisLabel: { rotate: 45, interval: 0, fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'Virtual Users'
      },
      series: [
        {
          name: 'Max VUs',
          type: 'bar',
          data: filtered.map(r => r.metrics.vus.max),
          itemStyle: { color: '#3b82f6', opacity: 0.6 },
          barWidth: '60%'
        },
        {
          name: 'Current VUs',
          type: 'bar',
          data: filtered.map(r => r.metrics.vus.value),
          itemStyle: { color: '#1d4ed8' },
          barWidth: '60%'
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading test results...</p>
        </div>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Load Balancing Test Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of system performance under various load conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-dark-700">Test Type:</label>
              <select
                value={selectedTestType}
                onChange={(e) => setSelectedTestType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tests</option>
                <option value="smoke">Smoke Tests</option>
                <option value="avg">Average Load Tests</option>
                <option value="spike">Spike Tests</option>
                <option value="stress">Stress Tests</option>
              </select>
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              {["overview", "performance", "reliability"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgDuration.toFixed(0)}ms</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Failures</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFailures.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full mr-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Error Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgFailureRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getResponseTimeChart()} style={{ height: "400px" }} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getThroughputChart()} style={{ height: "400px" }} />
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "performance" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getResponseTimeChart()} style={{ height: "400px" }} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getVirtualUsersChart()} style={{ height: "400px" }} />
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "reliability" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getErrorRateChart()} style={{ height: "400px" }} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ReactECharts option={getThroughputChart()} style={{ height: "400px" }} />
                </div>
              </motion.div>
            </>
          )}

          {/* Detailed Results Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Test Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P95</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Throughput</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VUs</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredResults().map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.testType} #{result.testNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.metrics.http_reqs.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.metrics.http_req_duration.avg.toFixed(0)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.metrics.http_req_duration["p(95)"].toFixed(0)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.metrics.http_req_failed.value < 0.01 
                            ? 'bg-green-100 text-green-800'
                            : result.metrics.http_req_failed.value < 0.05
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(result.metrics.http_req_failed.value * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.metrics.http_reqs.rate.toFixed(1)}/s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.metrics.vus.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}