import React, { useEffect, useRef } from 'react';

declare var JsBarcode: any;

interface BarcodeProps {
  value: string;
}

const Barcode: React.FC<BarcodeProps> = ({ value }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !errorRef.current) {
      return;
    }

    // Clear previous state
    svgRef.current.innerHTML = '';
    errorRef.current.innerText = '';
    svgRef.current.style.display = 'block';

    if (value) {
        try {
            JsBarcode(svgRef.current, value, {
                format: "CODE128",
                displayValue: false,
                margin: 10,
                width: 2,
                height: 100,
                background: '#ffffff',
            });
        } catch (e: unknown) {
            console.error('JsBarcode error:', e);
            if (svgRef.current) {
              svgRef.current.style.display = 'none';
            }
            let errorMessage = "Invalid barcode data.";
            if (e instanceof Error && e.message?.includes('not a valid input')) {
                errorMessage = "This value cannot be encoded as a barcode. It may contain unsupported characters.";
            }
            if (errorRef.current) {
              errorRef.current.innerText = errorMessage;
            }
        }
    }
  }, [value]);

  return (
    <div>
        <svg ref={svgRef} className="max-w-full"></svg>
        <div ref={errorRef} className="text-red-500 text-sm mt-2"></div>
    </div>
  );
};

export default Barcode;
