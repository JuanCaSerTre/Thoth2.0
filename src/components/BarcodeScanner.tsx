import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (isbn: string) => void;
}

export default function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Clean up when dialog closes
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
        setIsScanning(false);
      }
    }
  }, [isOpen, isScanning]);

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setError('');
      
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!readerRef.current) {
        setError('Error: No se pudo inicializar el escáner');
        return;
      }

      // Initialize scanner only when starting
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerRef.current.id);
      }

      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 }
        },
        (decodedText) => {
          // ISBN codes are typically 10 or 13 digits
          const isbnMatch = decodedText.match(/\d{10,13}/);
          if (isbnMatch) {
            onScan(isbnMatch[0]);
            stopScanning();
            onClose();
          }
        },
        (errorMessage) => {
          // Ignore scanning errors (they happen constantly)
        }
      );
    } catch (err) {
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Escanear Código de Barras</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div 
            ref={readerRef}
            id="barcode-reader" 
            className="w-full rounded-lg overflow-hidden bg-gray-100"
            style={{ minHeight: isScanning ? '300px' : '100px' }}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Iniciar Escaneo
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Detener
              </Button>
            )}
            <Button onClick={handleClose} variant="outline">
              Cancelar
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Coloca el código de barras ISBN del libro frente a la cámara
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}