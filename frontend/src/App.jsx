import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import axios from 'axios';
import { 
  FileText, 
  Activity, 
  Database, 
  Brain, 
  FlaskConical, 
  Search,
  Info,
  Box,
  Monitor,
  Maximize2,
  RefreshCw,
  X,
  Filter,
  BarChart3,
  BookOpen
} from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

const NODE_COLORS = {
  'Paper': '#3b82f6',      // Blue
  'Method': '#10b981',     // Green
  'Result': '#f59e0b',     // Amber
  'Disease': '#ef4444',    // Red
  'BrainRegion': '#8b5cf6' // Purple
};

const StatCard = (props) => {
  const IconComponent = props.icon;
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex items-center space-x-4 hover:bg-slate-800/60 transition-all cursor-default group">
      <div className={`p-3 rounded-xl ${props.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
        <IconComponent className={props.color.replace('bg-', 'text-')} size={20} />
      </div>
      <div>
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{props.label}</div>
        <div className="text-xl font-bold text-white leading-none mt-1">{props.value?.toLocaleString() || 0}</div>
      </div>
    </div>
  );
};

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [stats, setStats] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypes, setFilterTypes] = useState(Object.keys(NODE_COLORS));
  const [is3D, setIs3D] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const fgRef = useRef();
  const containerRef = useRef();
  const searchInputRef = useRef(null);

  // Zoom to fit on initial load
  useEffect(() => {
    if (!loading && displayData.nodes.length > 0 && fgRef.current) {
      // Small delay to ensure the engine has started
      const timeout = setTimeout(() => {
        if (is3D) {
          fgRef.current.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 1000);
        } else {
          fgRef.current.zoomToFit(800, 80);
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading, is3D]);

  // Handle window resize via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [graphRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/graph`),
          axios.get(`${API_BASE}/stats`)
        ]);
        setGraphData(graphRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Keyboard shortcut for search
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered graph data
  const displayData = useMemo(() => {
    const nodes = graphData.nodes.filter(n => {
      const title = n.properties.title || n.properties.name || n.id;
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterTypes.includes(n.label);
      return matchesSearch && matchesType;
    });

    const nodeIds = new Set(nodes.map(n => n.id));
    const links = graphData.links.filter(l => {
      const sourceId = l.source && typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = l.target && typeof l.target === 'object' ? l.target.id : l.target;
      return sourceId && targetId && nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    // Apply specific logic for search highlighting
    const finalNodes = nodes.map(n => {
      const title = n.properties.title || n.properties.name || n.id;
      const isSearchResult = searchTerm && title.toLowerCase().includes(searchTerm.toLowerCase());
      return {
        ...n,
        _isHighlighted: isSearchResult
      };
    });

    return { nodes: finalNodes, links };
  }, [graphData, searchTerm, filterTypes]);

  // Handle graph click to deselect
  const onBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
    
    // Zoom/pan with a slight offset if 2D to keep panel visible
    if (is3D) {
      const distance = 160;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1200
      );
    } else {
      // Offset by -100px to keep node visible when sidebar is open
      fgRef.current.centerAt(node.x + 40, node.y, 1000);
      fgRef.current.zoom(4, 1000);
    }
  }, [is3D]);

  const resetCamera = () => {
    if (is3D) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 1500);
    } else {
      fgRef.current.zoomToFit(1000, 50);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden font-sans text-slate-200">
      {/* Sidebar */}
      <aside className="w-[400px] min-w-[400px] flex-shrink-0 flex flex-col border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-2xl z-20 overflow-hidden">
        {/* Logo & Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight uppercase leading-none">PaperPath</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Research Nexus v1.0</p>
            </div>
          </div>
          <button 
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-all ${showStats ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            <BarChart3 size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                <Filter size={12} className="mr-1" /> Filters
              </label>
              <button 
                onClick={() => setFilterTypes(Object.keys(NODE_COLORS))}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(NODE_COLORS).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterTypes(prev => 
                      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center ${
                    filterTypes.includes(type) 
                      ? 'bg-slate-800 border-slate-700 text-white shadow-lg' 
                      : 'bg-transparent border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: NODE_COLORS[type] }} />
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          {showStats && (
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-slate-800/20 border border-slate-800/50 p-4 rounded-2xl animate-pulse h-[72px]" />
                  ))}
                </>
              ) : (
                <>
                  <StatCard icon={FileText} label="Papers" value={stats?.papers} color="bg-blue-500" />
                  <StatCard icon={FlaskConical} label="Methods" value={stats?.methods} color="bg-emerald-500" />
                  <StatCard icon={Activity} label="Results" value={stats?.results} color="bg-amber-500" />
                  <StatCard icon={Database} label="Regions" value={stats?.regions} color="bg-purple-500" />
                  <StatCard icon={Activity} label="Diseases" value={stats?.diseases} color="bg-red-500" />
                </>
              )}
            </div>
          )}

          {/* Selection Details */}
          <div className="space-y-4 pt-2">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center px-1">
              <Info size={12} className="mr-2" />
              {selectedNode ? 'Active Entity Details' : 'Knowledge Exploration'}
            </h2>
            
            {selectedNode ? (
              <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 space-y-6 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest"
                          style={{ 
                            backgroundColor: `${NODE_COLORS[selectedNode.label] || '#94a3b8'}22`, 
                            color: NODE_COLORS[selectedNode.label] || '#94a3b8' 
                          }}>
                      {selectedNode.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-3 leading-tight tracking-tight">
                    {selectedNode.properties.title || selectedNode.properties.name || (selectedNode.label === 'Result' ? selectedNode.properties.text : null) || selectedNode.id}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {selectedNode.label === 'Paper' && selectedNode.properties.citations && (
                    <div className="space-y-3">
                      <div className="text-[10px] text-indigo-400 uppercase font-black tracking-widest flex items-center">
                        <BookOpen size={12} className="mr-2" />
                        Extracted Citations
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.properties.citations.map((cite, i) => (
                          <span key={i} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-1.5 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {Object.entries(selectedNode.properties).map(([key, val]) => (
                      !['title', 'name', 'summary', 'citations', 'id', 'label', 'type'].includes(key.toLowerCase()) && val !== null && val !== undefined && (
                        <div key={key} className="group/item">
                          <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] flex items-center mb-1.5 px-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-500/40 mr-2 group-hover/item:bg-indigo-500 transition-colors" />
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-900/40 rounded-xl p-3 border border-slate-800/50 hover:border-slate-700/80 transition-all">
                            {Array.isArray(val) ? (
                              <div className="flex flex-wrap gap-1.5">
                                {val.map((item, idx) => (
                                  <span key={idx} className="bg-slate-800/50 text-indigo-200 px-2 py-0.5 rounded-md text-[11px] border border-slate-700/30">
                                    {String(item)}
                                  </span>
                                ))}
                              </div>
                            ) : typeof val === 'object' ? (
                              <pre className="text-[11px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap custom-scrollbar max-h-40">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            ) : (
                              String(val).length > 800 ? String(val).substring(0, 800) + '...' : String(val)
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 space-y-5 bg-slate-900/30 p-6 rounded-2xl border border-dashed border-slate-800">
                <p className="font-medium leading-relaxed">Welcome to the Knowledge Graph Explorer. Select any node in the interactive view to reveal its underlying scientific data.</p>
                <div className="space-y-3">
                  {[
                    "Click nodes to inspect data",
                    "Scroll to zoom in/out",
                    "Toggle 3D for spatial analysis",
                    "Filter by type to isolate data"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs">
                      <div className="w-1 h-1 rounded-full bg-indigo-500" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="p-6 border-t border-slate-800/60 bg-slate-950/20">
          <div className="bg-slate-900/50 rounded-2xl p-1 flex items-center relative">
            <button 
              onClick={() => setIs3D(false)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${!is3D ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Monitor size={14} />
              <span>2D VIEW</span>
            </button>
            <button 
              onClick={() => setIs3D(true)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${is3D ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Box size={14} />
              <span>3D VIEW</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={containerRef} className="flex-1 relative bg-[#020617] group">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-50">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" size={32} />
            </div>
            <p className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Synthesizing Knowledge...</p>
          </div>
        ) : (
          <>
            {/* Search Bar Overlay */}
            <div className="absolute top-6 left-6 z-30 w-80 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-1 shadow-2xl">
                  <div className="pl-3 text-slate-500">
                    <Search size={18} />
                  </div>
                  <input
                     ref={searchInputRef}
                     type="text"
                     placeholder="Search the knowledge graph..."
                     className="flex-1 bg-transparent border-none py-2.5 px-3 text-sm focus:outline-none text-white placeholder-slate-500"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                  {searchTerm ? (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-2 text-slate-500 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  ) : (
                    <div className="p-2 px-3">
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-800 border border-slate-700 rounded shadow-sm">/</kbd>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Graph Controls */}
            <div className="absolute top-6 right-6 z-30 flex flex-col space-y-2">
              <button 
                onClick={resetCamera}
                title="Reset Camera"
                className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl flex items-center justify-center transition-all shadow-xl"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                title="Toggle Fullscreen"
                onClick={() => document.documentElement.requestFullscreen()}
                className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl flex items-center justify-center transition-all shadow-xl"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {/* Force Graph */}
            {is3D ? (
              <ForceGraph3D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={displayData}
                nodeLabel={node => {
                  const title = node.properties.title || node.properties.name || (node.label === 'Result' ? node.properties.text : null) || node.id;
                  const truncatedTitle = title.length > 100 ? title.substring(0, 100) + '...' : title;
                  const color = NODE_COLORS[node.label] || '#94a3b8';
                  return `
                    <div class="px-3 py-2 bg-slate-900/95 border border-slate-700/50 rounded-xl shadow-2xl backdrop-blur-md max-w-xs">
                      <div class="flex items-center space-x-2 mb-1">
                        <div class="w-2 h-2 rounded-full" style="background-color: ${color}"></div>
                        <span class="text-[9px] font-black uppercase tracking-widest text-slate-500">${node.label}</span>
                      </div>
                      <div class="text-sm font-bold text-white">${truncatedTitle}</div>
                      ${node.properties.citations ? `<div class="mt-1 text-[10px] text-indigo-400 font-medium">${node.properties.citations.length} Citations</div>` : ''}
                    </div>
                  `;
                }}
                nodeColor={node => {
                  if (selectedNode && selectedNode.id === node.id) return '#ffffff';
                  if (node._isHighlighted) return '#6366f1'; // Indigo for search hits
                  return NODE_COLORS[node.label] || '#94a3b8';
                }}
                nodeVal={node => {
                  if (selectedNode && selectedNode.id === node.id) return 15;
                  if (node._isHighlighted) return 12;
                  return node.label === 'Paper' ? 8 : 4;
                }}
                nodeResolution={32}
                linkColor={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) 
                      ? 'rgba(99, 102, 241, 0.6)' 
                      : 'rgba(255, 255, 255, 0.02)';
                  }
                  return 'rgba(255, 255, 255, 0.08)';
                }}
                linkWidth={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 2 : 0.5;
                  }
                  return 0.5;
                }}
                linkOpacity={0.2}
                linkDirectionalParticles={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 4 : 0;
                  }
                  return 2;
                }}
                linkDirectionalParticleSpeed={0.005}
                onNodeClick={handleNodeClick}
                onBackgroundClick={onBackgroundClick}
                backgroundColor="#020617"
                showNavInfo={false}
              />
            ) : (
              <ForceGraph2D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={displayData}
                nodeLabel={node => {
                  const title = node.properties.title || node.properties.name || (node.label === 'Result' ? node.properties.text : null) || node.id;
                  const truncatedTitle = title.length > 100 ? title.substring(0, 100) + '...' : title;
                  const color = NODE_COLORS[node.label] || '#94a3b8';
                  return `
                    <div class="px-3 py-2 bg-slate-900/95 border border-slate-700/50 rounded-xl shadow-2xl backdrop-blur-md max-w-xs">
                      <div class="flex items-center space-x-2 mb-1">
                        <div class="w-2 h-2 rounded-full" style="background-color: ${color}"></div>
                        <span class="text-[9px] font-black uppercase tracking-widest text-slate-500">${node.label}</span>
                      </div>
                      <div class="text-sm font-bold text-white">${truncatedTitle}</div>
                      ${node.properties.citations ? `<div class="mt-1 text-[10px] text-indigo-400 font-medium">${node.properties.citations.length} Citations</div>` : ''}
                    </div>
                  `;
                }}
                nodeColor={node => {
                  if (selectedNode && selectedNode.id === node.id) return '#ffffff';
                  if (node._isHighlighted) return '#6366f1'; // Indigo for search hits
                  return NODE_COLORS[node.label] || '#94a3b8';
                }}
                nodeVal={node => {
                  if (selectedNode && selectedNode.id === node.id) return 15;
                  if (node._isHighlighted) return 12;
                  return node.label === 'Paper' ? 8 : 4;
                }}
                linkColor={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) 
                      ? 'rgba(99, 102, 241, 0.6)' 
                      : 'rgba(255, 255, 255, 0.02)';
                  }
                  return 'rgba(255, 255, 255, 0.08)';
                }}
                linkWidth={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 3 : 1;
                  }
                  return 1;
                }}
                linkOpacity={0.2}
                linkDirectionalParticles={link => {
                  if (selectedNode) {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 4 : 0;
                  }
                  return 2;
                }}
                linkDirectionalParticleSpeed={0.005}
                onNodeClick={handleNodeClick}
                onBackgroundClick={onBackgroundClick}
                backgroundColor="#020617"
                cooldownTicks={100}
                d3VelocityDecay={0.3}
              />
            )}
            
            {/* Legend */}
            <div className="absolute bottom-6 right-6 flex items-center space-x-6 bg-slate-950/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-800/60 shadow-2xl z-20 animate-fade-in">
              {Object.entries(NODE_COLORS).map(([label, color]) => (
                <div key={label} className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}44` }} />
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
