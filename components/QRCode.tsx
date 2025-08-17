
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

declare var QRCode: any;

interface QRCodeProps {
  value: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof QRCode === 'undefined') {
      console.error('QRCode library is not loaded.');
      if (errorRef.current) {
        errorRef.current.innerText = 'QR Code library failed to load.';
      }
      return;
    }

    if (canvasRef.current && errorRef.current) {
        // Clear previous state
        const context = canvasRef.current.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        errorRef.current.innerText = '';
        canvasRef.current.style.display = 'block';

        if (value) {
            QRCode.toCanvas(canvasRef.current, value, { width: 220, margin: 1 }, (error: any) => {
                if (error) {
                    console.error('QRCode error:', error);
                    if (canvasRef.current) {
                      canvasRef.current.style.display = 'none';
                    }
                    if (errorRef.current) {
                      errorRef.current.innerText = 'Could not generate QR code.';
                    }
                }
            });
        }
    }
  }, [value]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <div ref={errorRef} className="text-red-500 text-sm mt-2"></div>
    </div>
  );
};

export default QRCodeComponent;
