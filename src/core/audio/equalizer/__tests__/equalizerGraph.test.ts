import {
  type AudioContextLike,
  createEqualizerGraph,
} from "../equalizerGraph";

interface FakeParam {
  value: number;
  setValueAtTime: (value: number, time: number) => void;
}

function makeParam(): FakeParam {
  return {
    value: 0,
    setValueAtTime(value) {
      this.value = value;
    },
  };
}

function makeNode(extra: Record<string, unknown> = {}): any {
  const node = {
    connections: [] as unknown[],
    connect(target: unknown) {
      node.connections.push(target);
      return target;
    },
    disconnect: jest.fn(),
    ...extra,
  };
  return node;
}

function makeContext() {
  const filters: ReturnType<typeof makeNode>[] = [];
  const gains: ReturnType<typeof makeNode>[] = [];
  const context = {
    destination: makeNode(),
    createBiquadFilter() {
      const filter = makeNode({
        type: "peaking",
        frequency: makeParam(),
        gain: makeParam(),
        Q: makeParam(),
      });
      filters.push(filter);
      return filter;
    },
    createGain() {
      const gain = makeNode({ gain: makeParam() });
      gains.push(gain);
      return gain;
    },
  };
  return { context: context as unknown as AudioContextLike, filters, gains };
}

describe("createEqualizerGraph", () => {
  it("builds a 15-filter peaking chain ending at the preamp output", () => {
    const { context, filters, gains } = makeContext();
    const graph = createEqualizerGraph(context);

    expect(filters).toHaveLength(15);
    // input gain + preamp gain
    expect(gains).toHaveLength(2);
    expect(graph.bandCount).toBe(15);

    const [inputGain, preamp] = gains;
    expect(inputGain.connections[0]).toBe(filters[0]);
    for (let i = 0; i < 14; i += 1) {
      expect(filters[i].connections[0]).toBe(filters[i + 1]);
    }
    expect(filters[14].connections[0]).toBe(preamp);
    expect(graph.output).toBe(preamp);
    expect(graph.input).toBe(inputGain);
  });

  it("applies and clamps per-band gains", () => {
    const { context, filters } = makeContext();
    const graph = createEqualizerGraph(context);

    graph.setBandGain(0, 6);
    expect(filters[0].gain.value).toBe(6);
    expect(graph.getBandGain(0)).toBe(6);

    graph.setBandGain(0, 999);
    expect(filters[0].gain.value).toBe(12);

    graph.setBandGain(999, 5); // out of range index is a no-op
    expect(graph.getBandGain(999)).toBe(0);
  });

  it("applies full curves and preamp", () => {
    const { context, filters, gains } = makeContext();
    const graph = createEqualizerGraph(context);

    graph.setBands([3, ...new Array(14).fill(-3)]);
    expect(filters[0].gain.value).toBe(3);
    expect(filters[1].gain.value).toBe(-3);

    graph.setPreamp(-4);
    expect(gains[1].gain.value).toBe(-4);
    expect(graph.getPreamp()).toBe(-4);
  });

  it("bypass zeroes the effective curve and restores it on un-bypass", () => {
    const { context, filters, gains } = makeContext();
    const graph = createEqualizerGraph(context);
    graph.setBandGain(2, 5);
    graph.setPreamp(2);

    graph.setBypassed(true);
    expect(graph.isBypassed()).toBe(true);
    expect(filters[2].gain.value).toBe(0);
    expect(gains[1].gain.value).toBe(0);

    graph.setBypassed(false);
    expect(filters[2].gain.value).toBe(5);
    expect(gains[1].gain.value).toBe(2);
    expect(graph.getBandGain(2)).toBe(5);
  });

  it("disposes every node without throwing", () => {
    const { context, filters } = makeContext();
    const graph = createEqualizerGraph(context);
    expect(() => graph.dispose()).not.toThrow();
    expect(filters[0].disconnect).toHaveBeenCalled();
  });
});
