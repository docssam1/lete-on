"""Independent authoring gate using the installed NetworkX Euler implementation."""
import json
import sys
from pathlib import Path
import networkx as nx

bank = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
proofs = []
for question in bank["problems"]:
    nodes, edges = question["nodes"], question["edges"]
    graph = nx.Graph()
    graph.add_nodes_from(nodes)
    graph.add_edges_from(edges)
    assert graph.number_of_edges() == len(edges)
    assert nx.is_connected(graph)
    starts = [node for node in graph if nx.has_eulerian_path(graph, source=node)]
    assert set(starts) == set(question["starts"]), question["id"]
    trails = {}
    for start in starts:
        trail = list(nx.eulerian_path(graph, source=start))
        assert len(trail) == len(edges)
        trails[start] = [trail[0][0]] + [edge[1] for edge in trail]
    # Every visible junction must be an edge endpoint, never a hidden crossing.
    def cross(a, b, c):
        return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    for a, b in edges:
        for name, point in nodes.items():
            if name not in (a, b) and cross(nodes[a], nodes[b], point) == 0:
                assert not all(min(nodes[a][i], nodes[b][i]) <= point[i] <= max(nodes[a][i], nodes[b][i]) for i in (0, 1)), (question["id"], "unsplit junction")
    for i, (a, b) in enumerate(edges):
        for c, d in edges[i+1:]:
            if set((a, b)) & set((c, d)):
                continue
            assert not (cross(nodes[a], nodes[b], nodes[c])*cross(nodes[a], nodes[b], nodes[d]) < 0 and cross(nodes[c], nodes[d], nodes[a])*cross(nodes[c], nodes[d], nodes[b]) < 0), (question["id"], "unmarked crossing")
    proofs.append({"id": question["id"], "starts": starts, "trails": trails, "odd": [n for n, degree in graph.degree if degree % 2]})
print(json.dumps({"status": "PASS", "networkx": nx.__version__, "proofs": proofs}))
