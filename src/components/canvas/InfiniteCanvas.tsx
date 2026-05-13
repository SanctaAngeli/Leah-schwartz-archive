import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Artwork } from '../../types';
import type { CanvasLayout } from '../../utils/canvasLayout';

interface InfiniteCanvasProps {
  artworks: Artwork[];
  layout: CanvasLayout;
  onArtworkClick: (artworkId: string) => void;
}

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.0;
const INITIAL_ZOOM = 0.5;
const CLICK_THRESHOLD_PX = 6;
const MOMENTUM_DECAY = 0.92;
const MOMENTUM_STOP = 0.05;
const WHEEL_ZOOM_INTENSITY = 0.0015;
const WHEEL_PAN_INTENSITY = 1;

function InfiniteCanvas({ artworks, layout, onArtworkClick }: InfiniteCanvasProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [camera, setCamera] = useState<Camera>(() => ({
    x: layout.tileWidth / 2,
    y: layout.tileHeight / 2,
    zoom: INITIAL_ZOOM,
  }));

  const artworkById = useMemo(() => {
    const map = new Map<string, Artwork>();
    for (const a of artworks) map.set(a.id, a);
    return map;
  }, [artworks]);

  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startScreenX: number;
    startScreenY: number;
    startCameraX: number;
    startCameraY: number;
    lastX: number;
    lastY: number;
    lastT: number;
    vx: number;
    vy: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startScreenX: 0,
    startScreenY: 0,
    startCameraX: 0,
    startCameraY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    vx: 0,
    vy: 0,
    moved: false,
  });

  const momentumRaf = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = (): void => {
      const rect = el.getBoundingClientRect();
      setViewport({ w: rect.width, h: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stopMomentum = useCallback((): void => {
    if (momentumRaf.current !== null) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
  }, []);

  const runMomentum = useCallback((): void => {
    const tick = (): void => {
      const d = dragRef.current;
      if (Math.abs(d.vx) < MOMENTUM_STOP && Math.abs(d.vy) < MOMENTUM_STOP) {
        momentumRaf.current = null;
        return;
      }
      setCamera((c) => ({
        x: c.x - d.vx / c.zoom,
        y: c.y - d.vy / c.zoom,
        zoom: c.zoom,
      }));
      d.vx *= MOMENTUM_DECAY;
      d.vy *= MOMENTUM_DECAY;
      momentumRaf.current = requestAnimationFrame(tick);
    };
    momentumRaf.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    stopMomentum();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const d = dragRef.current;
    d.active = true;
    d.pointerId = e.pointerId;
    d.startScreenX = e.clientX;
    d.startScreenY = e.clientY;
    d.startCameraX = camera.x;
    d.startCameraY = camera.y;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = performance.now();
    d.vx = 0;
    d.vy = 0;
    d.moved = false;
  }, [camera.x, camera.y, stopMomentum]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    const d = dragRef.current;
    if (!d.active || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startScreenX;
    const dy = e.clientY - d.startScreenY;
    if (!d.moved && Math.hypot(dx, dy) > CLICK_THRESHOLD_PX) d.moved = true;

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vx = (e.clientX - d.lastX) / dt * 16;
    d.vy = (e.clientY - d.lastY) / dt * 16;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = now;

    setCamera((c) => ({
      x: d.startCameraX - dx / c.zoom,
      y: d.startCameraY - dy / c.zoom,
      zoom: c.zoom,
    }));
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    const d = dragRef.current;
    if (!d.active || d.pointerId !== e.pointerId) return;
    d.active = false;
    d.pointerId = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released — fine
    }
    if (d.moved && (Math.abs(d.vx) > MOMENTUM_STOP || Math.abs(d.vy) > MOMENTUM_STOP)) {
      runMomentum();
    }
  }, [runMomentum]);

  const handleWheel = useCallback((e: WheelEvent): void => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      stopMomentum();
      setCamera((c) => {
        const factor = Math.exp(-e.deltaY * WHEEL_ZOOM_INTENSITY * 6);
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, c.zoom * factor));
        const worldXBefore = c.x + (cursorX - rect.width / 2) / c.zoom;
        const worldYBefore = c.y + (cursorY - rect.height / 2) / c.zoom;
        const newX = worldXBefore - (cursorX - rect.width / 2) / newZoom;
        const newY = worldYBefore - (cursorY - rect.height / 2) / newZoom;
        return { x: newX, y: newY, zoom: newZoom };
      });
    } else {
      stopMomentum();
      setCamera((c) => ({
        x: c.x + (e.deltaX * WHEEL_PAN_INTENSITY) / c.zoom,
        y: c.y + (e.deltaY * WHEEL_PAN_INTENSITY) / c.zoom,
        zoom: c.zoom,
      }));
    }
  }, [stopMomentum]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel as EventListener);
  }, [handleWheel]);

  const visibleNodes = useMemo(() => {
    if (viewport.w === 0 || viewport.h === 0) return [];
    const { x: cx, y: cy, zoom } = camera;
    const halfW = viewport.w / 2 / zoom;
    const halfH = viewport.h / 2 / zoom;
    const vxMin = cx - halfW;
    const vxMax = cx + halfW;
    const vyMin = cy - halfH;
    const vyMax = cy + halfH;

    const { tileWidth: TW, tileHeight: TH } = layout;
    const txMin = Math.floor((vxMin - TW) / TW);
    const txMax = Math.ceil((vxMax + TW) / TW);
    const tyMin = Math.floor((vyMin - TH) / TH);
    const tyMax = Math.ceil((vyMax + TH) / TH);

    const nodes: Array<{
      key: string;
      artworkId: string;
      screenX: number;
      screenY: number;
      width: number;
      height: number;
      rotation: number;
      tx: number;
      ty: number;
    }> = [];

    const cssCenterX = viewport.w / 2;
    const cssCenterY = viewport.h / 2;

    for (let tx = txMin; tx <= txMax; tx++) {
      for (let ty = tyMin; ty <= tyMax; ty++) {
        const dx = tx * TW;
        const dy = ty * TH;
        for (const item of layout.items) {
          const wx = item.x + dx;
          const wy = item.y + dy;
          if (wx + item.w < vxMin || wx > vxMax || wy + item.h < vyMin || wy > vyMax) continue;
          const sx = (wx - cx) * zoom + cssCenterX;
          const sy = (wy - cy) * zoom + cssCenterY;
          nodes.push({
            key: `${item.artworkId}@${tx},${ty}`,
            artworkId: item.artworkId,
            screenX: sx,
            screenY: sy,
            width: item.w * zoom,
            height: item.h * zoom,
            rotation: item.rotation,
            tx,
            ty,
          });
        }
      }
    }
    return nodes;
  }, [camera, viewport, layout]);

  const handleNodeClick = useCallback((artworkId: string): void => {
    if (dragRef.current.moved) return;
    onArtworkClick(artworkId);
  }, [onArtworkClick]);

  const handleZoomButton = useCallback((delta: number): void => {
    stopMomentum();
    setCamera((c) => {
      const factor = Math.exp(delta);
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, c.zoom * factor));
      return { x: c.x, y: c.y, zoom: newZoom };
    });
  }, [stopMomentum]);

  const handleRecenter = useCallback((): void => {
    stopMomentum();
    setCamera({ x: layout.tileWidth / 2, y: layout.tileHeight / 2, zoom: INITIAL_ZOOM });
  }, [layout.tileHeight, layout.tileWidth, stopMomentum]);

  useEffect(() => () => stopMomentum(), [stopMomentum]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none touch-none bg-bg-gallery"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: dragRef.current.active ? 'grabbing' : 'grab' }}
      role="application"
      aria-label="Draggable canvas of Leah Schwartz's artworks. Drag to pan, scroll to zoom."
    >
      {visibleNodes.map((node) => {
        const artwork = artworkById.get(node.artworkId);
        if (!artwork) return null;
        const src = artwork.thumbPath || artwork.imagePath;
        return (
          <button
            key={node.key}
            type="button"
            className="absolute top-0 left-0 group focus:outline-none"
            style={{
              transform: `translate3d(${node.screenX}px, ${node.screenY}px, 0) rotate(${node.rotation}deg)`,
              width: node.width,
              height: node.height,
              willChange: 'transform',
            }}
            onClick={() => handleNodeClick(node.artworkId)}
            aria-label={`${artwork.display_title || artwork.title}${artwork.year ? `, ${artwork.year}` : ''}. Open detail.`}
            tabIndex={node.tx === 0 && node.ty === 0 ? 0 : -1}
          >
            {src ? (
              <img
                src={src}
                alt=""
                draggable={false}
                loading="lazy"
                className="w-full h-full object-cover shadow-[0_4px_18px_rgba(0,0,0,0.10)] transition-shadow duration-300 group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.20)] group-focus-visible:ring-2 group-focus-visible:ring-text-primary/60"
                style={{ pointerEvents: 'none' }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: artwork.placeholderColor }}
              />
            )}
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 whitespace-nowrap"
              aria-hidden="true"
            >
              <div className="font-heading italic text-text-primary text-sm bg-white/85 backdrop-blur-md px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                {artwork.display_title || artwork.title}
                {artwork.year ? <span className="text-text-muted not-italic"> · {artwork.year}</span> : null}
              </div>
            </div>
          </button>
        );
      })}

      {/* HUD: zoom controls + recenter */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button
          type="button"
          onClick={() => handleZoomButton(0.25)}
          className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.08)] text-text-primary text-lg flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleZoomButton(-0.25)}
          className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.08)] text-text-primary text-lg flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.08)] text-text-primary text-xs flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Recenter canvas"
          title="Recenter"
        >
          ⊙
        </button>
      </div>

      {/* Hint, fades out after interaction */}
      <CanvasHint />
    </div>
  );
}

function CanvasHint(): JSX.Element | null {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const hide = (): void => setVisible(false);
    window.addEventListener('pointerdown', hide, { once: true });
    window.addEventListener('wheel', hide, { once: true });
    const t = window.setTimeout(hide, 5000);
    return () => {
      window.removeEventListener('pointerdown', hide);
      window.removeEventListener('wheel', hide);
      window.clearTimeout(t);
    };
  }, []);
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10
        font-body text-xs text-text-muted bg-white/80 backdrop-blur-md
        px-4 py-2 rounded-full border border-white/40 shadow-[0_4px_18px_rgba(0,0,0,0.06)]
        transition-opacity duration-500"
    >
      Drag to drift · Pinch or ⌘+scroll to zoom · Click any piece
    </div>
  );
}

export default InfiniteCanvas;
