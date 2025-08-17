import React, { useEffect } from 'react';
import Modal from './Modal';
import XIcon from './icons/XIcon';

declare var Html5Qrcode: any;

interface ScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrcodeRegionId = "html5qr-code-full-region";

const Scanner: React.FC<ScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;
    const html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId, { verbose: false });

    const config = {
      fps: 10,
      qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const size = Math.floor(minEdge * 0.9);
        return {
          width: size,
          height: size
        };
      },
      aspectRatio: 1.0
    };

    const startScanner = async () => {
      try {
        if (!isMounted) return;

        await html5QrcodeScanner.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            if (isMounted) {
              onScanSuccess(decodedText);
            }
          },
          (errorMessage: string) => {
            // ignore
          }
        );
      } catch (err) {
        if (isMounted) {
          console.error("Error initializing scanner:", err);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner.stop().catch((err: any) => {
          console.error("Failed to stop scanner on cleanup", err);
        });
      }
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen={true}>
      <div className="bg-black w-full h-full relative">
        <div id={qrcodeRegionId} className="w-full h-full"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
            <div className="flex justify-end w-full">
                 <button
                    onClick={onClose}
                    className="text-white p-2 bg-black bg-opacity-50 rounded-full pointer-events-auto"
                    aria-label="Close scanner"
                 >
                    <XIcon />
                </button>
            </div>
            <div className="text-center text-white pb-8">
                <p className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">Point camera at a barcode or QR code</p>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default Scanner;