import React, { useState } from 'react';
import { MasterCoreData, SensorChannel, EvolutionaryStageId, ProbeData, AlphaTestState } from '../types/sensorMatrix';
import { buildTelemetryPayload, formatSamsungNotesMarkdown } from '../data/masterCoreData';
import { Download, Copy, Check, FileText, Code, Sparkles, RefreshCw, Smartphone } from 'lucide-react';

interface ExportTelemetryModuleProps {
  masterData: MasterCoreData;
  sensors: SensorChannel[];
  currentStage: EvolutionaryStageId;
  probe: ProbeData;
  alphaState: AlphaTestState;
  rsgSensitivity?: number;
}

export const ExportTelemetryModule: React.FC<ExportTelemetryModuleProps> = ({
  masterData,
  sensors,
  currentStage,
  probe,
  alphaState,
  rsgSensitivity = 100,
}) => {
  const [formatMode, setFormatMode] = useState<'markdown' | 'json'>('markdown');
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [snapshotTimestamp, setSnapshotTimestamp] = useState<string>(new Date().toISOString());

  // Generate current telemetry payload
  const payload = buildTelemetryPayload(currentStage, sensors, probe, alphaState, rsgSensitivity);
  // Inject fixed snapshot timestamp if manually captured
  payload.sessionTimestamp = snapshotTimestamp;

  const markdownContent = formatSamsungNotesMarkdown(payload);
  const jsonContent = JSON.stringify(payload, null, 2);

  const handleCaptureSnapshot = () => {
    setSnapshotTimestamp(new Date().toISOString());
  };

  const handleCopy = async () => {
    const textToCopy = formatMode === 'markdown' ? markdownContent : jsonContent;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2200);
    } catch {
      // Fallback
      setCopySuccess(false);
    }
  };

  const handleDownload = () => {
    const isMd = formatMode === 'markdown';
    const content = isMd ? markdownContent : jsonContent;
    const type = isMd ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8';
    const filename = isMd
      ? `OmniSci_SensorMatrix_SamsungNotes_${Date.now()}.md`
      : `OmniSci_SensorMatrix_Telemetry_${Date.now()}.json`;

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2200);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Telemetry Export Engine · {masterData.exportTelemetry.targetFormat}</span>
          </div>
          <h2 className="text-base font-semibold text-white mt-1">
            Structural Telemetry Export &amp; Session Logging
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCaptureSnapshot}
            className="px-3 py-1.5 text-xs font-mono rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Capture Run Snapshot</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-mono rounded border border-cyan-800/80 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Payload</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 text-xs font-mono rounded bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>File Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download {formatMode === 'markdown' ? '.md' : '.json'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Format Selector & Specification Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Target Output Format:</span>
          <div className="flex items-center rounded-md bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setFormatMode('markdown')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                formatMode === 'markdown'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Samsung Notes Mobile Markdown</span>
            </button>
            <button
              onClick={() => setFormatMode('json')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                formatMode === 'json'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Clean JSON String</span>
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Logging Interval: <span className="text-cyan-300">{masterData.exportTelemetry.loggingInterval}</span>
        </div>
      </div>

      {/* Fields Payload Specification Grid */}
      <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
        <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
          Master Telemetry Payload Schema Fields:
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {masterData.exportTelemetry.telemetryPayload.fields.map((field) => (
            <span
              key={field}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-cyan-300 border border-slate-800"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      {/* Code / Markdown Preview Area */}
      <div className="relative rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs font-mono text-slate-400">
          <span>
            {formatMode === 'markdown'
              ? 'Preview · Samsung Notes Compatible Mobile Markdown'
              : 'Preview · Clean RFC 8259 JSON String'}
          </span>
          <span className="tabular-nums text-slate-500">
            {formatMode === 'markdown' ? `${markdownContent.length} chars` : `${jsonContent.length} chars`}
          </span>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed selection:bg-cyan-500/30">
          {formatMode === 'markdown' ? markdownContent : jsonContent}
        </pre>
      </div>
    </div>
  );
};
