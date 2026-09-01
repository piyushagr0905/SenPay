const generateGraphData = (caseId) => {
  return {
    nodes: [
      { id: '1', position: { x: 0, y: 150 }, data: { label: 'Victim (User)' }, type: 'input', style: { background: '#f87171', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' } },
      { id: '2', position: { x: 250, y: 50 }, data: { label: 'Mule Account A' }, style: { background: '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' } },
      { id: '3', position: { x: 250, y: 250 }, data: { label: 'Mule Account B' }, style: { background: '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' } },
      { id: '4', position: { x: 500, y: 150 }, data: { label: 'Scammer Crypto Wallet' }, type: 'output', style: { background: '#334155', color: 'white', border: '2px solid #ef4444', borderRadius: '8px', padding: '10px' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ef4444' } },
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#ef4444' } },
      { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#64748b' } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#64748b' } },
    ]
  };
};

const getCaseDetails = (caseId) => {
  return {
    id: caseId,
    riskLevel: 'critical',
    amount: 75000,
    recipientName: 'Unknown',
    recommendation: 'Block transaction. High probability of mule network involvement.',
    evidence: ['Recipient wallet matches 3 previous fraud reports', 'Immediate cash-out pattern detected', 'Unusual velocity of funds'],
    timeline: [
      { time: '10:00 AM', event: 'Payment initiated' },
      { time: '10:00 AM', event: 'AI Risk Engine flagged pattern' },
      { time: '10:01 AM', event: 'Transaction paused for review' }
    ]
  };
};

module.exports = {
  generateGraphData,
  getCaseDetails
};
