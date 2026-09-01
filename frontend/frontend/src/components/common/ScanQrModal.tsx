import React, { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import QrScanner from 'qr-scanner';
import { ShieldCheck, Camera, ImageIcon, Globe2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';
import { UserProfile } from '../../types';

interface ScanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (qrData: { recipientUpi: string; name: string; amount?: number; purpose?: string; rawString?: string; currency?: string; exchangeRate?: number; foreignAmount?: number }) => void;
  user?: UserProfile | null;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  user,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const processQrText = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      if (url.protocol.toLowerCase() === 'upi:') {
        const pa = url.searchParams.get('pa') || 'unknown@upi';
        const pn = url.searchParams.get('pn') || 'Unknown Recipient';
        const am = url.searchParams.get('am');
        const tn = url.searchParams.get('tn') || '';
        
        onScanComplete({
          recipientUpi: pa,
          name: pn,
          amount: am ? parseFloat(am) : undefined,
          purpose: tn,
          rawString: decodedText
        });
        onClose();
      } else {
        onScanComplete({
          recipientUpi: 'Unknown',
          name: 'External QR Link',
          purpose: 'Scanned URL',
          rawString: decodedText
        });
        onClose();
      }
    } catch(e) {
      onScanComplete({
        recipientUpi: 'Unknown',
        name: 'Unknown Text QR',
        purpose: 'Raw text data',
        rawString: decodedText
      });
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    setErrorMsg('');

    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        haptics.success();
        qrScanner.stop();
        processQrText(result.data);
      },
      { 
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner.start().catch((e) => {
      console.error(e);
      setErrorMsg('Camera access denied or unavailable. Please upload an image instead.');
    });

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [isOpen, onClose]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    haptics.light();

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then(result => {
        haptics.success();
        processQrText(result.data);
      })
      .catch(e => {
        console.error(e);
        setErrorMsg('Could not find a valid QR code in this image. Try a clearer screenshot.');
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { haptics.light(); onClose(); }}
      title="Scan to Pay Safely"
      subtitle="Point your camera at any QR code or upload an image"
      maxWidth="md"
    >
      <div className="space-y-4 font-apple">
        {/* Camera Viewfinder */}
        <div className="relative w-full h-72 bg-black rounded-[20px] overflow-hidden border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover"></video>
          {errorMsg && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center z-10 flex-col">
              <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
              <p className="text-white/70 text-sm">Align QR code within the frame to pay</p>
              
              {user?.globalModeEnabled && (
                <div className="mt-4 inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-md px-4 py-2 rounded-full border border-blue-400/50">
                  <Globe2 className="w-4 h-4 text-blue-300" />
                  <span className="text-xs font-bold text-blue-100 tracking-wide uppercase">Global Mode Active</span>
                </div>
              )}
            </div>
          )}
          
          {/* Aiming Reticle visual overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="w-48 h-48 border-2 border-white/40 rounded-[20px] relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-[20px]" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-[20px]" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-[20px]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-[20px]" />
            </div>
          </div>
        </div>
        
        {/* Upload Fallback */}
        <div className="flex gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
        </div>
            
            <div className="mt-6 flex flex-col gap-3">
              {user?.globalModeEnabled && (
                <button
                  onClick={() => {
                    haptics.success();
                    // Simulate Singapore QR scan
                    onScanComplete({
                      recipientUpi: 'merchant@dbs.sg',
                      name: 'Starbucks Marina Bay (Singapore)',
                      amount: 600, // 600 INR
                      foreignAmount: 10, // 10 SGD
                      currency: 'SGD',
                      exchangeRate: 60.00,
                      purpose: 'Coffee',
                      rawString: 'upi://pay?pa=merchant@dbs.sg&pn=Starbucks Marina Bay&am=10&cu=SGD'
                    });
                    onClose();
                  }}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-transform flex justify-center items-center gap-2 shadow-md"
                >
                  <Globe2 className="w-5 h-5" />
                  Simulate Foreign QR (Singapore)
                </button>
              )}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-ink-primary font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                Upload QR Image
              </button>
            </div>

        <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-sentinel-success bg-green-50 py-3 rounded-xl border border-green-100 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          SENTINEL Active: Validating QR Payloads automatically
        </div>
      </div>
    </Modal>
  );
};
