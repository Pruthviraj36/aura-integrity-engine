import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, MapPin, Shield, Clock, CheckCircle2, Wifi, Fingerprint } from "lucide-react";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">QR Scanner</h1>
        <p className="text-sm text-muted-foreground">Scan the session QR code to mark your attendance</p>
      </div>

      {/* Scanner Viewfinder */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-secondary/30 aspect-square max-h-80 flex items-center justify-center">
            <div className="relative w-52 h-52">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br" />
              
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary animate-pulse" />
                </div>
              )}

              {scanned && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="h-16 w-16 text-success" />
                </div>
              )}

              {!scanning && !scanned && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action */}
      <div className="text-center">
        {!scanned ? (
          <Button onClick={handleScan} disabled={scanning} size="lg" className="glow-cyan px-8">
            <ScanLine className="mr-2 h-5 w-5" />
            {scanning ? "Scanning..." : "Scan QR Code"}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-success font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Attendance Marked Successfully
            </p>
            <p className="text-xs text-muted-foreground">CS301 — Binary Search Trees • 09:02 AM</p>
            <Button variant="outline" size="sm" onClick={() => setScanned(false)}>Scan Another</Button>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-success/15 p-2"><MapPin className="h-4 w-4 text-success" /></div>
            <div>
              <p className="text-xs font-medium">Geofence</p>
              <p className="text-[10px] text-success">In Range — LH-201</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-success/15 p-2"><Wifi className="h-4 w-4 text-success" /></div>
            <div>
              <p className="text-xs font-medium">Network</p>
              <p className="text-[10px] text-success">NIT-Campus WiFi</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-success/15 p-2"><Fingerprint className="h-4 w-4 text-success" /></div>
            <div>
              <p className="text-xs font-medium">Device</p>
              <p className="text-[10px] text-success">Verified • DEV-A1B2C3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grace Period */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-warning" />
          <div>
            <p className="text-sm font-medium">Grace Period Active</p>
            <p className="text-xs text-muted-foreground">7:23 remaining — after 10 min you'll be marked "Late"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
