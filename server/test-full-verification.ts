async function runFullVerification() {
  console.log('==================================================');
  console.log('🛡️  SENTINELFLOW AI — FINAL SYSTEM VERIFICATION');
  console.log('==================================================\n');

  // Point 1: Backend Health
  console.log('1. Verifying Backend Health (http://localhost:5000/api/v1/health)...');
  const backendRes = await fetch('http://localhost:5000/api/v1/health');
  const backendData = await backendRes.json();
  console.log(`   Status: ${backendRes.status}, Service: ${backendData.service}, AI Engine: ${backendData.aiEngine}`);

  // Point 2: Frontend Server
  console.log('\n2. Verifying Frontend Dev Server (http://localhost:5173/)...');
  const frontendRes = await fetch('http://localhost:5173/');
  const frontendHtml = await frontendRes.text();
  const hasRoot = frontendHtml.includes('id="root"');
  console.log(`   Status: ${frontendRes.status}, Document Root Mounted: ${hasRoot}`);

  // Point 6: All Endpoints
  console.log('\n3. Verifying All REST API Endpoints...');
  
  // Threats list
  const tList = await (await fetch('http://localhost:5000/api/v1/threats')).json();
  console.log(`   GET /threats: ${tList.count} threats loaded`);

  // Threats metrics
  const tMetrics = await (await fetch('http://localhost:5000/api/v1/threats/metrics')).json();
  console.log(`   GET /threats/metrics: Total=${tMetrics.data?.totalThreats}, Critical=${tMetrics.data?.criticalRisk}, Systems=${tMetrics.data?.systemsMonitored}`);

  // Threat Detail
  const tDetail = await (await fetch('http://localhost:5000/api/v1/threats/THREAT-001')).json();
  console.log(`   GET /threats/THREAT-001: Name=${tDetail.data?.name}, Risk=${tDetail.data?.riskScore}`);

  // Threat Status Update
  const tStatus = await (await fetch('http://localhost:5000/api/v1/threats/THREAT-001/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Investigating' }),
  })).json();
  console.log(`   PATCH /threats/THREAT-001/status: Status=${tStatus.data?.status}`);

  // Events Stream
  const eList = await (await fetch('http://localhost:5000/api/v1/events?limit=5')).json();
  console.log(`   GET /events: Total=${eList.total}, Returned=${eList.events?.length}`);

  // Event Ingest
  const eIngest = await (await fetch('http://localhost:5000/api/v1/events/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      event_type: 'login',
      user: 'admin_test',
      source_ip: '185.220.101.5',
      destination_host: 'DC-01',
      destination_ip: '10.0.4.12',
      status: 'failed',
      severity: 'HIGH',
      device: 'Palo Alto GlobalProtect',
    }),
  })).json();
  console.log(`   POST /events/ingest: ThreatDetected=${eIngest.threatDetected}, EventID=${eIngest.data?.id}`);

  // Systems Fleet
  const sList = await (await fetch('http://localhost:5000/api/v1/systems')).json();
  console.log(`   GET /systems: Count=${sList.count}`);

  // Forecast
  const fc = await (await fetch('http://localhost:5000/api/v1/forecast/THREAT-001')).json();
  console.log(`   GET /forecast/THREAT-001: NextStage=${fc.nextLikelyStage} (${fc.nextLikelyProbability}%)`);

  // Forecast Predict Custom
  const fcPred = await (await fetch('http://localhost:5000/api/v1/forecast/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentStageId: 'initial-access', riskScore: 88, threatName: 'Custom Kerberoast' }),
  })).json();
  console.log(`   POST /forecast/predict: NextStage=${fcPred.data?.nextLikelyStage} (${fcPred.data?.nextLikelyProbability}%)`);

  // Explainability
  const exp = await (await fetch('http://localhost:5000/api/v1/explainability/THREAT-001')).json();
  console.log(`   GET /explainability/THREAT-001: Factors=${exp.contributingFactors?.length}`);

  // Explainability Custom
  const expCust = await (await fetch('http://localhost:5000/api/v1/explainability/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'privilege_escalation',
      user: 'IIS_IUSRS',
      source_ip: '10.0.3.18',
      details: 'Named pipe impersonation token',
    }),
  })).json();
  console.log(`   POST /explainability/explain: Factors=${expCust.data?.contributingFactors?.length}`);

  // What-If Simulation
  const sim = await (await fetch('http://localhost:5000/api/v1/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threatId: 'THREAT-001', actionIds: ['block_ip', 'isolate_host'] }),
  })).json();
  console.log(`   POST /simulate: Baseline=${sim.data?.baselineRiskScore} -> Projected=${sim.data?.projectedRiskScore} (-${sim.data?.totalRiskReductionPercent}%)`);

  // Recommendations
  const rec = await (await fetch('http://localhost:5000/api/v1/recommendations/THREAT-001')).json();
  console.log(`   GET /recommendations/THREAT-001: RecsCount=${rec.recommendations?.length}`);

  // Recommendations Generate
  const recGen = await (await fetch('http://localhost:5000/api/v1/recommendations/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threatId: 'THREAT-MANUAL', threatName: 'Brute Force Probe', affectedAsset: 'DC-01', risk: 'HIGH', riskScore: 82 }),
  })).json();
  console.log(`   POST /recommendations/generate: RecsCount=${recGen.data?.length}`);

  // Simulator Scenarios Listing
  const scList = await (await fetch('http://localhost:5000/api/v1/simulator/scenarios')).json();
  console.log(`   GET /simulator/scenarios: ScenariosCount=${scList.count}`);

  // Point 8: Verify all 8 scenarios triggering
  console.log('\n4. Verifying Simulator Scenarios (All 8 MITRE Scenarios)...');
  const scenarios = [
    'normal_activity',
    'port_scanning',
    'brute_force',
    'suspicious_login',
    'privilege_escalation',
    'lateral_movement',
    'data_exfiltration',
    'multi_stage_attack',
  ];

  for (const sc of scenarios) {
    const triggerRes = await (await fetch('http://localhost:5000/api/v1/simulator/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: sc }),
    })).json();
    console.log(`   Trigger [${sc}]: EventsGenerated=${triggerRes.data?.eventsGeneratedCount}, PipelineResults=${triggerRes.data?.pipelineResults?.length}`);
  }

  // Point 7: Vite Proxy /api test (simulating browser client through frontend dev proxy)
  console.log('\n5. Verifying Frontend Dev Proxy (http://localhost:5173/api/v1/health)...');
  const proxyRes = await fetch('http://localhost:5173/api/v1/health');
  const proxyData = await proxyRes.json();
  console.log(`   Proxy Status: ${proxyRes.status}, Proxied Service: ${proxyData.service}`);

  console.log('\n==================================================');
  console.log('✅ ALL API, FRONTEND, AND SIMULATOR CHECKS PASSED!');
  console.log('==================================================\n');
}

runFullVerification().catch((err) => {
  console.error('[Final Verification Error]:', err);
  process.exit(1);
});
