import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Activity, AlertTriangle, Crosshair, Network, FileText } from 'lucide-react';
import { GraphPanel } from '../components/common/GraphPanel';
import { PaymentTransaction } from '../types';
import { haptics } from '../utils/haptics';

interface BusinessCaseDetailsScreenProps {
  caseId: string;
  onBack: () => void;
}

export const BusinessCaseDetailsScreen: React.FC<BusinessCaseDetailsScreenProps> = ({ caseId, onBack }) => {
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const detailsRes = await fetch(`http://localhost:5000/api/business/cases/${caseId}`);
        const mockDetails = await detailsRes.json();

        const graphRes = await fetch(`http://localhost:5000/api/business/graph/${caseId}`);
        const mockGraphData = await graphRes.json();

        setCaseDetails(mockDetails);
        setGraphData(mockGraphData);
      } catch (error) {
        console.error('Error fetching case details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDetails();
  }, [caseId]);

  if (loading || !caseDetails) {
    return (
      <div className="flex flex-col h-screen bg-[#0A0F1C] items-center justify-center font-apple">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <div className="text-slate-400 text-[13px]">Decrypting case dossier...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0F1C] text-slate-300 font-apple max-w-md mx-auto relative overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-rose-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10 sticky top-0 bg-[#0A0F1C]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptics.light(); onBack(); }} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-[17px] text-white tracking-tight flex items-center gap-2">
              Case #{caseId.substring(0,6).toUpperCase()}
              {caseDetails.riskLevel === 'critical' && <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">Critical</span>}
            </h1>
            <p className="text-[10px] text-rose-200/60 font-bold tracking-widest uppercase">AI Incident Brief</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4 pb-20">
        
        {/* Summary Card */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attempted Transfer</p>
              <p className="text-[28px] font-bold text-white leading-none">₹{caseDetails.amount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[11px] font-bold text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> AI Recommendation
            </p>
            <p className="text-[14px] text-slate-300 leading-relaxed">{caseDetails.recommendation}</p>
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-slate-500" /> Follow the Money
          </h3>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0A0F1C]">
            <GraphPanel graphData={graphData} />
          </div>
        </div>

        {/* Evidence */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" /> Key Evidence
          </h3>
          <ul className="space-y-3">
            {caseDetails.evidence.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-[14px] text-slate-300 leading-relaxed">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-5">Event Timeline</h3>
          <div className="space-y-5 pl-2.5 border-l border-white/10 ml-2">
            {caseDetails.timeline.map((event: any, idx: number) => (
              <div key={idx} className="relative pl-5">
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#0A0F1C] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">{event.time}</p>
                <p className="text-[14px] text-slate-300">{event.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
