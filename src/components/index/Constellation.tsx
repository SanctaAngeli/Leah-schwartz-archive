// Index Constellation · a bubble-pack visualisation of Leah's back-of-book index.
// Three clusters (People · Places · Subjects), sized by mention count,
// connected by thin lines when entities share a book page.

import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pack, hierarchy, type HierarchyCircularNode } from 'd3-hierarchy';

interface Entity {
  id: string;
  name: string;
  display_name?: string;
  parenthetical?: string | null;
  book_pages?: number[];
}

interface NodeDatum {
  id: string;
  kind: 'person' | 'place' | 'subject';
  name: string;
  pages: number[];
  weight: number;
}

interface PackedNode extends NodeDatum {
  x: number;   // absolute svg coords
  y: number;
  r: number;
}

const KIND_COLOR: Record<NodeDatum['kind'], string> = {
  person:  '#A08070',   // warm terracotta
  place:   '#5A7AAA',   // cool blue
  subject: '#8B7355',   // base brown
};
const KIND_LABEL: Record<NodeDatum['kind'], string> = {
  person:  'People',
  place:   'Places',
  subject: 'Subjects',
};

interface ConstellationProps {
  people: Entity[];
  places: Entity[];
  subjects: Entity[];
}

export default function Constellation({ people, places, subjects }: ConstellationProps): JSX.Element {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1100);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Container size
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Convert entities into weighted nodes (by mention count + 1 to avoid zero)
  const nodeData = useMemo(() => {
    const toNode = (e: Entity, kind: NodeDatum['kind']): NodeDatum => ({
      id: e.id,
      kind,
      name: e.display_name || e.name,
      pages: e.book_pages || [],
      weight: Math.max(1, (e.book_pages || []).length),
    });
    return {
      person:  people.filter((p) => p.name && !p.name.startsWith('INDEX ')).map((e) => toNode(e, 'person')),
      place:   places.map((e) => toNode(e, 'place')),
      subject: subjects.map((e) => toNode(e, 'subject')),
    };
  }, [people, places, subjects]);

  // Pack each cluster independently, then stitch into one SVG
  const clusterHeight = 540;
  const clusterWidth = Math.max(300, Math.floor(width / 3) - 10);
  const gap = 20;

  const pack3 = useMemo(() => {
    const packer = (nodes: NodeDatum[]) => {
      const root = hierarchy({ children: nodes } as unknown as NodeDatum & { children: NodeDatum[] })
        .sum((d) => (d as unknown as NodeDatum).weight ?? 1)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
      return pack<NodeDatum>().size([clusterWidth, clusterHeight]).padding(4)(
        root as unknown as HierarchyCircularNode<NodeDatum>
      );
    };
    return {
      person:  packer(nodeData.person),
      place:   packer(nodeData.place),
      subject: packer(nodeData.subject),
    };
  }, [nodeData, clusterWidth]);

  const allNodes: PackedNode[] = useMemo(() => {
    const result: PackedNode[] = [];
    (['person', 'subject', 'place'] as const).forEach((kind, colIdx) => {
      const offsetX = colIdx * (clusterWidth + gap);
      const root = pack3[kind];
      root.descendants().forEach((n) => {
        // skip the artificial root
        if (!('data' in n) || !(n as HierarchyCircularNode<NodeDatum>).data?.id) return;
        const data = (n as HierarchyCircularNode<NodeDatum>).data;
        result.push({
          ...data,
          x: (n.x ?? 0) + offsetX,
          y: n.y ?? 0,
          r: n.r ?? 0,
        });
      });
    });
    return result;
  }, [pack3, clusterWidth]);

  const totalHeight = clusterHeight + 80;
  const totalWidth = clusterWidth * 3 + gap * 2;

  // Co-occurrence edges for the currently hovered node · share a book_page
  const hoverEdges = useMemo(() => {
    if (!hoverId) return [];
    const me = allNodes.find((n) => n.id === hoverId);
    if (!me) return [];
    const myPages = new Set(me.pages);
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number; targetId: string }> = [];
    for (const n of allNodes) {
      if (n.id === me.id) continue;
      if (n.pages.some((p) => myPages.has(p))) {
        edges.push({ x1: me.x, y1: me.y, x2: n.x, y2: n.y, targetId: n.id });
      }
    }
    return edges;
  }, [hoverId, allNodes]);

  const highlightedIds = useMemo(() => {
    const s = new Set<string>();
    if (hoverId) {
      s.add(hoverId);
      hoverEdges.forEach((e) => s.add(e.targetId));
    }
    return s;
  }, [hoverId, hoverEdges]);

  return (
    <div ref={wrapRef} className="w-full">
      <div className="grid grid-cols-3 gap-5 mb-3 text-center">
        {(['person', 'subject', 'place'] as const).map((kind) => (
          <div key={kind}>
            <p className="font-heading text-xl text-text-primary">
              {KIND_LABEL[kind]}
            </p>
            <p className="font-leah text-xl" style={{ color: KIND_COLOR[kind] }}>
              {nodeData[kind].length}
            </p>
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
      >
        {/* Edges (under circles) */}
        {hoverEdges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#8B7355"
            strokeWidth={0.8}
            strokeOpacity={0.35}
          />
        ))}

        {/* Circles */}
        {allNodes.map((n) => {
          const color = KIND_COLOR[n.kind];
          const isHover = hoverId === n.id;
          const isLinked = hoverId ? highlightedIds.has(n.id) : true;
          const opacity = hoverId ? (isLinked ? 0.95 : 0.18) : 0.8;
          return (
            <g
              key={`${n.kind}-${n.id}`}
              transform={`translate(${n.x}, ${n.y})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => navigate(
                n.kind === 'person' ? `/people/${n.id}` :
                n.kind === 'place'  ? `/places/${n.id}` :
                                      `/subjects/${n.id}`
              )}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(
                    n.kind === 'person' ? `/people/${n.id}` :
                    n.kind === 'place'  ? `/places/${n.id}` :
                                          `/subjects/${n.id}`
                  );
                }
              }}
            >
              <circle
                r={n.r}
                fill={color}
                fillOpacity={opacity}
                stroke={isHover ? '#111' : '#fff'}
                strokeWidth={isHover ? 2 : 1}
              />
              {/* Label if circle is large enough, OR if hovered */}
              {(n.r > 22 || isHover) && (
                <text
                  y={4}
                  textAnchor="middle"
                  className="font-body select-none pointer-events-none"
                  fontSize={Math.max(9, Math.min(12, n.r / 3))}
                  fill="#fff"
                  style={{ paintOrder: 'stroke', stroke: '#00000066', strokeWidth: 2, strokeLinejoin: 'round' }}
                >
                  {n.name.length > 18 ? n.name.slice(0, 16) + '…' : n.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover detail */}
      <div className="mt-4 min-h-[60px] text-center">
        {hoverId ? (() => {
          const me = allNodes.find((n) => n.id === hoverId);
          if (!me) return null;
          return (
            <div>
              <p className="font-heading text-xl text-text-primary">
                {me.name}
              </p>
              <p className="font-body text-text-muted text-xs mt-1">
                {KIND_LABEL[me.kind].slice(0, -1)}
                {' · '}
                {me.pages.length} {me.pages.length === 1 ? 'mention' : 'mentions'} on book {me.pages.length === 1 ? 'page' : 'pages'} {me.pages.slice(0, 8).join(', ')}
                {me.pages.length > 8 && ', …'}
              </p>
            </div>
          );
        })() : (
          <p className="font-body text-text-muted italic text-sm">
            Hover to see connections. Click any circle to open its page.
          </p>
        )}
      </div>
    </div>
  );
}
